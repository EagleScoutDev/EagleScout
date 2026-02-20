import { Form } from "@/lib/forms";
import { Arrays } from "@/lib/util/Arrays";
import { UIForm } from "@/ui/components/UIForm";
import { useTheme } from "@/ui/context/ThemeContext";
import ItemType = Form.ItemType;

export interface FormItemBuilderProps {
    value: Form.Item;
    isNewItem: boolean;
    onChange: (value: Form.Item) => void;
    onDelete: () => void;
}

export function FormItemOptions({ value, isNewItem, onChange, onDelete }: FormItemBuilderProps) {
    const { colors } = useTheme();

    return (
        <UIForm>
            {[
                value.type === ItemType.heading &&
                    <UIForm.Section>
                        <UIForm.TextInput
                            label="Title"
                            value={value.title}
                            onChange={(title) => onChange({ ...value, title })}
                        />
                        <UIForm.TextInput
                            label="Description"
                            value={value.description}
                            onChange={(description) => onChange({ ...value, description })}
                        />
                    </UIForm.Section>,

                value.type !== ItemType.heading &&
                    <UIForm.Section>
                        <UIForm.TextInput
                            label="Question"
                            value={value.question}
                            onChange={(question) => onChange({ ...value, question })}
                        />
                        <UIForm.Switch
                            label="Required"
                            value={value.required}
                            onChange={(required) => onChange({ ...value, required })}
                        />
                    </UIForm.Section>,

                (value.type === ItemType.radio || value.type === ItemType.checkbox) &&
                    <UIForm.Section title="Options">
                        {value.options.map((option, i) =>
                            <UIForm.TextInput
                                key={`option-${i}`}
                                label={`Option ${i + 1}`}
                                value={option}
                                onChange={(option) => {
                                    console.log(option);
                                    onChange({
                                        ...value,
                                        options: Arrays.set(value.options, i, option),
                                    });
                                }}
                            />
                        )}
                        <UIForm.Button
                            label="Add Option"
                            color={colors.primary}
                            onPress={() => onChange({ ...value, options: [...value.options, ""] })}
                        />
                    </UIForm.Section>,

                value.type === ItemType.number &&
                    !value.slider &&
                    <UIForm.Section>
                        <UIForm.NumberInput
                            key="low"
                            label="Minimum"
                            value={value.low}
                            onChange={(low) => onChange({ ...value, low })}
                        />
                        <UIForm.NumberInput
                            key="high"
                            label="Maximum"
                            value={value.high}
                            onChange={(high) => onChange({ ...value, high })}
                        />
                        <UIForm.NumberInput
                            key="step"
                            label="Step"
                            value={value.step}
                            onChange={(step) => step !== null && (onChange({ ...value, step }), true)}
                        />
                    </UIForm.Section>,
                ...(value.type === ItemType.number && value.slider
                    ? [
                          <UIForm.Section key="slider-min-max">
                              <UIForm.NumberInput
                                  key="low"
                                  label="Minimum"
                                  value={value.low}
                                  onChange={(low) => low !== null && (onChange({ ...value, low }), true)}
                              />
                              <UIForm.NumberInput
                                  key="high"
                                  label="Maximum"
                                  value={value.high}
                                  onChange={(high) => high !== null && (onChange({ ...value, high }), true)}
                              />
                              <UIForm.NumberInput
                                  key="step"
                                  label="Step"
                                  value={value.step}
                                  onChange={(step) => step !== null && (onChange({ ...value, step }), true)}
                              />
                          </UIForm.Section>,
                          <UIForm.Section key="slider-labels">
                              <UIForm.TextInput
                                  label="Minimum Label"
                                  value={value.lowLabel}
                                  onChange={(lowLabel) => onChange({ ...value, lowLabel })}
                              />
                              <UIForm.TextInput
                                  label="Maximum Label"
                                  value={value.highLabel}
                                  onChange={(highLabel) => onChange({ ...value, highLabel })}
                              />
                          </UIForm.Section>,
                      ]
                    : []),

                !isNewItem &&
                    <UIForm.Section>
                        <UIForm.Button
                            label="Delete Item"
                            color={colors.danger}
                            onPress={onDelete}
                        />
                    </UIForm.Section>,
            ]}
        </UIForm>
    );
}
