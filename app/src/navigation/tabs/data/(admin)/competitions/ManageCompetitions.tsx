import { useRef } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminMutations } from "@/lib/mutations/admin";
import { queries } from "@/lib/queries";
import * as Bs from "@/ui/icons";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UIFab } from "@/ui/components/UIFab";
import { EditCompetitionModal } from "@/navigation/(modals)/EditCompetitionModal";
import { AddCompetitionModal } from "@/navigation/(modals)/AddCompetitionModal";
import { Alert } from "react-native";

export function ManageCompetitions() {
    const updateCompetition = useMutation(adminMutations.updateCompetition);
    const deleteCompetition = useMutation(adminMutations.deleteCompetition);
    const {
        data: competitionList = [],
        isError: internetError,
        refetch,
    } = useQuery(queries.competitions.all);

    console.log(competitionList, internetError);
    const editSheetRef = useRef<EditCompetitionModal>(null);
    const addSheetRef = useRef<AddCompetitionModal>(null);

    if (internetError) {
        return <NoInternet onRefresh={() => refetch()} />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Competitions"} />
            </SafeAreaView>

            <UIList onRefresh={refetch}>
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
                                    onSubmit: async (compPatch) => {
                                        try {
                                            await updateCompetition.mutateAsync({
                                                competitionId: compPatch.id,
                                                name: compPatch.name,
                                                startTime: compPatch.start,
                                                endTime: compPatch.end,
                                            });
                                            editSheetRef.current?.dismiss();
                                            void refetch();
                                        } catch (error) {
                                            Alert.alert(
                                                "Error",
                                                "An error occurred, please try again later.",
                                            );
                                        }
                                    },
                                    onDelete: async (compPatch) => {
                                        try {
                                            await deleteCompetition.mutateAsync({ competitionId: compPatch.id });
                                            editSheetRef.current?.dismiss();
                                            void refetch();
                                        } catch (error) {
                                            Alert.alert(
                                                "Error",
                                                "An error occurred, please try again later.",
                                            );
                                        }
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
