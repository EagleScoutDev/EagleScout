import { FormHeading } from "../../../../../forms/components/FormHeading.tsx";
import { FormQuestion } from "../../../../../forms/components/FormQuestion.tsx";
import { Form } from "../../../../../lib/forms";
import ItemType = Form.ItemType;
import * as Bs from "../../../../../ui/icons";
import { StyleSheet, Text, View } from "react-native";

export interface FormItemInfoProps {
    item: Form.Item;
}
export function FormItemInfo({ item }: FormItemInfoProps) {
    "use memo";
    const styles = StyleSheet.create({
        text: {
            fontSize: 16,
            flexGrow: 1,
        },
    });

    return item.type === ItemType.heading ? (
        <FormHeading item={item} />
    ) : item.type === ItemType.radio ? (
        <FormQuestion icon={Bs.UiRadios} title={item.question} required={item.required}>
            <Text style={styles.text}>{item.options.join(", ")}</Text>
        </FormQuestion>
    ) : item.type === ItemType.checkbox ? (
        <FormQuestion icon={Bs.UiChecksGrid} title={item.question} required={item.required}>
            <Text style={styles.text}>{item.options.join(", ")}</Text>
        </FormQuestion>
    ) : item.type === ItemType.number && item.slider ? (
        <FormQuestion icon={Bs.Sliders} title={item.question} required={item.required}>
            <Text style={styles.text}>
                Min: {item.low}
                {item.lowLabel && ` (${item.lowLabel})`}
            </Text>
            <Text style={styles.text}>
                Max: {item.high}
                {item.highLabel && ` (${item.highLabel})`}
            </Text>
            <Text style={styles.text}>Step: {item.step}</Text>
        </FormQuestion>
    ) : item.type === ItemType.number && !item.slider ? (
        <FormQuestion icon={Bs.OneTwoThree} title={item.question} required={item.required}>
            <Text style={styles.text}>Min: {item.low ?? "-∞"}</Text>
            <Text style={styles.text}>Max: {item.high ?? "∞"}</Text>
            <Text style={styles.text}>Step: {item.step}</Text>
        </FormQuestion>
    ) : item.type === ItemType.textbox ? (
        <FormQuestion icon={Bs.InputCursorText} title={item.question} required={item.required} />
    ) : null;
}
