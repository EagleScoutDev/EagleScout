import { UIText } from "../../ui/UIText";
import { FlatList, View } from "react-native";
import type { Setter } from "../../lib/util/react/types";
import { UISheet } from "../../ui/UISheet";
import { Color } from "../../lib/color";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Form } from "../../lib/forms";
import { UICheckbox } from "../../ui/input/UICheckbox.tsx";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface FormQuestionPickerProps {
    form: Form.Structure | null | undefined;

    value: number[];
    setValue: Setter<number[]>;
    onSubmit: (value: number[]) => void;
}
export function FormQuestionPicker({ form, value, setValue, onSubmit }: FormQuestionPickerProps) {
    "use memo";

    const { colors } = useTheme();
    const modal = useBottomSheetModal();

    return (
        <>
            <UISheet.Header
                left={{
                    text: "Close",
                    color: Color.parse(colors.danger.hex),
                    onPress: () => void modal.dismiss(),
                }}
                title="Choose Questions"
                right={
                    value.length > 0 && {
                        text: "Save",
                        color: Color.parse(colors.primary.hex),
                        onPress: () => onSubmit(value),
                    }
                }
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
}
