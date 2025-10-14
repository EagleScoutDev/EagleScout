import type { Icon } from "./icons";
import {
    ActivityIndicator,
    type DimensionValue,
    type StyleProp,
    StyleSheet,
    Text,
    type TextStyle,
    type ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { type PropsWithChildren } from "react";
import { Color, parseColor, RGB } from "../lib/color.ts";
import { PressableOpacity } from "./components/PressableOpacity.tsx";

export const enum UIButtonFrame {
    fill,
    tint,
    text,
}
export const enum UIButtonSize {
    sm,
    md,
    lg,
    xl,
}
export interface UIButtonProps {
    frame?: UIButtonFrame;
    size?: UIButtonSize;
    color?: Color;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

    icon?: Icon;
    text?: string;
    loading?: boolean;

    onPress?: (() => void) | null | undefined;
}
export function UIButton({
    frame = UIButtonFrame.text,
    size,
    color,
    style,
    textStyle,
    icon,
    text,
    loading = false,
    onPress = null,
    children,
}: PropsWithChildren<UIButtonProps>) {
    const { colors } = useTheme();
    color = color ?? RGB(...parseColor(colors.primary));

    const { styles, iconProps } = getStyles(color, size, frame);

    return (
        <PressableOpacity onPress={onPress} style={[styles.button, style]}>
            {loading ? (
                <ActivityIndicator color="#ffffff" />
            ) : (
                children ?? (
                    <>
                        {icon ? icon(iconProps) : null}
                        <Text style={[styles.text, textStyle]}>{text}</Text>
                    </>
                )
            )}
        </PressableOpacity>
    );
}

const getStyles = (color: Color, size: UIButtonSize | undefined, frame: UIButtonFrame) => {
    let maxWidth: DimensionValue | undefined = undefined;
    let height: DimensionValue | undefined = undefined;
    let paddingHorizontal: DimensionValue | undefined = undefined;
    let paddingVertical: DimensionValue | undefined = undefined;
    let borderRadius: DimensionValue | undefined = undefined;
    let fontSize: DimensionValue | undefined = undefined;
    let fontWeight: TextStyle["fontWeight"] | undefined = undefined;
    let iconSize: DimensionValue | undefined = undefined;
    switch (size) {
        case undefined:
            break;
        case UIButtonSize.xl:
            maxWidth = 400;
            height = 45;
            paddingHorizontal = 20;
            paddingVertical = 8;
            borderRadius = 10;
            fontSize = 22;
            fontWeight = "normal";
            iconSize = 24;
            break;
        case UIButtonSize.lg:
            throw new Error("not implemented");
        case UIButtonSize.md:
            borderRadius = 12;
            paddingVertical = 8;
            paddingHorizontal = 10;
            fontSize = 18;
            break
        case UIButtonSize.sm:
            throw new Error("not implemented");
    }

    let fg: Color;
    let bg: Color;
    switch (frame) {
        case UIButtonFrame.text:
            fg = color!;
            bg = Color.transparent;
            break;
        case UIButtonFrame.tint:
            fg = color!;
            bg = color!.set(null, null, null, 70);
            break;
        case UIButtonFrame.fill:
            fg = color!.fg;
            bg = color!;
            break;
    }

    return {
        styles: StyleSheet.create({
            button: {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bg.rgba,
                maxWidth,
                height,
                paddingHorizontal,
                paddingVertical,
                borderRadius,
            },
            text: {
                color: fg.rgba,
                fontSize,
                fontWeight,
            },
        }),
        iconProps: {
            size: iconSize,
            fill: fg.rgba,
        },
    };
};
