import { type LayoutChangeEvent, View } from "react-native";
import type { ReactElement } from "react";
import Animated, { useDerivedValue, useSharedValue } from "react-native-reanimated";

export interface ThreeCenterLayoutProps {
    gap?: number;
    children: [left: ReactElement, center: ReactElement, right: ReactElement];
}
export function ThreeCenterLayout({ gap = 16, children }: ThreeCenterLayoutProps) {
    // Manually calculate the positioning of the center element,
    // such that it consumes the maximum space whilst
    // remaining centered relative to the container
    const leftWidth = useSharedValue(0);
    const rightWidth = useSharedValue(0);
    function updateLeftLayout(e: LayoutChangeEvent) {
        leftWidth.set(e.nativeEvent.layout.width);
    }
    function updateRightLayout(e: LayoutChangeEvent) {
        rightWidth.set(e.nativeEvent.layout.width);
    }

    const centerMargin = useDerivedValue(
        () => Math.max(leftWidth.value, rightWidth.value) + gap,
        [leftWidth, rightWidth]
    );

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", position: "relative" }}>
            <View onLayout={updateLeftLayout}>{children[0]}</View>
            <View
                style={{
                    position: "absolute",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                }}
            >
                <Animated.View style={{ marginHorizontal: centerMargin }}>{children[1]}</Animated.View>
            </View>
            <View onLayout={updateRightLayout}>{children[2]}</View>
        </View>
    );
}
