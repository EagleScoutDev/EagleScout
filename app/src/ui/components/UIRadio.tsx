import { View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTheme } from "@/ui/context/ThemeContext";

export interface UIBaseRadioProps<T extends string> {
    options: T[];
    disabled?: boolean;
}
export interface UIRequiredRadioProps<T extends string> extends UIBaseRadioProps<T> {
    required: true;
    value: T;
    onInput?: (value: T) => void;
}
export interface UIOptionalRadioProps<T extends string> extends UIBaseRadioProps<T> {
    required?: false;
    value: T | null;
    onInput?: (value: T | null) => void;
}
export type UIRadioProps<T extends string> = UIOptionalRadioProps<T> | UIRequiredRadioProps<T>;

export function UIRadio<T extends string>({
    options,
    value,
    required,
    disabled = false,
    onInput,
}: UIRadioProps<T>) {
    const { colors } = useTheme();

    return (
        <View style={{ gap: 8 }}>
            {options.map((item, index) => (
                <BouncyCheckbox
                    key={index}
                    disabled={disabled}
                    isChecked={value === item}
                    fillColor={colors.primary.hex}
                    text={item}
                    textStyle={{
                        color: colors.fg.hex,
                        textDecorationLine: "none",
                    }}
                    useBuiltInState={false}
                    onPress={() => {
                        if (!onInput) return;

                        if (value === item) {
                            if (!required) {
                                onInput(null);
                            }
                        } else onInput(item);
                    }}
                />
            ))}
        </View>
    );
}
