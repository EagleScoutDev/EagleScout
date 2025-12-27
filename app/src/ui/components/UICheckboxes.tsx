import { View } from "react-native";
import { UICheckbox } from "@/ui/components/UICheckbox";

export interface UICheckboxesProps<T> {
    options: ((T & string) | { key: T; label: string })[];
    disabled?: boolean;
    value: T[];
    onInput?: undefined | ((x: T[]) => void);
}
export function UICheckboxes<T extends string>({ options, disabled = false, value, onInput }: UICheckboxesProps<T>) {
    return (
        <View style={{ gap: 8 }}>
            {options.map((item, index) => {
                const [key, label]: [T, string] = typeof item === "string" ? [item, item] : [item.key, item.label];
                const checked = value.includes(key);

                return (
                    <UICheckbox
                        key={index}
                        disabled={disabled}
                        text={label}
                        value={checked}
                        onInput={(x) => {
                            if (!onInput) return;

                            if (x) {
                                onInput(checked ? value : [...value, key]);
                            } else {
                                onInput(value.filter((x) => x !== item));
                            }
                        }}
                    />
                );
            })}
        </View>
    );
}
