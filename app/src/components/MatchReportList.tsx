import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import type { MatchReportReturnData } from "@/lib/database/ScoutMatchReports.ts";
import { useTheme } from "@/ui/context/ThemeContext";
import { MatchReportViewer } from "@/components/modals/MatchReportViewer";
import { UIText } from "@/ui/components/UIText";
import { PressableOpacity } from "@/components/PressableOpacity";

export interface MatchReportListProps {
    reports: MatchReportReturnData[];
    reportsAreOffline: boolean;

    onEdit?: (orig: MatchReportReturnData, edited: MatchReportReturnData) => Promise<boolean>;
}
export function MatchReportList({ reports, reportsAreOffline, onEdit }: MatchReportListProps) {
    const { colors } = useTheme();

    const [chosenReport, setChosenReport] = useState<MatchReportReturnData | null>(null);
    const reportViewerRef = useRef<MatchReportViewer>(null);

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

    if (!reports || reports.length === 0) {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.bg1.hex,
                    alignSelf: "center",
                    borderRadius: 15,
                    padding: 20,
                }}
            >
                <UIText size={16} bold color={colors.danger} style={{ paddingHorizontal: "10%" }}>
                    No reports found.
                </UIText>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
            <FlatList
                data={reports}
                contentContainerStyle={{ padding: 16 }}
                contentInsetAdjustmentBehavior={"automatic"}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => {
                    return (
                        <PressableOpacity
                            onPress={() => setChosenReport(item)}
                            style={{
                                backgroundColor: colors.bg1.hex,
                                borderColor: colors.border.hex,
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 16,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View style={{ flex: 1, alignItems: "flex-start" }}>
                                <UIText bold>
                                    Team {item.teamNumber} Match {item.matchNumber}
                                </UIText>
                                <UIText bold>{item.competitionName}</UIText>
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                <UIText>{item.userName}</UIText>
                                <UIText>
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </UIText>
                            </View>
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
