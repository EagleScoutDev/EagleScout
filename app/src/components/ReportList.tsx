import { KeyboardAvoidingView, SectionList, View } from "react-native";
import { UIText } from "../ui/UIText";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useCurrentCompetition } from "../lib/hooks/useCurrentCompetition.ts";
import { Arrays } from "../lib/util/Arrays.ts";
import type { MatchReportReturnData } from "../database/ScoutMatchReports.ts";
import { PressableOpacity } from "../ui/components/PressableOpacity.tsx";
import { MatchReportViewer } from "./modals/MatchReportViewer.tsx";
import { Color } from "../lib/color.ts";

export interface ReportListProps {
    reports: MatchReportReturnData[];
    reportsAreOffline: boolean;

    onEdit?: (orig: MatchReportReturnData, edited: MatchReportReturnData) => Promise<boolean>;
}
export function ReportList({ reports, reportsAreOffline, onEdit }: ReportListProps) {
    "use memo";

    const { colors } = useTheme();

    const { competition: currentCompetition } = useCurrentCompetition();

    const [chosenReport, setChosenReport] = useState<MatchReportReturnData | null>(null);
    const reportViewerRef = useRef<MatchReportViewer>(null);

    const [collapsedComps, setCollapsedComps] = useState<ReadonlySet<string>>(new Set());

    // Present the modal when a report is chosen
    useEffect(() => {
        if (chosenReport) {
            // Small delay to ensure the modal ref is ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    reportViewerRef.current?.present();
                }, 100);
            });
        }
    }, [chosenReport]);

    const reportsByComp = Arrays.group(reports, (report) => report.competitionName);
    const competitions = Array.from(reportsByComp.keys());

    if (!reports || reports.length === 0) {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.card,
                    alignSelf: "center",
                    borderRadius: 15,
                    padding: 20,
                }}
            >
                <UIText size={16} bold color={Color.parse(colors.notification)} style={{ paddingHorizontal: "10%" }}>
                    No reports found.
                </UIText>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
            <SectionList
                sections={competitions.map((name) => ({ name, data: reportsByComp.get(name) ?? [] }))}
                extraData={collapsedComps}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    if (collapsedComps.has(item.competitionName)) return <></>;

                    return (
                        <PressableOpacity
                            onPress={() => setChosenReport(item)}
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 8,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <UIText size={16} bold nowrap>
                                <UIText style={{ textAlign: "center", flex: 1 }}>{item.teamNumber}</UIText>
                                <UIText style={{ textAlign: "center", flex: 1 }}>{item.matchNumber}</UIText>
                                <UIText style={{ textAlign: "center", flex: 2 }}>
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </UIText>
                            </UIText>
                        </PressableOpacity>
                    );
                }}
            />

            {chosenReport !== null && (
                <MatchReportViewer
                    ref={reportViewerRef}
                    onDismiss={() => setChosenReport(null)}
                    data={chosenReport}
                    isOfflineForm={reportsAreOffline}
                    onEdit={(orig, edited) => {
                        // TODO: implement this
                    }}
                    navigateToTeamViewer={() => {
                        // TODO: implement navigation to team viewer
                    }}
                />
            )}
        </KeyboardAvoidingView>
    );
}
