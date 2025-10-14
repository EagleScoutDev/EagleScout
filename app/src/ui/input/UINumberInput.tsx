import { StyleSheet } from "react-native";
import { exMemo } from "../../lib/react/util/memo.ts";
import { type Theme, useTheme } from "@react-navigation/native";
import { NumberInput, type NumberInputProps } from "../components/NumberInput.tsx";

export interface UINumberInputProps extends NumberInputProps {}
export function UINumberInput({ style, ...passthrough }: UINumberInputProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    return <NumberInput placeholderTextColor={"gray"} {...passthrough} style={[styles.main, style]} />;
}

const getStyles = exMemo((colors: Theme["colors"]) =>
    StyleSheet.create({
        main: {
            height: 40,
            padding: 10,
            marginVertical: 5,
            color: colors.text,
        },
    })
);
