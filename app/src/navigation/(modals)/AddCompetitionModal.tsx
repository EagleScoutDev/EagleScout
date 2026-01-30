import { Alert, Keyboard } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { TBA } from "@/lib/frc/tba/TBA";
import { UIForm } from "@/ui/components/UIForm";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CompetitionData {
    name: string;
    start: Date;
    end: Date;
    tbaEventId: number;
    matchForm: number;
    pitForm: number;
}

export interface AddCompetitionModalParams {}
export interface AddCompetitionModal extends UISheetModal<AddCompetitionModalParams> {}
export const AddCompetitionModal = UISheetModal.HOC<AddCompetitionModalParams>(
    function AddCompetitionModalContent({ ref }) {
        "use memo";
        // TODO: set dismiss listener

        const queryClient = useQueryClient();
        type FormListItem = { id: number; name: string; pitScouting: boolean };
        const { data: { forms, matchFormIds, pitFormIds } = {}, isLoading: formsLoading } =
            useQuery({
                queryKey: ["formList"],
                async queryFn() {
                    let { data, error } = await supabase
                        .from("forms")
                        .select("id, name, pitScouting:pit_scouting");
                    if (error) throw error;
                    return data ?? [];
                },
                select(formList) {
                    const forms = new Map<number, FormListItem>();
                    const matchFormIds: number[] = [];
                    const pitFormIds: number[] = [];
                    for (let form of formList) {
                        forms.set(form.id, form);
                        if (form.pitScouting) pitFormIds.push(form.id);
                        else matchFormIds.push(form.id);
                    }

                    return { forms, matchFormIds, pitFormIds };
                },
            });
        const submit = useMutation({
            mutationKey: ["addCompetition"],
            async mutationFn(comp: CompetitionData) {
                const { error } = await supabase.from("competitions").insert({
                    name: comp.name,
                    start_time: comp.start,
                    end_time: comp.end,
                    form_id: comp.matchForm,
                    pit_scout_form_id: comp.pitForm,
                    tba_event_id: comp.tbaEventId,
                });
                if (error) throw error;
            },
            onSettled: () => queryClient.invalidateQueries({ queryKey: ["competitions"] }),
        });

        const [name, setName] = useState("");
        const [start, setStart] = useState(new Date());
        const [end, setEnd] = useState(new Date());
        const [tbaKey, setTbaKey] = useState("");
        const [matchForm, setMatchForm] = useState<number | null>(null);
        const [pitForm, setPitForm] = useState<number | null>(null);

        async function onSubmit() {
            Keyboard.dismiss();

            if (start >= end) return Alert.alert("Error", "Start time must be before end time.");
            if (name === "")
                return Alert.alert("Error", "Please enter a name for this competition.");
            if (matchForm == null)
                return Alert.alert("Error", "Please select a form for scouting matches.");
            if (pitForm == null)
                return Alert.alert("Error", "Please select a form for pit scouting.");

            if (!(await TBA.checkEventKey(tbaKey)))
                return Alert.alert("Error", "Failed to fetch TBA information.");

            const { data: eventData, error: eventError } = await supabase
                .from("tba_events")
                .select("id")
                .eq("event_key", tbaKey)
                .single();
            if (eventError)
                return Alert.alert("Error", "Failed to get TBA key from events in database.");

            await submit.mutateAsync({
                name,
                start,
                end,
                tbaEventId: eventData.id,
                matchForm,
                pitForm,
            });

            ref.current?.dismiss();
        }

        return (
            <>
                <UISheetModal.Header
                    title="New Competition"
                    left={[{ role: "cancel", onPress: () => ref.current?.dismiss() }]}
                    right={[{ role: "done", onPress: onSubmit }]}
                />
                <UIForm>
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
                                    loading: formsLoading,
                                    options: matchFormIds ?? [],
                                    render: (id) => forms?.get(id)!,
                                    value: matchForm,
                                    onChange: (value) => setMatchForm(value),
                                }),
                                UIForm.ListPicker({
                                    label: "Pit Scouting Form",
                                    loading: formsLoading,
                                    options: pitFormIds ?? [],
                                    render: (id) => forms?.get(id)!,
                                    value: pitForm,
                                    onChange: (value) => setPitForm(value),
                                }),
                            ],
                        }),
                    ]}
                </UIForm>
            </>
        );
    },
);
