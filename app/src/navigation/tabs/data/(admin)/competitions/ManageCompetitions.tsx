import { Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import * as Bs from "@/ui/icons";
import { EditCompetitionModal } from "./EditCompetitionModal";
import { supabase } from "@/lib/supabase";
import { AddCompetitionModal } from "./AddCompetitionModal";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";

export function ManageCompetitions() {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

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
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Competitions"} />
            </SafeAreaView>

            <UIList onRefresh={refreshCompetitions}>
                {UIList.Section({
                    items: competitionList.map((comp) =>
                        UIList.Label({
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
                        }),
                    ),
                })}
            </UIList>

            <UIFab
                icon={Bs.Plus}
                onPress={() => {
                    void addSheetRef.current?.present();
                }}
            />

            <UISheetModal ref={addSheetRef} handleComponent={null}>
                <AddCompetitionModal
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
                            await AsyncAlert.alert("Error", "An error occurred, please try again later.");
                        } else {
                            addSheetRef.current?.dismiss();
                        }

                        void refreshCompetitions();
                    }}
                />
            </UISheetModal>

            <EditCompetitionModal
                ref={editSheetRef}
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
        </SafeAreaProvider>
    );
}
