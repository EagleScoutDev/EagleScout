import { type FormReturnData, FormsDB } from "../../../../../database/Forms";
import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { UISheet } from "../../../../../ui/UISheet";
import { Color } from "../../../../../lib/color";
import { UIForm } from "../../../../../ui/UIForm";
import { UIList } from "../../../../../ui/UIList";
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
                            UIList.Label({
                                label: form.name,
                            }),
                        ],
                    }),
                    UIForm.Section({
                        items: [
                            UIForm.Button({
                                text: "View Questions",
                                color: Color.parse(colors.primary),
                                onPress: () => {
                                    // TODO: implement this
                                },
                            }),
                            UIForm.Button({
                                text: "Delete",
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
