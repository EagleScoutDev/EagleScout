import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NoInternet } from "../../../ui/NoInternet";
import { type CompetitionReturnData, CompetitionsDB } from "../../../database/Competitions";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";
import { TabHeader } from "../../../ui/navigation/TabHeader.tsx";
import { ExportCompetitionSheet } from "./ExportCompetitionSheet.tsx";
import { UIList } from "../../../ui/UIList.tsx";

export function ExportToCSV() {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<UISheetModal<{ competition: CompetitionReturnData }>>(null);

    async function refreshCompetitions() {
        setLoading(true);
        try {
            const data = await CompetitionsDB.getCompetitions();
            data.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
            setCompetitionList(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
        setLoading(false);
    }
    useEffect(() => void refreshCompetitions(), []);

    if (internetError) {
        return <NoInternet onRefresh={() => refreshCompetitions()} />;
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <TabHeader
                    title={"Export CSV"}
                    description={"Choose a competition to export the scout reports to a CSV file"}
                />
                <UIList loading={loading} onRefresh={refreshCompetitions}>
                    {[
                        UIList.Section({
                            items: competitionList.map((comp) =>
                                UIList.Line({
                                    key: comp.id.toString(),
                                    label: `${comp.name} (${new Date(comp.startTime).getFullYear()})`,
                                    onPress: () => modalRef.current?.present({ competition: comp }),
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
