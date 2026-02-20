import { type FormReturnData, FormsDB } from "@/lib/database/Forms";
import { UIForm } from "@/ui/components/UIForm";
import { UIList } from "@/ui/components/UIList";
import { Alert } from "react-native";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { useTheme } from "@/ui/context/ThemeContext";

export interface FormOptionsModalParams {
    form: FormReturnData;
}
export interface FormOptionsModal extends UISheetModal<FormOptionsModalParams> {}
export const FormOptionsModal = UISheetModal.HOC<FormOptionsModalParams>(
    function FormOptionsModalContent({ ref, data: { form } }) {
        const { colors } = useTheme();

        return (
            <>
                <UISheetModal.Header
                    title={"Form Options"}
                    left={[{ role: "cancel", onPress: () => ref.current?.dismiss() }]}
                    right={[
                        {
                            role: "done",
                            onPress: () => {
                                // TODO: implement this
                                ref.current?.dismiss();
                            },
                        },
                    ]}
                />
                <UIForm>
                    <UIForm.Section>
                        <UIList.Label
                            label={form.name}
                        />
                    </UIForm.Section>
                    <UIForm.Section>
                        {/* UIForm.Button({
                            label: "View Questions",
                            color: colors.primary,
                            onPress: () => {
                                // TODO: implement this
                            },
                        }), */}
                        <UIForm.Button
                            label="Delete"
                            color={colors.danger}
                            onPress={() => {
                                FormsDB.deleteForm(form)
                                    .catch((e) => {
                                        console.error(e);
                                        Alert.alert("Error", "Failed to delete form.");
                                    })
                                    .finally(() => ref.current?.dismiss());
                            }}
                        />
                    </UIForm.Section>
                </UIForm>
            </>
        );
    },
);
