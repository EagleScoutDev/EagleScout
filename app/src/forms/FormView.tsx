import { View } from "react-native";
import { FormItem } from "./FormItem.tsx";
import { Form } from "../lib/forms";

import { Arrays } from "../lib/util/Arrays.ts";

export interface FormViewProps {
    items: Form.Structure;

    data: Form.Data;
    onInput: (data: Form.Data) => void;
}
export function FormView({ items, data, onInput }: FormViewProps) {
    return (
        <View style={{ gap: 24, padding: 8 }}>
            {items.map((item, i) => {
                return (
                    <FormItem
                        key={i}
                        item={item}
                        value={data[i]}
                        onInput={(value) => onInput(Arrays.set(data, i, value))}
                    />
                );
            })}
        </View>
    );
}
