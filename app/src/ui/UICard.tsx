import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import { type PropsWithChildren } from "react";
import { exMemo } from "../lib/react/util/memo.ts";
import { Pressable, type PressableProps } from "react-native-gesture-handler";

export interface UICardProps extends PressableProps {
    style?: StyleProp<ViewStyle>;
}
export function UICard({ children, style, ...passthrough }: PropsWithChildren<UICardProps>) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <Pressable {...passthrough} style={[styles.card, style]}>
            <View style={styles.content}>{children}</View>
        </Pressable>
    );
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        card: {
            marginVertical: 2.5,
            width: "100%",
            borderRadius: 16,
            backgroundColor: colors.background,
            boxShadow: [
                {
                    offsetX: 1,
                    offsetY: 1,
                    color: "rgba(0,0,0,0.075)",
                    blurRadius: 1,
                    spreadDistance: 0.25,
                },
            ],
        },
        content: {
            padding: 20,
        },
        footer: {
            borderTopWidth: 1,
            borderColor: colors.border,
        },
    })
);
