import { StyleSheet } from "react-native";
import { exMemo } from "@/lib/util/react/memo";
import { NumberInput, type NumberInputProps } from "@/ui/components/NumberInput";
import type { Theme } from "@/ui/lib/theme";
import { useTheme } from "@/ui/context/ThemeContext";

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
            color: colors.fg.hex,
        },
    }),
);
