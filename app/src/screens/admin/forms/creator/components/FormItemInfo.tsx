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
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={[styles.text, { textAlign: "left", flexGrow: 1 }]}>
                    {item.low}{item.lowLabel && ` (${item.lowLabel})`}
                </Text>
                <Text style={[styles.text, { textAlign: "center" }]}>Step: {item.step}</Text>
                <Text style={[styles.text, { textAlign: "right", flexGrow: 1 }]}>
                    {item.highLabel && `(${item.highLabel}) `}{item.high}
                </Text>
            </View>
        </FormQuestion>
    ) : item.type === ItemType.number && !item.slider ? (
        <FormQuestion icon={Bs.OneTwoThree} title={item.question} required={item.required} />
    ) : item.type === ItemType.textbox ? (
        <FormQuestion icon={Bs.InputCursorText} title={item.question} required={item.required} />
    ) : null;
}
