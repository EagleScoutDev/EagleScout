import { UIForm } from "../../../../../ui/UIForm.tsx";
import { Color } from "../../../../../lib/color.ts";
import { Form } from "../../../../../lib/forms";
import { useTheme } from "@react-navigation/native";
import { arr } from "../../../../../lib/util/im.ts";
import ItemType = Form.ItemType;

export interface FormItemBuilderProps {
    value: Form.Item;
    onChange: (value: Form.Item) => void;
}
export function FormItemOptions({ value, onChange }: FormItemBuilderProps) {
    const { colors } = useTheme();

    return (
        <UIForm style={{ flex: 1 }}>
            {value.type === ItemType.heading
                ? [
                      UIForm.Section({
                          items: [
                              UIForm.TextInput({
                                  label: "Title",
                                  value: value.title,
                                  onChange: (title) => onChange({ ...value, title }),
                              }),
                              UIForm.TextInput({
                                  label: "Description",
                                  value: value.description,
                                  onChange: (description) => onChange({ ...value, description }),
                              }),
                          ],
                      }),
                  ]
                : [
                      UIForm.Section({
                          items: [
                              UIForm.TextInput({
                                  label: "Question",
                                  value: value.question,
                                  onChange: (question) => onChange({ ...value, question }),
                              }),
                              UIForm.Switch({
                                  label: "Required",
                                  value: value.required,
                                  onChange: (required) => onChange({ ...value, required }),
                              }),
                          ],
                      }),
                      ...(value.type === ItemType.radio || value.type === ItemType.checkbox
                          ? [
                                UIForm.Section({
                                    header: "Options",
                                    items: [
                                        ...value.options.map((option, i) =>
                                            UIForm.TextInput({
                                                label: `Option ${i + 1}`,
                                                value: option,
                                                onChange: (option) => {
                                                    console.log(option);
                                                    onChange({ ...value, options: arr.set(value.options, i, option) });
                                                },
                                            })
                                        ),
                                        UIForm.Button({
                                            label: "Add Option",
                                            color: Color.parse(colors.primary),
                                            onPress: () => onChange({ ...value, options: [...value.options, ""] }),
                                        }),
                                    ],
                                }),
                            ]
                          : value.type === ItemType.number && value.slider
                          ? [
                                UIForm.Section({
                                    items: [
                                        UIForm.NumberInput({
                                            label: "Minimum",
                                            value: value.low,
                                            onChange: (low) => onChange({ ...value, low }),
                                        }),
                                        UIForm.NumberInput({
                                            label: "Maximum",
                                            value: value.high,
                                            onChange: (high) => onChange({ ...value, high }),
                                        }),
                                        UIForm.NumberInput({
                                            label: "Step",
                                            value: value.step,
                                            onChange: (step) => onChange({ ...value, step }),
                                        }),
                                    ],
                                }),
                                UIForm.Section({
                                    items: [
                                        UIForm.TextInput({
                                            label: "Minimum Label",
                                            value: value.lowLabel,
                                            onChange: (lowLabel) => onChange({ ...value, lowLabel }),
                                        }),
                                        UIForm.TextInput({
                                            label: "Maximum Label",
                                            value: value.highLabel,
                                            onChange: (highLabel) => onChange({ ...value, highLabel }),
                                        }),
                                    ],
                                }),
                            ]
                          : []),
                  ]}
        </UIForm>
    );
}
