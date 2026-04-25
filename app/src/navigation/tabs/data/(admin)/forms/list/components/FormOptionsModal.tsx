import { type FormReturnData } from "@/lib/db/models/Form";
import { UIForm } from "@/ui/components/UIForm";
import { UIList } from "@/ui/components/UIList";
import { Alert } from "react-native";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { useTheme } from "@/ui/context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import { formMutations } from "@/lib/mutations/forms";

export interface FormOptionsModalParams {
    form: FormReturnData;
}
export interface FormOptionsModal extends UISheetModal<FormOptionsModalParams> {}
export const FormOptionsModal = UISheetModal.HOC<FormOptionsModalParams>(
    function FormOptionsModalContent({ ref, data: { form } }) {
        "use memo";
        const { colors } = useTheme();
        const deleteForm = useMutation(formMutations.delete);

        return (
            <>
                <UISheetModal.Header
                    title={"Form Options"}
                    left={[{ role: "cancel", onPress: () => ref.current?.dismiss() }]}
                    right={[{ role: "done", onPress: () => ref.current?.dismiss() }]}
                />
                <UIForm bottomSheet>
                    <UIForm.Section>
                        <UIList.Row label={form.name} />
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
                            onPress={async () => {
                                try {
                                    await deleteForm.mutateAsync(form.id);
                                } catch (e) {
                                    console.error(e);
                                    Alert.alert("Error", "Failed to delete form.");
                                } finally {
                                    ref.current?.dismiss();
                                }
                            }}
                        />
                    </UIForm.Section>
                </UIForm>
            </>
        );
    },
);
