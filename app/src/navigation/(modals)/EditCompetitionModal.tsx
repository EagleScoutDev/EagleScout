import { Alert, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIForm } from "@/ui/components/UIForm";
import { UISheetModal } from "@/ui/components/UISheetModal";

export interface CompetitionPatch {
    id: number;
    name: string;
    start: Date;
    end: Date;
}

export interface EditCompetitionModalParams {
    competition: CompetitionPatch;
    onSubmit: (comp: CompetitionPatch) => void;
    onDelete: (comp: CompetitionPatch) => void;
}
export interface EditCompetitionModal extends UISheetModal<EditCompetitionModalParams> {}
export const EditCompetitionModal = UISheetModal.HOC<EditCompetitionModalParams>(function EditCompetitionModalContent({
    ref,
    data: { competition, onSubmit, onDelete },
}) {
    "use memo";
    // TODO: set navigation listener for beforeRemove
    const { colors } = useTheme();

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    useEffect(() => {
        setId(competition.id);
        setName(competition.name);
        setStart(new Date(competition.start)); //< TODO: get rid of the new Date()
        setEnd(new Date(competition.end));
    }, [competition]);

    function trySubmit() {
        if (start >= end) return Alert.alert("Error", "Start time must be before end time.");
        if (name === "") return Alert.alert("Error", "Please enter a name for this competition.");

        onSubmit({ id, name, start, end });
    }

    function tryDelete() {
        Alert.alert(
            "Delete " + name + "?",
            "Are you sure you want to delete this competition? This action cannot be undone.\nWARNING: This will delete all scout reports for this competition.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete({ id, name, start, end }),
                },
            ],
        );
    }

    return (
        <>
            <UISheetModal.Header
                title="Edit Competition"
                left={[{ role: "cancel", onPress: () => ref.current?.dismiss() }]}
                right={[{ role: "done", onPress: () => (Keyboard.dismiss(), trySubmit()) }]}
            />
            <UIForm bottomSheet>
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
                            UIForm.Button({
                                label: "Delete Competition",
                                color: colors.danger,
                                onPress: tryDelete,
                            }),
                        ],
                    }),
                ]}
            </UIForm>
        </>
    );
});
