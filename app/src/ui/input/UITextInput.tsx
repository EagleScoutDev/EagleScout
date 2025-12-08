import { Text, TextInput, type TextInputProps } from "react-native";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface UITextInputProps extends Omit<TextInputProps, "editable"> {
    disabled?: boolean;
}
export function UITextInput({ style, value, disabled = false, ...passthrough }: UITextInputProps) {
    "use memo";
    const { colors } = useTheme();

    const styles = {
        main: {
            fontSize: 14,
            minHeight: 40,
            padding: 10,
            marginVertical: 5,
            color: colors.fg.hex,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border.hex,
            backgroundColor: colors.bg1.hex,
        },
    } as const;

    if (disabled) {
        return <Text {...passthrough} style={[styles.main, style]} children={value} />;
    } else {
        return (
            <TextInput
                placeholderTextColor={colors.fg.level(1).hex}
                {...passthrough}
                value={value}
                style={[styles.main, style]}
            />
        );
    }
}
