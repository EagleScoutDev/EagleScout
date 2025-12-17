import { type FormReturnData } from "../../../../../database/Forms";

import { UISheet } from "../../../../../ui/UISheet";
import { Color } from "../../../../../lib/color";
import { UIForm } from "../../../../../ui/UIForm";
import { UIList } from "../../../../../ui/UIList";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "../../../../../lib/contexts/ThemeContext.ts";

export interface FormOptionsModalProps {
    data?: { form: FormReturnData };
}
export function FormOptionsSheet({ data }: FormOptionsModalProps) {
    const { colors } = useTheme();
    const modal = useBottomSheetModal();

    if (!data) return <></>;
    const { form } = data;

    return (
        <>
            <UISheet.Header
                title={"Form Options"}
                left={{
                    text: "Cancel",
                    color: Color.parse(colors.danger.hex),
                    onPress: () => {
                        modal.dismiss();
                    },
                }}
                right={{
                    text: "Done",
                    color: Color.parse(colors.primary.hex),
                    onPress: () => {
                        modal.dismiss();
                    },
                }}
            />
            <UIForm bottomSheet>
                {UIForm.Section({
                    items: [
                        UIList.Label({
                            label: form.name,
                        }),
                    ],
                })}
                {UIForm.Section({
                    items: [
                        UIForm.Button({
                            label: "View Questions",
                            color: Color.parse(colors.primary.hex),
                            onPress: () => {
                                // TODO: implement this
                            },
                        }),
                        UIForm.Button({
                            label: "Delete",
                            color: Color.parse(colors.danger.hex),
                            onPress: () => {
                                FormsDB.deleteForm(form)
                                    .catch((e) => {
                                        console.error(e);
                                        Alert.alert("Error", "Failed to delete form.");
                                    })
                                    .finally(() => modal.dismiss());
                            },
                        }),
                    ],
                })}
            </UIForm>
        </>
    );
}
