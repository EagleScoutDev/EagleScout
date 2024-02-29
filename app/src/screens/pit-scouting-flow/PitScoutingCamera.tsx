import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
  const [isCapturing, setIsCapturing] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);
  const onCapturePress = useCallback(async () => {
    if (camera.current == null) {
      return;
    }
    setIsCapturing(true);
    const file = await camera.current
      .takePhoto()
      .catch(e => {
      console.log(e);
    });
    console.log('hi');
    const result = await fetch(`file://${file.path}`);
    const data = await result.blob();
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      setIsCapturing(false);
      onPhotoTaken(dataUrl as string);
    };
    reader.readAsDataURL(data);
  }, [camera, onPhotoTaken]);
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
