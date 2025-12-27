import { Text, type TextProps } from "react-native";
import type { Color } from "@/ui/lib/color";
import { useTheme } from "@/ui/context/ThemeContext";

export interface UITextProps extends Omit<TextProps, "role"> {
    size?: number;
    placeholder?: true;
    color?: Color | false | undefined | null;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    nowrap?: boolean;
}
export function UIText({
    size = 14,
    placeholder,
    color,
    bold = false,
    italic = false,
    underline = false,
    nowrap = false,
    children,
    style,
    ...props
}: UITextProps) {
    const { colors } = useTheme();

    return (
        <Text
            {...props}
            style={[
                {
                    fontSize: size,
                    color: (color || (placeholder ? colors.placeholder : colors.fg)).hex,
                    fontWeight: bold ? "bold" : "normal",
                    flexWrap: nowrap ? "nowrap" : "wrap",
                    textDecorationLine: underline ? "underline" : undefined,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}
