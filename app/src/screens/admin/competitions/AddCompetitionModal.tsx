import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase.ts";
import { Color } from "../../../lib/color.ts";
import { UISheet } from "../../../ui/UISheet.tsx";
import { UIForm } from "../../../ui/UIForm.tsx";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";

export interface CompetitionData {
    name: string;
    start: Date;
    end: Date;
    tbaEventId: number;
    matchForm: number;
    pitForm: number;
}

export interface AddCompetitionModalProps {
    ref?: React.Ref<AddCompetitionModal>;
    onCancel: () => void;
    onSubmit: (competitionData: CompetitionData) => void;
}
export interface AddCompetitionModal extends UISheetModal {

}
export function AddCompetitionModal({ ref, onCancel, onSubmit }: AddCompetitionModalProps) {
    "use memo";
    const { colors } = useTheme();

    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [tbaKey, setTbaKey] = useState("");
    const [matchForm, setMatchForm] = useState<number | null>(null);
    const [pitForm, setPitForm] = useState<number | null>(null);

    const [formList, setFormList] = useState<{ id: number; name: string; pitScouting: boolean }[]>([]);

    async function refreshForms() {
        let { data, error } = await supabase.from("forms").select("id, name, pitScouting:pit_scouting");
        if (error) {
            console.error(error);
            return;
        }

        setFormList(data ?? []);
    }
    useEffect(() => void refreshForms(), []);

    async function trySubmit() {
        if (start >= end) return Alert.alert("Error", "Start time must be before end time.");
        if (name === "") return Alert.alert("Error", "Please enter a name for this competition.");

        if (matchForm == null) return Alert.alert("Error", "Please select a form for scouting matches.");
        if (pitForm == null) return Alert.alert("Error", "Please select a form for pit scouting.");

        const { error: fetchTbaEventError } = await supabase.functions.invoke("fetch-tba-event", {
            body: { tbakey: tbaKey },
        });
        if (fetchTbaEventError) return Alert.alert("Error", "Failed to fetch TBA information.");

        const { data: eventData, error: eventError } = await supabase
            .from("tba_events")
            .select("id")
            .eq("event_key", tbaKey)
            .single();
        if (eventError) return Alert.alert("Error", "Failed to get TBA key from events in database.");

        const final = {
            name,
            start,
            end,
            tbaEventId: eventData.id,
            matchForm,
            pitForm,
        };

        onSubmit(final);
    }

    return (
        <UISheetModal {...(ref ? { ref } : {})} handleComponent={null}>
            <UISheet.Header
                left={{
                    color: Color.parse(colors.notification),
                    text: "Cancel",
                    onPress: onCancel,
                }}
                right={{ color: Color.parse(colors.primary), text: "Done", onPress: () => void trySubmit() }}
                title={"New Competition"}
            />
            <UIForm bottomSheet={true}>
                {[
                    UIForm.Section({
                        items: [
                            UIForm.TextInput({
                                label: "Name",
                                value: name,
                                onChange: setName,
                            }),
                        ],
                    }),
                    UIForm.Section({
                        items: [
                            UIForm.DateTime({
                                label: "Start",
                                date: true,
                                time: true,
                                value: start,
                                onChange: setStart,
                            }),
                            UIForm.DateTime({
                                label: "End",
                                date: true,
                                time: true,
                                value: end,
                                onChange: setEnd,
                            }),
                        ],
                    }),

                    UIForm.Section({
                        items: [
                            UIForm.TextInput({
                                label: "The event's The Blue Alliance key",
                                value: tbaKey,
                                onChange: setTbaKey,
                            }),
                        ],
                    }),
                    UIForm.Section({
                        items: [
                            UIForm.Select({
                                label: "Match Scouting Form",
                                multi: false,
                                options: () =>
                                    formList
                                        .filter((f) => !f.pitScouting)
                                        .map((f) => ({
                                            key: f.id.toString(),
                                            name: f.name,
                                        })),
                                value: matchForm?.toString() ?? null,
                                onChange: (value) => setMatchForm(parseInt(value)),
                            }),
                            UIForm.Select({
                                label: "Pit Scouting Form",
                                multi: false,
                                options: () =>
                                    formList
                                        .filter((f) => f.pitScouting)
                                        .map((f) => ({
                                            key: f.id.toString(),
                                            name: f.name,
                                        })),
                                value: pitForm?.toString() ?? null,
                                onChange: (value) => setPitForm(parseInt(value)),
                            }),
                        ],
                    }),
                ]}
            </UIForm>
        </UISheetModal>
    );
}
