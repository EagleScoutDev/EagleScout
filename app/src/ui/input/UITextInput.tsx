import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { exMemo } from "../../lib/util/react/memo.ts";
import { type Theme, useTheme } from "@react-navigation/native";

export interface UITextInputProps extends TextInputProps {}
export function UITextInput({ style, ...passthrough }: UITextInputProps) {
    "use memo";
    const { colors } = useTheme();
    const styles = getStyles(colors);
    return <TextInput placeholderTextColor={"gray"} {...passthrough} style={[styles.main, style]} />;
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        main: {
            fontSize: 14,
            height: 40,
            padding: 10,
            marginVertical: 5,
            color: colors.text,
            borderRadius: 8,
            backgroundColor: colors.card,
        },
    })
);
