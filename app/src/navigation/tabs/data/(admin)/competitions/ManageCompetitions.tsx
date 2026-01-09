import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import * as Bs from "@/ui/icons";
import { EditCompetition } from "../../../../(modals)/EditCompetition.tsx";
import { supabase } from "@/lib/supabase";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { useNavigation } from "@react-navigation/native";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert.ts";

export function ManageCompetitions() {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);

    const rootNavigation = useNavigation();

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
                                rootNavigation.push("EditCompetition", {
                                    params: {
                                        id: comp.id,
                                        name: comp.name,
                                        start: comp.startTime,
                                        end: comp.endTime,
                                        async onSubmit(comp) {
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
                                                rootNavigation.pop();
                                            }

                                            void refreshCompetitions();
                                        },
                                        async onDelete(comp) {
                                            const { error } = await supabase
                                                .from("competitions")
                                                .delete()
                                                .eq("id", comp.id);
                                            if (error !== null) {
                                                console.error(error);
                                                Alert.alert("Error", "An error occurred, please try again later.");
                                            } else {
                                                rootNavigation.pop();
                                            }

                                            void refreshCompetitions();
                                        },
                                    },
                                });
                            },
                        })
                    ),
                })}
            </UIList>

            <UIFab
                icon={Bs.Plus}
                onPress={() => {
                    rootNavigation.push("AddCompetition", {
                        params: {
                            async onSubmit(comp) {
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
                                    rootNavigation.pop();
                                }

                                void refreshCompetitions();
                            },
                        },
                    });
                }}
            />
        </SafeAreaProvider>
    );
}
