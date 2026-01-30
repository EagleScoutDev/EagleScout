import { Alert, Keyboard } from "react-native";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CompetitionReturnData } from "@/lib/database/Competitions";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { UIForm } from "@/ui/components/UIForm";

export interface EnableScoutAssignmentsModalParams {
    competition: CompetitionReturnData;
}
export interface EnableScoutAssignmentsModal extends UISheetModal<EnableScoutAssignmentsModalParams> {}
export const EnableScoutAssignmentsModal = UISheetModal.HOC<EnableScoutAssignmentsModalParams>(
    function EnableScoutAssignmentsModalContent({ ref, data: { competition } }) {
        "use memo";
        const [config, setConfig] = useState<"team_based" | "position_based">("team_based");

        async function submit() {
            const { error } = await supabase
                .from("competitions")
                .update({ scout_assignments_config: config })
                .eq("id", competition.id);
            if (error) {
                console.error(error);
                return Alert.alert(
                    "Error",
                    "There was an error enabling scout assignments. Please check if the TBA key is correct.",
                );
            }

            ref.current?.dismiss();
        }

        return (
            <>
                <UISheetModal.Header
                    title="Scout Assignments"
                    left={[{ role: "cancel", onPress: () => void ref.current?.dismiss() }]}
                    right={[
                        {
                            role: "done",
                            onPress: () => (Keyboard.dismiss(), submit()),
                        },
                    ]}
                />
                <UIForm>
                    {[
                        UIForm.Section({
                            items: [
                                UIForm.Select({
                                    label: "Scheme",
                                    multi: false,
                                    options: [
                                        { key: "team_based", name: "Team Based" },
                                        { key: "position_based", name: "Position Based" },
                                    ],
                                    value: config,
                                    onChange: setConfig,
                                }),
                            ],
                        }),
                    ]}
                </UIForm>
            </>
        );
    },
);
