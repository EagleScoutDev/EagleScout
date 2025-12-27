import { FormHeading } from "@/components/FormHeading";
import { FormQuestion } from "@/components/FormQuestion";
import { Form } from "@/lib/forms";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import ItemType = Form.ItemType;

export interface FormItemInfoProps {
    item: Form.Item;
}
export function FormItemInfo({ item }: FormItemInfoProps) {
    return item.type === ItemType.heading ? (
        <FormHeading item={item} />
    ) : item.type === ItemType.radio ? (
        <FormQuestion icon={Bs.UiRadios} title={item.question} required={item.required}>
            <UIText size={16}>{item.options.join(", ")}</UIText>
        </FormQuestion>
    ) : item.type === ItemType.checkbox ? (
        <FormQuestion icon={Bs.UiChecksGrid} title={item.question} required={item.required}>
            <UIText size={16}>{item.options.join(", ")}</UIText>
        </FormQuestion>
    ) : item.type === ItemType.number && item.slider ? (
        <FormQuestion icon={Bs.Sliders} title={item.question} required={item.required}>
            <UIText size={16}>
                Min: {item.low}
                {item.lowLabel && ` (${item.lowLabel})`}
            </UIText>
            <UIText size={16}>
                Max: {item.high}
                {item.highLabel && ` (${item.highLabel})`}
            </UIText>
            <UIText size={16}>Step: {item.step}</UIText>
        </FormQuestion>
    ) : item.type === ItemType.number && !item.slider ? (
        <FormQuestion icon={Bs.OneTwoThree} title={item.question} required={item.required}>
            <UIText size={16}>Min: {item.low ?? "-∞"}</UIText>
            <UIText size={16}>Max: {item.high ?? "∞"}</UIText>
            <UIText size={16}>Step: {item.step}</UIText>
        </FormQuestion>
    ) : item.type === ItemType.textbox ? (
        <FormQuestion icon={Bs.InputCursorText} title={item.question} required={item.required} />
    ) : null;
}
