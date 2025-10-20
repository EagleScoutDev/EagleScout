import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTheme } from "@react-navigation/native";

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
            fillColor={colors.primary}
            text={text ?? ""}
            textStyle={{
                color: colors.text,
                textDecorationLine: "none",
            }}
            useBuiltInState={false}
            isChecked={value}
            disabled={disabled}
            onPress={onPress}
        />
    );
}
