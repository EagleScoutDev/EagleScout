import { Pressable, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { ComponentProps, ReactNode } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableOpacityProps extends ComponentProps<typeof Pressable> {
    disabled?: boolean;
    activeOpacity?: number;
    disabledOpacity?: number;
    style?: ViewStyle;
    children?: ReactNode;
}

export function PressableOpacity({
    disabled = false,
    activeOpacity = 0.5,
    disabledOpacity = 0.2,
    style,
    ...passthrough
}: PressableOpacityProps) {
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: disabled ? disabledOpacity : opacity.value,
    }));

    return (
        <AnimatedPressable
            {...passthrough}
            disabled={disabled}
            style={[style, animatedStyle]}

            // TODO: these should run on the UI thread
            onPressIn={() => opacity.set(withTiming(activeOpacity, { duration: 100 }))}
            onPressOut={() => opacity.set(withTiming(1, { duration: 75 }))}
        />
    );
}
