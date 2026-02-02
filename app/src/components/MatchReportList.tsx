import { FlatList, KeyboardAvoidingView, View } from "react-native";
import type { MatchReportReturnData } from "@/lib/database/ScoutMatchReports";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { PressableOpacity } from "@/components/PressableOpacity";
import { MatchReportModal } from "@/navigation/(modals)/MatchReportModal";
import { useRef } from "react";

export interface MatchReportListProps {
    reports: MatchReportReturnData[];
    reportsAreOffline: boolean;

    onEdit?: (orig: MatchReportReturnData, edited: MatchReportReturnData) => Promise<boolean>;
}
export function MatchReportList({ reports, reportsAreOffline, onEdit }: MatchReportListProps) {
    const { colors } = useTheme();

    const sheetRef = useRef<MatchReportModal>(null);

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
        <>
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
                                onPress={() => {
                                    sheetRef.current?.present({
                                        report: item,
                                        isOfflineForm: reportsAreOffline,
                                    });
                                }}
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
            </KeyboardAvoidingView>

            <MatchReportModal ref={sheetRef} />
        </>
    );
}
