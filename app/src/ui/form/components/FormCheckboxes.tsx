import { View } from "react-native";
import { Checkbox } from "../../input/Checkbox.tsx";

export interface CheckboxesProps<T extends string> {
    options: T[];
    value: T[];
    disabled: boolean;
    onInput: (x: T[]) => void;
}
export function FormCheckboxes<T extends string>({ options, disabled, value, onInput }: CheckboxesProps<T>) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            {options.map((item, index) => (
                <Checkbox
                    disabled={disabled}
                    value={value.includes(item)}
                    onInput={(x) => {
                        if (x) {
                            return value.includes(item) ? value : [...value, item];
                        } else onInput(value.filter((x) => x !== item));
                    }}
                />
            ))}
        </View>
    );
}
