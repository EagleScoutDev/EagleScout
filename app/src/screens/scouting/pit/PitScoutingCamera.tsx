import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { CaptureButton } from "./CaptureButton";
import { PinchGestureHandler, type PinchGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Reanimated, {
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedProps,
    useSharedValue,
} from "react-native-reanimated";
import { type Theme, useTheme } from "@react-navigation/native";
import { exMemo } from "../../../lib/react/util/memo.ts";

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const SCALE_FULL_ZOOM = 3;
const MAX_ZOOM_FACTOR = 10;

export interface PitScoutingCameraProps {
    onPhotoTaken: (photo: string) => void;
    onCancel: () => void;
}
export function PitScoutingCamera({ onPhotoTaken, onCancel }: PitScoutingCameraProps) {
    const { colors } = useTheme();
    const s = styles(colors);
    const [isCapturing, setIsCapturing] = useState(false);
    const { hasPermission, requestPermission } = useCameraPermission();

    const device = useCameraDevice("back");
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
        const file = await camera.current.takePhoto().catch(console.error); //< TODO: no
        if (file) {
            const data = await fetch(`file://${file.path}`).then((r) => r.blob());
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                setIsCapturing(false);
                onPhotoTaken(dataUrl as string);
            };
            reader.readAsDataURL(data);
        }
    }, [camera, onPhotoTaken]);
    const zoom = useSharedValue(0);
    const minZoom = device?.minZoom ?? 1;
    const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

    const cameraAnimatedProps = useAnimatedProps(() => {
        return {
            zoom: Math.max(Math.min(zoom.value, maxZoom), minZoom),
        };
    }, [maxZoom, minZoom, zoom]);
    const neutralZoom = device?.neutralZoom ?? 1;
    useEffect(() => {
        // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
        zoom.value = neutralZoom;
    }, [neutralZoom, zoom]);

    const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
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
                Extrapolate.CLAMP
            );
            zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
        },
    });

    if (device == null || !hasPermission) {
        return (
            <View style={s.na_container}>
                <Text>No camera found</Text>
                <TouchableOpacity onPress={onCancel} style={s.na_opacity}>
                    <Text style={s.na_text}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <View style={s.cancelButtonContainer}>
                <Pressable style={s.cancelButton} onPress={onCancel}>
                    <Text style={s.cancelButtonText}>X</Text>
                </Pressable>
            </View>
            <CaptureButton onPress={onCapturePress} loading={isCapturing} />
            <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={true}>
                <ReanimatedCamera
                    style={s.camera}
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

const styles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        na_container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
        },
        na_opacity: {
            backgroundColor: colors.background,
            padding: 10,
            borderRadius: 10,
        },
        na_text: {
            color: colors.text,
        },

        container: {
            flex: 1,
        },
        camera: {
            flex: 1,
        },
        cancelButtonContainer: {
            position: "absolute",
            top: 50,
            right: 30,
            zIndex: 1,
        },
        cancelButton: {
            backgroundColor: "white",
            padding: 10,
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        cancelButtonText: {
            width: 20,
            height: 20,
            color: "black",
            textAlign: "center",
        },
    })
);
