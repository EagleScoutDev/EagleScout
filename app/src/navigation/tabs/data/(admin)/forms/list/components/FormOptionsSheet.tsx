import { type FormReturnData, FormsDB } from "@/lib/database/Forms";
import { UISheet } from "@/ui/components/UISheet";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIForm } from "@/ui/components/UIForm";
import { UIList } from "@/ui/components/UIList";
import { Alert } from "react-native";

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
                    color: colors.danger,
                    onPress: () => {
                        modal.dismiss();
                    },
                }}
                right={{
                    text: "Done",
                    color: colors.primary,
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
                            color: colors.primary,
                            onPress: () => {
                                // TODO: implement this
                            },
                        }),
                        UIForm.Button({
                            label: "Delete",
                            color: colors.danger,
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
