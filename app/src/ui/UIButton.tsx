import { useTheme } from "@react-navigation/native";
import { type PropsWithChildren, useState } from "react";
import { ActivityIndicator, type StyleProp, Text, type TextStyle, View, type ViewStyle } from "react-native";
import { Color } from "../lib/color.ts";
import { PressableOpacity } from "./components/PressableOpacity.tsx";
import type { Icon } from "./icons";

export const enum UIButtonStyle {
    fill,
    tint,
    text,
}
export const enum UIButtonSize {
    // sm,
    md,
    // lg,
    xl,
}
export interface UIButtonProps {
    style?: UIButtonStyle;
    size?: UIButtonSize;
    color?: Color;

    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

    icon?: Icon;
    text?: string;
    loading?: boolean;

    onPress?: (() => void | Promise<void>) | null | undefined;
}
export function UIButton({
    style = UIButtonStyle.text,
    size,
    color,
    buttonStyle,
    textStyle,
    icon,
    text,
    loading = false,
    onPress = null,
    children,
}: PropsWithChildren<UIButtonProps>) {
    "use memo";
    const { colors } = useTheme();

    color = color ?? Color.parse(colors.primary);

    const {
        fg: { hex: fg },
        bg: { hex: bg },
        spinner: { hex: spinnerColor },
    } = getColors(style, color);
    const sizeStyles = getSizeStyles(size ?? UIButtonSize.md);

    const [processing, setProcessing] = useState(false);
    const doPress =
        onPress &&
        (async () => {
            if (loading || processing) return;

            const res = onPress();
            if (res instanceof Promise) {
                setProcessing(true);
                res.then(() => setProcessing(false));
            }
        });

    return (
        <PressableOpacity onPress={doPress} style={[sizeStyles.button, { backgroundColor: bg }, buttonStyle]}>
            {(loading || processing) && (
                <ActivityIndicator
                    style={{ position: "absolute", width: "100%", height: "100%" }}
                    color={spinnerColor}
                />
            )}
            {/* When the spinner is visible, only hide the body so proper dimensions are kept */}
            <View style={{ opacity: loading || processing ? 0 : 1 }}>
                {children ?? (
                    <>
                        {icon && icon({ ...sizeStyles.icon, fill: fg })}
                        {typeof text === "string" && (
                            <Text style={[sizeStyles.text, { color: fg }, textStyle]}>{text}</Text>
                        )}
                    </>
                )}
            </View>
        </PressableOpacity>
    );
}

const getSizeStyles = (size: UIButtonSize) => sizeStyles[size];
const sizeStyles = {
    [UIButtonSize.xl]: {
        button: {
            width: "100%",
            maxWidth: 400,
            height: 48,
            paddingHorizontal: 20,
            paddingVertical: 8,
            position: "relative",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",

            borderRadius: 10,
            gap: 4,
        },
        text: {
            fontSize: 20,
        },
        icon: {
            size: 24,
        },
    },
    [UIButtonSize.md]: {
        button: {
            paddingVertical: 8,
            paddingHorizontal: 10,
            position: "relative",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",

            borderRadius: 12,
            gap: 4,
        },
        text: {
            fontSize: 18,
        },
        icon: {
            size: 20,
        },
    },
} as const;

const getColors = (style: UIButtonStyle, color: Color) => {
    switch (style) {
        case UIButtonStyle.text:
            return { fg: color, spinner: Color.parse("#999999"), bg: Color.transparent };
        case UIButtonStyle.tint:
            return { fg: color, spinner: color, bg: color.set(null, null, null, 70) };
        case UIButtonStyle.fill:
            return { fg: color.fg, spinner: color.fg, bg: color };
    }
};
