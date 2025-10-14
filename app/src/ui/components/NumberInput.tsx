import { type StyleProp, type TextInputProps, type TextStyle } from "react-native";
import { useState } from "react";
import { AutoTextInput } from "./AutoTextInput.tsx";

export interface NumberInputProps extends Omit<TextInputProps, "value" | `on${string}`> {
    float?: boolean;
    min?: number;
    max?: number;

    style?: StyleProp<TextStyle>;

    value: number | null,
    onInput?: ((value: number) => void) | null | undefined;
}
export function NumberInput({
    value: initialValue = null,
    float = false,
    min,
    max,
    onInput,
    ...passthrough
}: NumberInputProps) {
    let [value, setValue] = useState<number | null>(initialValue);
    let [draft, setDraft] = useState<string>(initialValue?.toString() ?? "");

    return (
        <AutoTextInput
            selectTextOnFocus={true}
            keyboardType="numeric"
            autoCapitalize={"none"}
            dataDetectorTypes={"none"}
            autoComplete="off"
            autoCorrect={false}

            {...passthrough}

            value={draft}
            onChangeText={setDraft}
            onEndEditing={() => {
                let x = float ? parseFloat(draft) : parseInt(draft);
                if (Number.isNaN(x)) {
                    setDraft(value?.toString() ?? "");
                } else if (min !== undefined && x < min) {
                    setValue(min);
                    setDraft(min.toString());
                } else if (max !== undefined && x > max) {
                    setValue(max);
                    setDraft(max.toString());
                } else {
                    setValue(x);
                    setDraft(x.toString());
                    onInput?.(x);
                }
            }}
        />
    );
}
