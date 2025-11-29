import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface RadioButtonProps {
    text?: string;
    value: boolean;
    disabled?: boolean;
    onPress: (value: boolean) => void;
}
export function UIRadioButton({ text, value, disabled = false, onPress }: RadioButtonProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <BouncyCheckbox
            fillColor={colors.primary.hex}
            text={text ?? ""}
            textStyle={{
                color: colors.fg.hex,
                textDecorationLine: "none",
            }}
            useBuiltInState={false}
            isChecked={value}
            disabled={disabled}
            onPress={onPress}
        />
    );
}
