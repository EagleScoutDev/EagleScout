import { View, Text } from "react-native";
import { RadioButton } from "../../input/RadioButton.tsx";

export interface FormRadioProps<T extends string> {
    options: T[];
    disabled?: boolean;
    required?: boolean;
    value: string;
    onInput: (value: string) => void;
}
export function FormRadio<T extends string>({ options, value, disabled = false, onInput }: FormRadioProps<T>) {
    return (
        <View>
            {options.map((item) => (
                <RadioButton disabled={disabled} value={value === item} onPress={() => onInput(item)} text={item} />
            ))}
        </View>
    );
}
