import { FlatList, View } from "react-native";
import type { Setter } from "@/lib/util/react/types";
import { Form } from "@/lib/forms";
import { UISheet } from "@/ui/components/UISheet";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UICheckbox } from "@/ui/components/UICheckbox";
import { UISheetModal } from "@/ui/components/UISheetModal";

export interface FormQuestionPickerParams {
    form: Form.Structure | null | undefined;
    value: number[];
    setValue: Setter<number[]>;
    onSubmit: (value: number[]) => void;
}
export interface FormQuestionPicker extends UISheetModal<FormQuestionPickerParams> {}
export const FormQuestionPicker = UISheetModal.HOC<FormQuestionPickerParams>(
    function FormQuestionPicker({ ref, data: { form, value, setValue, onSubmit } }) {
        const { colors } = useTheme();

        return (
            <>
                <UISheet.Header
                    left={[
                        {
                            text: "Close",
                            color: colors.danger,
                            onPress: () => void ref.current?.dismiss(),
                        },
                    ]}
                    title="Choose Questions"
                    right={[
                        value.length > 0 && {
                            text: "Save",
                            color: colors.primary,
                            onPress: () => onSubmit(value),
                        },
                    ]}
                />
                <FlatList
                    style={{ padding: 16, flex: 1 }}
                    data={form ?? []}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        if (item.type === Form.ItemType.heading) {
                            return (
                                <UIText size={18} bold style={{ marginVertical: 8 }}>
                                    {item.title}
                                </UIText>
                            );
                        } else if (item.type === Form.ItemType.number) {
                            return (
                                <View style={{ marginBottom: 6 }}>
                                    <UICheckbox
                                        value={value.includes(index)}
                                        text={item.question}
                                        onInput={(checked) => {
                                            if (checked) {
                                                setValue([...value, index]);
                                            } else {
                                                setValue(value.filter((i) => i !== index));
                                            }
                                        }}
                                    />
                                </View>
                            );
                        } else return null;
                    }}
                />
            </>
        );
    },
);
