import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import CaptureButton from './CaptureButton';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '@react-navigation/native';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
// Reanimated.addWhitelistedNativeProps({
//   zoom: true,
// });

const SCALE_FULL_ZOOM = 3;
const MAX_ZOOM_FACTOR = 10;

export default function PitScoutingCamera({
  onPhotoTaken,
  onCancel,
}: {
  onPhotoTaken: (photoData: string) => void;
  onCancel: () => void;
}) {
  const {colors} = useTheme();
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('auto');
  const [isCapturing, setIsCapturing] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  useEffect(() => {
    if (hasPermission == null) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);
  const onCapturePress = useCallback(async () => {
    if (camera.current == null) {
      return;
    }
    setIsCapturing(true);
    const file = await camera.current.takePhoto({
      flash: flash,
    });
    const result = await fetch(`file://${file.path}`);
    const data = await result.blob();
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      setIsCapturing(false);
      onPhotoTaken(dataUrl as string);
    };
    reader.readAsDataURL(data);
  }, [camera, onPhotoTaken, flash]);
  const zoom = useSharedValue(0);
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  if (device == null || !hasPermission) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <Text>No camera found</Text>
        <TouchableOpacity
          onPress={onCancel}
          style={{
            backgroundColor: colors.background,
            padding: 10,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: colors.text,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.flashButtonContainer}>
        <Pressable
          style={styles.flashButton}
          onPress={() => {
            if (flash === 'on') {
              setFlash('off');
            } else if (flash === 'off') {
              setFlash('auto');
            } else {
              setFlash('on');
            }
          }}>
          {flash === 'off' && (
            <Svg
              viewBox="0 0 512 512"
              style={{
                width: 24,
                height: 24,
              }}>
              <Path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM294.34 84.28l-22.08 120.84a16 16 0 006.17 15.71 16.49 16.49 0 009.93 3.17h94.12l-38.37 47.42a4 4 0 00.28 5.34l17.07 17.07a4 4 0 005.94-.31l60.8-75.16a16.37 16.37 0 003.3-14.36 16 16 0 00-15.5-12H307.19L335.4 37.63c.05-.3.1-.59.13-.89A18.45 18.45 0 00302.73 23l-92.58 114.46a4 4 0 00.28 5.35l17.07 17.06a4 4 0 005.94-.31zM217.78 427.57l22-120.71a16 16 0 00-6.19-15.7 16.54 16.54 0 00-9.92-3.16h-94.1l38.36-47.42a4 4 0 00-.28-5.34l-17.07-17.07a4 4 0 00-5.93.31L83.8 293.64A16.37 16.37 0 0080.5 308 16 16 0 0096 320h108.83l-28.09 154.36v.11a18.37 18.37 0 0032.5 14.53l92.61-114.46a4 4 0 00-.28-5.35l-17.07-17.06a4 4 0 00-5.94.31z" />
            </Svg>
          )}
          {flash === 'on' && (
            <Svg
              viewBox="0 0 512 512"
              style={{
                width: 24,
                height: 24,
              }}>
              <Path
                d="M315.27 33L96 304h128l-31.51 173.23a2.36 2.36 0 002.33 2.77h0a2.36 2.36 0 001.89-.95L416 208H288l31.66-173.25a2.45 2.45 0 00-2.44-2.75h0a2.42 2.42 0 00-1.95 1z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
            </Svg>
          )}
          {flash === 'auto' && (
            <Svg
              viewBox="0 0 512 512"
              style={{
                width: 24,
                height: 24,
              }}>
              <Path d="M194.82 496a18.36 18.36 0 01-18.1-21.53v-.11L204.83 320H96a16 16 0 01-12.44-26.06L302.73 23a18.45 18.45 0 0132.8 13.71c0 .3-.08.59-.13.89L307.19 192H416a16 16 0 0112.44 26.06L209.24 489a18.45 18.45 0 01-14.42 7z" />
            </Svg>
          )}
        </Pressable>
      </View>
      <View style={styles.cancelButtonContainer}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text
            style={{
              color: colors.text,
            }}>
            X
          </Text>
        </Pressable>
      </View>
      <CaptureButton onPress={onCapturePress} loading={isCapturing} />
      <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={true}>
        <ReanimatedCamera
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          animatedProps={cameraAnimatedProps}
          ref={camera}
        />
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  flashButtonContainer: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 1,
  },
  flashButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 999,
  },
});
