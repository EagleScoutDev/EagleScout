import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { type CompetitionReturnData, CompetitionsDB } from "@/lib/database/Competitions";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";
import { exportPitReportsToCsv, exportScoutReportsToCsv, writeToFile } from "@/lib/export";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";

export function ExportReports() {
    "use no memo";
    // FIXME: Enable memoization when react compiler stops
    //        complaining about passing refs to UIList.Line

    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<ExportCompetitionSheet>(null);

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
                    <UIList.Section>
                        {competitionList.map((comp) => (
                            <UIList.Label
                                key={comp.id.toString()}
                                label={`${comp.name} (${new Date(comp.startTime).getFullYear()})`}
                                onPress={() => modalRef.current?.present({ competition: comp })}
                            />
                        ))}
                    </UIList.Section>
                </UIList>
            </View>

            <ExportCompetitionSheet ref={modalRef} />
        </>
    );
}

interface ExportCompetitionSheetParams {
    competition: CompetitionReturnData;
}
interface ExportCompetitionSheet extends UISheetModal<ExportCompetitionSheetParams> {}
const ExportCompetitionSheet = UISheetModal.HOC<ExportCompetitionSheetParams>(
    function ExportCompetitionSheet({ ref, data: { competition } }) {
        const { colors } = useTheme();

        async function exportMatchReports() {
            const data = await exportScoutReportsToCsv(competition);
            if (!data) return;

            ref.current?.dismiss();
            await writeToFile(`${competition.name}.csv`, data);
        }
        async function exportPitReports() {
            if (!competition.pitScoutFormId) {
                await AsyncAlert.alert(
                    "No Pit Scout Form",
                    "This competition does not have a pit scout form",
                );
            }

            const data = await exportPitReportsToCsv(competition);
            if (!data) return;

            ref.current?.dismiss();
            await writeToFile(`${competition.name}.csv`, data);
        }

        return (
            <>
                <UISheet.Header title={competition.name} />
                <UIList>
                    <UIList.Section>
                        <UIList.Label
                            label="Export Scout Reports"
                            labelColor={colors.primary}
                            onPress={exportMatchReports}
                        />
                        <UIList.Label
                            label="Export Pit Scout Reports"
                            labelColor={colors.primary}
                            onPress={exportPitReports}
                        />
                    </UIList.Section>
                </UIList>
            </>
        );
    },
);
