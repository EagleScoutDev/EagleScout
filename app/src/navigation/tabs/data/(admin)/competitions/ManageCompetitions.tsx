import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import * as Bs from "@/ui/icons";
import { supabase } from "@/lib/supabase";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { EditCompetitionModal } from "@/navigation/(modals)/EditCompetitionModal";
import { AddCompetitionModal } from "@/navigation/(modals)/AddCompetitionModal";
import { Alert } from "react-native";

export function ManageCompetitions() {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);

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

    const editSheetRef = useRef<EditCompetitionModal>(null);
    const addSheetRef = useRef<AddCompetitionModal>(null);

    if (internetError) {
        return <NoInternet onRefresh={() => refreshCompetitions()} />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Competitions"} />
            </SafeAreaView>

            <UIList onRefresh={refreshCompetitions}>
                <UIList.Section>
                    {competitionList.map((comp) => (
                        <UIList.Label
                            key={comp.id.toString()}
                            label={comp.name}
                            onPress={() => {
                                editSheetRef.current?.present({
                                    competition: {
                                        id: comp.id,
                                        name: comp.name,
                                        start: comp.startTime,
                                        end: comp.endTime,
                                    },
                                    onSubmit: async (compPatch) => {
                                        const { error } = await supabase
                                            .from("competitions")
                                            .update({
                                                name: compPatch.name,
                                                start_time: compPatch.start,
                                                end_time: compPatch.end,
                                            })
                                            .eq("id", compPatch.id);
                                        if (error !== null) {
                                            console.error(error);
                                            Alert.alert(
                                                "Error",
                                                "An error occurred, please try again later.",
                                            );
                                        } else {
                                            editSheetRef.current?.dismiss();
                                        }

                                        void refreshCompetitions();
                                    },
                                    onDelete: async (compPatch) => {
                                        const { error } = await supabase
                                            .from("competitions")
                                            .delete()
                                            .eq("id", compPatch.id);
                                        if (error !== null) {
                                            console.error(error);
                                            Alert.alert(
                                                "Error",
                                                "An error occurred, please try again later.",
                                            );
                                        } else {
                                            editSheetRef.current?.dismiss();
                                        }

                                        void refreshCompetitions();
                                    },
                                });
                            }}
                        />
                    ))}
                </UIList.Section>
            </UIList>

            <UIFab icon={Bs.Plus} onPress={() => addSheetRef.current?.present({})} />

            <AddCompetitionModal ref={addSheetRef} />
            <EditCompetitionModal ref={editSheetRef} />
        </SafeAreaProvider>
    );
}
