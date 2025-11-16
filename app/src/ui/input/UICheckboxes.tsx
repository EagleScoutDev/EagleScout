import { View } from "react-native";
import { UICheckbox } from "./UICheckbox";

export interface UICheckboxesProps<T extends string> {
    options: T[];
    disabled?: boolean;
    value: T[];
    onInput?: undefined | ((x: T[]) => void);
}
export function UICheckboxes<T extends string>({ options, disabled = false, value, onInput }: UICheckboxesProps<T>) {
    "use memo";

    return (
        <View style={{ gap: 8 }}>
            {options.map((item, index) => (
                <UICheckbox
                    key={index}
                    disabled={disabled}
                    text={item}
                    value={value.includes(item)}
                    onInput={(x) => {
                        if (!onInput) return;

                        if (!x) {
                            console.log(value.includes(item) ? value : [...value, item]);
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
