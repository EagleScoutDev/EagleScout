import { View } from "react-native";
import { UIRadioButton } from "./UIRadioButton.tsx";

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

export function UIRadio<T extends string>({ options, value, required, disabled = false, onInput }: UIRadioProps<T>) {
    return (
        <View>
            {options.map((item, index) => (
                <UIRadioButton
                    key={index}
                    disabled={disabled}
                    value={value === item}
                    onPress={() => {
                        if (!onInput) return;

                        if (value === item) {
                            if (!required) {
                                onInput(null);
                            }
                        } else onInput(item);
                    }}
                    text={item}
                />
            ))}
        </View>
    );
}
