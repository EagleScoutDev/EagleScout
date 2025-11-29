import { Text, type TextProps } from "react-native";
import { Color } from "../lib/color.ts";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

export interface UITextProps extends Omit<TextProps, "role"> {
    size?: number;
    level?: 0 | 1 | 2 | 3;
    color?: Color | false;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    nowrap?: boolean;
}
export function UIText({
    size = 14,
    level,
    color,
    bold = false,
    italic = false,
    underline = false,
    nowrap = false,
    children,
    style,
    ...props
}: UITextProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <Text
            {...props}
            style={[
                {
                    fontSize: size,
                    color: level === undefined ? (color || colors.fg).hex : (color || colors.fg).level(level).hex,
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
