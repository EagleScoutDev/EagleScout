import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { adminMutations } from "@/lib/mutations/admin";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import * as Bs from "@/ui/icons";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { EditCompetitionModal } from "@/navigation/(modals)/EditCompetitionModal";
import { AddCompetitionModal } from "@/navigation/(modals)/AddCompetitionModal";
import { Alert } from "react-native";

export function ManageCompetitions() {
    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);
    const { mutate: updateCompetition } = useMutation(adminMutations.updateCompetition);
    const { mutate: deleteCompetition } = useMutation(adminMutations.deleteCompetition);

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
                        <UIList.Row
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
                                    onSubmit: (compPatch) => {
                                        updateCompetition(
                                            {
                                                competitionId: compPatch.id,
                                                name: compPatch.name,
                                                startTime: compPatch.start,
                                                endTime: compPatch.end,
                                            },
                                            {
                                                onSuccess: () => {
                                                    editSheetRef.current?.dismiss();
                                                    void refreshCompetitions();
                                                },
                                                onError: () => {
                                                    Alert.alert(
                                                        "Error",
                                                        "An error occurred, please try again later.",
                                                    );
                                                },
                                            },
                                        );
                                    },
                                    onDelete: (compPatch) => {
                                        deleteCompetition(
                                            { competitionId: compPatch.id },
                                            {
                                                onSuccess: () => {
                                                    editSheetRef.current?.dismiss();
                                                    void refreshCompetitions();
                                                },
                                                onError: () => {
                                                    Alert.alert(
                                                        "Error",
                                                        "An error occurred, please try again later.",
                                                    );
                                                },
                                            },
                                        );
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
