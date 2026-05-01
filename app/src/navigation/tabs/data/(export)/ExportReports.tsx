import { View } from "react-native";
import React, { useRef } from "react";
import { type CompetitionReturnData } from "@/lib/db/models/Competition";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { useTheme } from "@/ui/context/ThemeContext";
import { UISheet } from "@/ui/components/UISheet";
import { exportPitReportsToCsv, exportScoutReportsToCsv, writeToFile } from "@/lib/export";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export function ExportReports() {
    const { data: competitionList = [], isLoading, isError, refetch } = useQuery(queries.competitions.all);

    const modalRef = useRef<ExportCompetitionSheet>(null);

    return (
        <>
            <View style={{ flex: 1 }}>
                <TabHeader
                    title={"Export CSV"}
                    description={"Choose a competition to export the scout reports to a CSV file"}
                />
                <UIList loading={isLoading} onRefresh={refetch}>
                    <UIList.Section>
                        {competitionList.map((comp) => (
                            <UIList.Row
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
            if (!competition.pitForm.id) {
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
                        <UIList.Row
                            label="Export Scout Reports"
                            labelColor={colors.primary}
                            onPress={exportMatchReports}
                        />
                        <UIList.Row
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
