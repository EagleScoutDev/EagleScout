import { Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/ui/context/ThemeContext.ts";
import { UIForm } from "@/ui/components/UIForm.tsx";
import type { RootStackScreenProps } from "@/navigation";
import { useFocusEffect } from "@react-navigation/native";

export interface CompetitionPatch {
    id: number;
    name: string;
    start: Date;
    end: Date;
}

export interface EditCompetitionScreenParams {
    data: CompetitionPatch;
    onSubmit: (comp: CompetitionPatch) => void;
    onDelete: (comp: CompetitionPatch) => void;
}
export function EditCompetition({ navigation, route }: RootStackScreenProps<"EditCompetition">) {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const { data, onSubmit, onDelete } = route.params;
    const { colors } = useTheme();

    const [id, setId] = useState<number>(0);
    const [name, setName] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    useFocusEffect(() => {
        if (data === undefined) return;
        setId(data.id);
        setName(data.name);
        setStart(new Date(data.start)); //< TODO: get rid of the new Date()
        setEnd(new Date(data.end));
    });

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

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            unstable_headerLeftItems: () => [
                {
                    type: "button",
                    label: "Done",
                    labelStyle: { color: colors.danger },
                    icon: { type: "sfSymbol", name: "xmark" },
                    variant: "plain",
                },
            ],
            unstable_headerRightItems: () => [
                {
                    type: "button",
                    label: "Done",
                    labelStyle: { color: colors.primary },
                    icon: { type: "sfSymbol", name: "checkmark" },
                    tintColor: "red",
                    variant: "done",
                },
            ],
        });
    });

    return (
        <>
            {/*<UISheet.Header*/}
            {/*    left={{*/}
            {/*        color: colors.danger,*/}
            {/*        text: "Cancel",*/}
            {/*        onPress: () => sheetRef.current?.dismiss(),*/}
            {/*    }}*/}
            {/*    right={{ color: colors.primary, text: "Done", onPress: trySubmit }}*/}
            {/*    title={"Edit Competition"}*/}
            {/*/>*/}
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
}
