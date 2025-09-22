import { type StyleProp, TextInput, type TextStyle } from "react-native";
import { useState } from "react";

export interface NumberInputProps {
    value?: number | null;
    placeholder?: string;
    placeholderTextColor?: string;
    float?: boolean;
    min?: number;
    max?: number;

    onInput?: (value: number) => void;
    style?: StyleProp<TextStyle>;
}
export function NumberInput({
    value: initialValue = null,
    placeholder,
    placeholderTextColor,
    float = false,
    min,
    max,
    onInput,
    style = {},
}: NumberInputProps) {
    let [value, setValue] = useState<number | null>(initialValue);
    let [draft, setDraft] = useState<string>(initialValue?.toString() ?? "");

    return (
        <TextInput
            value={draft}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType="numeric"
            onChangeText={setDraft}
            onEndEditing={() => {
                let x = float ? parseFloat(draft) : parseInt(draft);

                if (Number.isNaN(x)) {
                    setDraft(value?.toString() ?? "");
                }
                else if (min !== undefined && x < min) {
                    setValue(min);
                    setDraft(min.toString());
                } else if (max !== undefined && x > max) {
                    setValue(max);
                    setDraft(max.toString());
                } else {
                    setValue(x);
                    setDraft(x.toString());
                    if (onInput) onInput(x);
                }
            }}
            style={style}
        />
    );
}
