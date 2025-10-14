import { useTheme } from "@react-navigation/native";
import React from "react";
import type { CompetitionReturnData } from "../../../database/Competitions.ts";
import { UISheet } from "../../../ui/UISheet.tsx";
import { UIList } from "../../../ui/UIList.tsx";
import { Color } from "../../../lib/color.ts";
import { exportPitReportsToCsv, exportScoutReportsToCsv, writeToFile } from "./export.ts";
import { Alert } from "react-native";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export interface ExportCompetitionSheetProps {
    data?: { competition: CompetitionReturnData };
}
export const ExportCompetitionSheet = ({ data }: ExportCompetitionSheetProps) => {
    "use memo";
    const { colors } = useTheme();

    const modal = useBottomSheetModal();

    if (data === undefined) return <></>;
    const { competition } = data;
    return (
        <>
            <UISheet.Header title={`Export "${competition.name}"`} />
            <UIList>
                {[
                    UIList.Section({
                        items: [
                            UIList.Item({
                                label: "Export Scout Reports",
                                labelColor: Color.parse(colors.primary),
                                onPress: async () => {
                                    // TODO: setProcessing(true);
                                    const data = await exportScoutReportsToCsv(competition);
                                    if (!data) return;

                                    await writeToFile(`${competition.name}.csv`, data);
                                    // TODO: setProcessing(false);
                                    modal.dismiss();
                                },
                            }),
                            UIList.Item({
                                label: "Export Pit Scout Reports",
                                labelColor: Color.parse(colors.primary),
                                onPress: async () => {
                                    if (!competition.pitScoutFormId) {
                                        Alert.alert(
                                            "No Pit Scout Form",
                                            "This competition does not have a pit scout form"
                                        );
                                        return;
                                    }
                                    // TODO: setProcessing(true);
                                    const data = await exportPitReportsToCsv(competition);
                                    if (!data) return;

                                    await writeToFile(`${competition.name}.csv`, data);
                                    // TODO: setProcessing(false);
                                    modal.dismiss();
                                },
                            }),
                        ],
                    }),
                ]}
            </UIList>
        </>
    );
};
