import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTheme } from "@react-navigation/native";
import type { StyleProp, ViewStyle } from "react-native";

export interface CheckboxProps {
    text?: string;
    value: boolean;
    disabled?: boolean;
    onInput: (value: boolean) => void;
    style?: StyleProp<ViewStyle>;
}
export function UICheckbox({ text, value, disabled = false, onInput, style }: CheckboxProps) {
    "use memo";
    const { colors } = useTheme();

    return (
        <BouncyCheckbox
            fillColor={colors.primary}
            text={text ?? ""}
            style={style}
            iconStyle={{
                borderRadius: 3,
            }}
            innerIconStyle={{
                borderRadius: 3,
            }}
            textStyle={{
                color: colors.text,
                textDecorationLine: "none",
            }}
            disabled={disabled}
            useBuiltInState={false}
            isChecked={value}
            onPress={() => onInput(!value)}
        />
    );
}
