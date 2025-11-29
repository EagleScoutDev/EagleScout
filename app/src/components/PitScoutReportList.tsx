import { type PitReportReturnData } from "../database/ScoutPitReports";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { PitScoutViewer } from "./modals/PitScoutViewer";
import { useState } from "react";
import { UIText } from "../ui/UIText.tsx";
import { Color } from "../lib/color.ts";

export interface PitScoutReportListProps {
    reports: PitReportReturnData[] | null;
    isOffline: boolean;
}

export function PitScoutReportList({ reports, isOffline }: PitScoutReportListProps) {
    const { colors } = useTheme();
    const [chosenReport, setChosenReport] = useState<PitReportReturnData | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    if (!reports || reports.length === 0) {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.card,
                    width: "80%",
                    alignSelf: "center",
                    borderRadius: 15,
                    padding: 20,
                    marginTop: 20,
                }}
            >
                <UIText size={16} color={Color.parse(colors.notification)} bold style={{ paddingHorizontal: "10%" }}>
                    No reports found.
                </UIText>
            </View>
        );
    }
    return (
        <View
            style={{
                flex: 1,
                marginTop: 20,
            }}
        >
            <FlatList
                data={reports}
                ListHeaderComponent={() => (
                    <View>
                        <View
                            style={{
                                display: "flex",
                                width: "90%",
                                alignSelf: "center",
                                borderRadius: 15,
                                paddingHorizontal: 20,
                                paddingBottom: 10,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1.5,
                                    borderRadius: 15,
                                }}
                            >
                                <UIText size={16} bold>
                                    Competition
                                </UIText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 2,
                                    borderRadius: 15,
                                }}
                            >
                                <UIText size={16} bold style={{ textAlign: "center" }}>
                                    Date
                                </UIText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setChosenReport(item);
                            setModalVisible(true);
                        }}
                        style={{
                            display: "flex",
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                backgroundColor: colors.card,
                                width: "90%",
                                alignSelf: "center",
                                borderRadius: 15,
                                padding: 20,
                                marginVertical: 5,
                                borderWidth: 1,
                                borderColor: colors.border,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <UIText size={16} bold style={{ flex: 1.5 }}>
                                {item.competitionName}
                            </UIText>
                            <UIText size={16} bold style={{ flex: 2, textAlign: "right" }}>
                                {item.createdAt.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </UIText>
                        </View>
                    </TouchableOpacity>
                )}
            />
            {chosenReport !== null && (
                <PitScoutViewer visible={modalVisible} setVisible={setModalVisible} data={chosenReport} />
            )}
        </View>
    );
}
