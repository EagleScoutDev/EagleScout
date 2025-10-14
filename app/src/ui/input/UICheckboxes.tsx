import { View } from "react-native";
import { UICheckbox } from "./UICheckbox.tsx";

export interface UICheckboxesProps<T extends string> {
    options: T[];
    value: T[];
    onInput?: undefined | ((x: T[]) => void);
}
export function UICheckboxes<T extends string>({ options, value, onInput }: UICheckboxesProps<T>) {
    return (
        <View>
            {options.map((item, index) => (
                <UICheckbox
                    value={value.includes(item)}
                    onInput={(x) => {
                        if (!onInput) return;

                        if (x) {
                            onInput(value.includes(item) ? value : [...value, item]);
                        } else {
                            onInput(value.filter((x) => x !== item));
                        }
                    }}
                />
            ))}
        </View>
    );
}
