import { type StyleProp, type TextInputProps, type TextStyle } from "react-native";
import { useState } from "react";
import { AutoTextInput } from "@/components/AutoTextInput";

export interface NumberInputProps extends Omit<TextInputProps, "value" | `on${string}`> {
    float?: boolean;
    min?: number;
    max?: number;

    style?: StyleProp<TextStyle>;

    value: number | null;
    onInput?: ((value: number | null) => void | undefined | boolean) | null | undefined;
}
export function NumberInput({
    value = null,
    float = false,
    min,
    max,
    onInput,
    ...passthrough
}: NumberInputProps) {
    let [draft, setDraft] = useState<string>(value?.toString() ?? "");

    function updateValue(newDraft: string, blurred: boolean) {
        setDraft(newDraft);

        newDraft = newDraft.trim();
        const newValue: number | null =
            newDraft === "" ? null : float ? parseFloat(newDraft) : parseInt(newDraft);
        let validValue: number | null = value;

        let valid: boolean = true;
        if (newValue !== null) {
            if (Number.isNaN(newValue)) {
                validValue = value;
                valid = false;
            } else if (min !== undefined && newValue < min) {
                validValue = min;
                valid = false;
            } else if (max !== undefined && newValue > max) {
                validValue = max;
                valid = false;
            }
        }

        if (!valid || onInput?.(newValue) === false) {
            if (blurred) setDraft(validValue?.toString() ?? "");
        }
    }

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
            onChangeText={(text) => updateValue(text, false)}
            onEndEditing={() => updateValue(draft, true)}
        />
    );
}
