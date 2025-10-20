import { Alert, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { NoInternet } from "../../../ui/NoInternet.tsx";
import { type CompetitionReturnData, CompetitionsDB } from "../../../database/Competitions.ts";
import * as Bs from "../../../ui/icons";
import { UIList } from "../../../ui/UIList.tsx";
import { TabHeader } from "../../../ui/navigation/TabHeader.tsx";
import { EditCompetitionModal } from "./EditCompetitionModal.tsx";
import { supabase } from "../../../lib/supabase.ts";
import { AddCompetitionModal } from "./AddCompetitionModal.tsx";

export function ManageCompetitions() {
    "use memo";
    const { colors } = useTheme();
    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);

    const addSheetRef = useRef<AddCompetitionModal>(null);
    const editSheetRef = useRef<EditCompetitionModal>(null);

    async function refreshCompetitions() {
        try {
            const data = await CompetitionsDB.getCompetitions();
            // sort the data by start time
            data.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
            setCompetitionList(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
    }
    useEffect(() => void refreshCompetitions(), []);

    if (internetError) {
        return <NoInternet onRefresh={() => refreshCompetitions()} />;
    }

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <TabHeader title={"Competitions"} />

            <UIList onRefresh={refreshCompetitions}>
                {[
                    UIList.Section({
                        items: competitionList.map((comp) =>
                            UIList.Line({
                                key: comp.id.toString(),
                                label: comp.name,
                                onPress: () => {
                                    editSheetRef.current?.present({
                                        id: comp.id,
                                        name: comp.name,
                                        start: comp.startTime,
                                        end: comp.endTime,
                                    });
                                },
                            })
                        ),
                    }),
                ]}
            </UIList>

            <TouchableOpacity
                onPress={() => {
                    addSheetRef.current?.present();
                }}
                style={{
                    margin: 20,
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                }}
            >
                <Bs.PlusCircleFill size="60" fill={colors.primary} />
            </TouchableOpacity>

            <AddCompetitionModal
                ref={addSheetRef}
                onCancel={() => addSheetRef.current?.dismiss()}
                onSubmit={async (comp) => {
                    const { error } = await supabase.from("competitions").insert({
                        name: comp.name,
                        start_time: comp.start,
                        end_time: comp.end,
                        form_id: comp.matchForm,
                        pit_scout_form_id: comp.pitForm,
                        tba_event_id: comp.tbaEventId,
                    });
                    if (error !== null) {
                        console.error(error);
                        Alert.alert("Error", "An error occurred, please try again later.");
                    } else {
                        addSheetRef.current?.dismiss();
                    }

                    void refreshCompetitions();
                }}
            />
            <EditCompetitionModal
                ref={editSheetRef}
                onCancel={() => editSheetRef.current?.dismiss()}
                onSubmit={async (comp) => {
                    const { error } = await supabase
                        .from("competitions")
                        .update({
                            name: comp.name,
                            start_time: comp.start,
                            end_time: comp.end,
                        })
                        .eq("id", comp.id);
                    if (error !== null) {
                        console.error(error);
                        Alert.alert("Error", "An error occurred, please try again later.");
                    } else {
                        editSheetRef.current?.dismiss();
                    }

                    void refreshCompetitions();
                }}
                onDelete={async (comp) => {
                    const { error } = await supabase.from("competitions").delete().eq("id", comp.id);
                    if (error !== null) {
                        console.error(error);
                        Alert.alert("Error", "An error occurred, please try again later.");
                    } else {
                        editSheetRef.current?.dismiss();
                    }

                    void refreshCompetitions();
                }}
            />
        </View>
    );
}
