import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTheme } from "@react-navigation/native";

export interface CheckboxProps {
    text?: string;
    value: boolean;
    disabled?: boolean;
    onInput: (value: boolean) => void;
}
export function Checkbox({ text, value, disabled = false, onInput }: CheckboxProps) {
    const { colors } = useTheme();

    return (
        <BouncyCheckbox
            fillColor={colors.primary}
            text={text ?? ""}
            iconStyle={{
                borderRadius: 3,
            }}
            textStyle={{
                color: colors.text,
                textDecorationLine: "none",
            }}
            disabled={disabled}
            useBuiltInState={false}
            isChecked={value}
            onPress={onInput}
        />
    );
}
