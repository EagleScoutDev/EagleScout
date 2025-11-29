import BouncyCheckbox from "react-native-bouncy-checkbox";

import type { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

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
            fillColor={colors.primary.hex}
            text={text ?? ""}
            style={style}
            iconStyle={{
                borderRadius: 3,
            }}
            innerIconStyle={{
                borderRadius: 3,
            }}
            textStyle={{
                color: colors.fg.hex,
                textDecorationLine: "none",
            }}
            disabled={disabled}
            useBuiltInState={false}
            isChecked={value}
            onPress={() => onInput(!value)}
        />
    );
}
