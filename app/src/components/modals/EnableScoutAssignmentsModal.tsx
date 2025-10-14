import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { supabase } from "../../lib/supabase.ts";
import { UISheet } from "../../ui/UISheet.tsx";
import { Color } from "../../lib/color.ts";
import type { CompetitionReturnData } from "../../database/Competitions.ts";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import type { UISheetModal } from "../../ui/UISheetModal.tsx";
import { UIForm } from "../../ui/UIForm.tsx";

export interface EnableScoutAssignmentsModalProps {
    data?: CompetitionReturnData;
}
export interface EnableScoutAssignmentsModal extends UISheetModal<CompetitionReturnData> {}
export function EnableScoutAssignmentsModal({ data: competition }: EnableScoutAssignmentsModalProps) {
    const { colors } = useTheme();
    const [config, setConfig] = useState<"team_based" | "position_based">("team_based");

    const modal = useBottomSheetModal();

    async function submit() {
        if (!competition) return;

        const { error } = await supabase
            .from("competitions")
            .update({ scout_assignments_config: config })
            .eq("id", competition.id);
        if (error) {
            console.error(error);
            return Alert.alert(
                "Error",
                "There was an error enabling scout assignments. Please check if the TBA key is correct."
            );
        }

        modal.dismiss();
    }

    if (!competition) return null;

    return (
        <>
            <UISheet.Header
                title="Scout Assignments"
                left={{
                    text: "Cancel",
                    color: Color.parse(colors.notification),
                    onPress: () => void modal.dismiss(),
                }}
                right={{
                    text: "Done",
                    color: Color.parse(colors.primary),
                    onPress: submit,
                }}
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
}
