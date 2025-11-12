import { UIRadio } from "../ui/input/UIRadio.tsx";
import { UIStepper } from "../ui/input/UIStepper.tsx";
import { UICheckboxes } from "../ui/input/UICheckboxes.tsx";
import { Form } from "../lib/forms";
import { UISlider } from "../ui/input/UISlider.tsx";
import { FormHeading } from "./components/FormHeading.tsx";
import { FormQuestion } from "./components/FormQuestion.tsx";
import { UITextInput } from "../ui/input/UITextInput.tsx";
import ItemType = Form.ItemType;

export interface FormComponentProps<T extends Form.Item> {
    item: T;
    value: any;
    onInput?: (value: any) => void;
}
export function FormItem<T extends Form.Item>({ item, value, onInput }: FormComponentProps<T>) {
    return item.type === ItemType.heading ? (
        <FormHeading item={item} />
    ) : (
        <FormQuestion title={item.question} required={item.required}>
            {item.type === ItemType.radio ? (
                <UIRadio
                    options={item.options}
                    required={item.required}
                    value={item.options[value]}
                    onInput={(value) => onInput?.(value === null ? null : item.options.indexOf(value))}
                />
            ) : item.type === ItemType.textbox ? (
                <UITextInput multiline={true} placeholder={"Type here"} value={value} onChangeText={onInput} />
            ) : item.type === ItemType.number && item.slider ? (
                <UISlider
                    min={item.low}
                    max={item.high}
                    step={item.step}
                    minLabel={item.lowLabel}
                    maxLabel={item.highLabel}
                    value={value}
                    onInput={onInput}
                />
            ) : item.type === ItemType.number ? (
                <UIStepper value={value ?? 0} onInput={onInput} />
            ) : item.type === ItemType.checkbox ? (
                <UICheckboxes options={item.options} value={value} onInput={onInput} />
            ) : null}
        </FormQuestion>
    );
}
