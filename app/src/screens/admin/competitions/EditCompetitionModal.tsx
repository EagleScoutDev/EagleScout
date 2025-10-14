import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import React, { useImperativeHandle, useRef, useState } from "react";
import { Color } from "../../../lib/color.ts";
import { UISheet } from "../../../ui/UISheet.tsx";
import { UIForm } from "../../../ui/UIForm.tsx";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";

export interface CompetitionPatch {
    id: number;
    name: string;
    start: Date;
    end: Date;
}

export interface EditCompetitionModalProps {
    ref?: React.Ref<EditCompetitionModal>;
    onSubmit: (comp: CompetitionPatch) => void;
    onDelete: (comp: CompetitionPatch) => void;
}
export interface EditCompetitionModal extends UISheetModal<CompetitionPatch> {}
export function EditCompetitionModal({ ref, onSubmit, onDelete }: EditCompetitionModalProps) {
    "use memo";
    const { colors } = useTheme();

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    const sheetRef = useRef<UISheetModal>(null);

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
            ]
        );
    }

    useImperativeHandle(
        ref,
        () => ({
            ...sheetRef.current!,
            present(data) {
                if (data === undefined) return;
                setId(data.id);
                setName(data.name);
                setStart(new Date(data.start)); //< TODO: get rid of the new Date()
                setEnd(new Date(data.end));
                sheetRef.current?.present();
            },
        }),
        [sheetRef.current]
    );

    return (
        <UISheetModal ref={sheetRef} handleComponent={null}>
            <UISheet.Header
                left={{
                    color: Color.parse(colors.notification),
                    text: "Cancel",
                    onPress: () => sheetRef.current?.dismiss(),
                }}
                right={{ color: Color.parse(colors.primary), text: "Done", onPress: trySubmit }}
                title={"Edit Competition"}
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
                            UIForm.Button({
                                label: "Delete Competition",
                                color: Color.parse(colors.notification),
                                onPress: tryDelete,
                            }),
                        ],
                    }),
                ]}
            </UIForm>
        </UISheetModal>
    );
}
