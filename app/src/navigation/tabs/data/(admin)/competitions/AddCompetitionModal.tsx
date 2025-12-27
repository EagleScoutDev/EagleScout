import { Alert, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { supabase } from "@/lib/supabase";
import { TBA } from "@/lib/frc/tba/TBA";
import type { UISheetModal } from "@/ui/components/UISheetModal";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIForm } from "@/ui/components/UIForm";
import { UISheet } from "@/ui/components/UISheet";

export interface CompetitionData {
    name: string;
    start: Date;
    end: Date;
    tbaEventId: number;
    matchForm: number;
    pitForm: number;
}

export interface AddCompetitionModalProps {
    onSubmit: (competitionData: CompetitionData) => void | Promise<void>;
}
export interface AddCompetitionModal extends UISheetModal {}
export function AddCompetitionModal({ onSubmit }: AddCompetitionModalProps) {
    const { colors } = useTheme();
    const modal = useBottomSheetModal();

    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [tbaKey, setTbaKey] = useState("");
    const [matchForm, setMatchForm] = useState<number | null>(null);
    const [pitForm, setPitForm] = useState<number | null>(null);

    const [formList, setFormList] = useState<{ id: number; name: string; pitScouting: boolean }[]>([]);
    const matchForms = new Map<number, { id: number; name: string; pitScouting: false }>();
    const pitForms = new Map<number, { id: number; name: string; pitScouting: true }>();
    const matchFormIds: number[] = [];
    const pitFormIds: number[] = [];
    for (const form of formList) {
        if (form.pitScouting) {
            pitForms.set(form.id, form as typeof form & { pitScouting: true });
            pitFormIds.push(form.id);
        } else {
            matchForms.set(form.id, form as typeof form & { pitScouting: false });
            matchFormIds.push(form.id);
        }
    }

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

        if (!(await TBA.checkEventKey(tbaKey))) return Alert.alert("Error", "Failed to fetch TBA information.");

        const { data: eventData, error: eventError } = await supabase
            .from("tba_events")
            .select("id")
            .eq("event_key", tbaKey)
            .single();
        if (eventError) return Alert.alert("Error", "Failed to get TBA key from events in database.");

        await onSubmit({
            name,
            start,
            end,
            tbaEventId: eventData.id,
            matchForm,
            pitForm,
        });
    }

    return (
        <>
            <UISheet.Header
                left={{
                    color: colors.danger,
                    text: "Cancel",
                    onPress: () => void modal.dismiss(),
                }}
                right={{
                    color: colors.primary,
                    text: "Done",
                    onPress: () => {
                        Keyboard.dismiss();
                        return trySubmit();
                    },
                }}
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
                            UIForm.ListPicker({
                                label: "Match Scouting Form",
                                options: matchFormIds,
                                render: (id) => matchForms.get(id)!,
                                value: matchForm,
                                onChange: (value) => setMatchForm(value),
                            }),
                            UIForm.ListPicker({
                                label: "Pit Scouting Form",
                                options: pitFormIds,
                                render: (id) => pitForms.get(id)!,
                                value: pitForm,
                                onChange: (value) => setPitForm(value),
                            }),
                        ],
                    }),
                ]}
            </UIForm>
        </>
    );
}
