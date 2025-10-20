import { type FormReturnData, FormsDB } from "../../../../../database/Forms.ts";
import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { UISheet } from "../../../../../ui/UISheet.tsx";
import { Color } from "../../../../../lib/color.ts";
import { UIForm } from "../../../../../ui/UIForm.tsx";
import { UIList } from "../../../../../ui/UIList.tsx";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

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
                    color: Color.parse(colors.notification),
                    onPress: () => {
                        modal.dismiss();
                    },
                }}
                right={{
                    text: "Done",
                    color: Color.parse(colors.primary),
                    onPress: () => {
                        modal.dismiss();
                    },
                }}
            />
            <UIForm bottomSheet={true}>
                {[
                    UIForm.Section({
                        items: [
                            UIList.Line({
                                label: form.name,
                            }),
                        ],
                    }),
                    UIForm.Section({
                        items: [
                            UIForm.Button({
                                label: "View Questions",
                                color: Color.parse(colors.primary),
                                onPress: () => {
                                    // TODO: implement this
                                }
                            }),
                            UIForm.Button({
                                label: "Delete",
                                color: Color.parse(colors.notification),
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
                    }),
                ]}
            </UIForm>
        </>
    );
}
