import { useTheme } from "@react-navigation/native";
import React from "react";
import type { CompetitionReturnData } from "../../../database/Competitions";
import { UISheet } from "../../../ui/UISheet";
import { UIList } from "../../../ui/UIList";
import { Color } from "../../../lib/color";
import { exportPitReportsToCsv, exportScoutReportsToCsv, writeToFile } from "./export";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert";

export interface ExportCompetitionSheetProps {
    data?: { competition: CompetitionReturnData };
}
export function ExportCompetitionSheet({ data }: ExportCompetitionSheetProps) {
    "use memo";
    const { colors } = useTheme();

    const modal = useBottomSheetModal();

    if (data === undefined) return <></>;
    const { competition } = data;
    return (
        <>
            <UISheet.Header title={competition.name} />
            <UIList>
                {[
                    UIList.Section({
                        items: [
                            UIList.Label({
                                label: "Export Scout Reports",
                                labelColor: Color.parse(colors.primary),
                                onPress: async () => {
                                    const data = await exportScoutReportsToCsv(competition);
                                    if (!data) return;

                                    await writeToFile(`${competition.name}.csv`, data);
                                    modal.dismiss();
                                },
                            }),
                            UIList.Label({
                                label: "Export Pit Scout Reports",
                                labelColor: Color.parse(colors.primary),
                                onPress: async () => {
                                    if (!competition.pitScoutFormId) {
                                        await AsyncAlert.alert(
                                            "No Pit Scout Form",
                                            "This competition does not have a pit scout form"
                                        );
                                    }

                                    const data = await exportPitReportsToCsv(competition);
                                    if (!data) return;

                                    await writeToFile(`${competition.name}.csv`, data);
                                    modal.dismiss();
                                },
                            }),
                        ],
                    }),
                ]}
            </UIList>
        </>
    );
}
