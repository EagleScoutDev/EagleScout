import { TextInput, type TextInputProps, View } from "react-native";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface UITextInputProps extends Omit<TextInputProps, "editable"> {
    disabled?: boolean;
}
export function UITextInput({ style, disabled = true, ...passthrough }: UITextInputProps) {
    "use memo";
    const { colors } = useTheme();
    
    const styles = {
        main: {
            fontSize: 14,
            height: 40,
            padding: 10,
            marginVertical: 5,
            color: colors.fg.hex,
            borderRadius: 8,
            backgroundColor: colors.bg1.hex,
        },
    } as const;

    if (disabled) {
        return <View {...passthrough} style={[styles.main, style]} />;
    } else {
        return (
            <TextInput placeholderTextColor={colors.fg.level(1).hex} {...passthrough} style={[styles.main, style]} />
        );
    }
}
