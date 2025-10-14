import { View } from "react-native";
import React, { useRef, useState } from "react";
import { NoInternet } from "../../../ui/NoInternet";
import { type CompetitionReturnData, CompetitionsDB } from "../../../database/Competitions";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";
import { TabHeader } from "../../../ui/navigation/TabHeader.tsx";
import { ExportCompetitionSheet } from "./ExportCompetitionSheet.tsx";
import { UIList } from "../../../ui/UIList.tsx";

export function ExportToCSV() {
    "use memo";
    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);

    const modalRef = useRef<UISheetModal<{ competition: CompetitionReturnData }>>(null);

    async function fetchCompetitions() {
        try {
            const data = await CompetitionsDB.getCompetitions();
            data.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
            setCompetitionList(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
    }

    if (internetError) {
        return <NoInternet onRefresh={() => fetchCompetitions()} />;
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <TabHeader
                    title={"Export CSV"}
                    description={"Choose a competition to export the scout reports to a CSV file"}
                />
                <UIList onRefresh={fetchCompetitions} refreshOnMount>
                    {/*{competitionList.length === 0 && !competitionsLoading && (*/}
                    {/*    <Text style={{ color: colors.text, textAlign: "center" }}>No competitions found</Text>*/}
                    {/*)}*/}
                    {[
                        UIList.Section({
                            items: competitionList.map((comp, index) =>
                                UIList.Item({
                                    key: comp.id.toString(),
                                    label: `${comp.name} (${new Date(comp.startTime).getFullYear()})`,
                                    onPress: () => {
                                        modalRef.current?.present({ competition: comp });
                                    },
                                })
                            ),
                        }),
                    ]}
                </UIList>
            </View>

            <UISheetModal
                ref={modalRef}
                gap={"40%"}
                enablePanDownToClose
                backdropPressBehavior={"close"}
                handleComponent={null}
                children={ExportCompetitionSheet}
            />
        </>
    );
}
