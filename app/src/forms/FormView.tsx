import { View } from "react-native";
import { FormItem } from "./FormItem.tsx";
import { Form } from "../lib/forms";
import { arr } from "../lib/util/im.ts";

export interface FormViewProps {
    items: Form.Structure;

    data: Form.Data;
    onInput: (data: Form.Data) => void;
}
export function FormView({ items, data }: FormViewProps) {
    return (
        <View style={{ width: "100%" }}>
            {items.map((item, i) => {
                return <FormItem key={i} item={item} value={data[i]} onInput={(value) => arr.set(data, i, value)} />;
            })}
        </View>
    );
}
