/**
 * This file displays the forms the user has submitted for a specific competition.
 * Forms are separated into two:
 * 1) the forms they have submitted offline, but have not been pushed
 *    give option for "select all" and submit, or user can select manually
 * 2) the forms they have uploaded to the database in the past
 */
import { ActivityIndicator, Alert, View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useEffect, useState } from "react";
import { ReportList } from "../../../components/ReportList";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UISegmentedControl } from "../../../ui/input/pickers/UISegmentedControl";
import { StandardButton } from "../../../ui/StandardButton";
import Toast from "react-native-toast-message";
import { type MatchReportReturnData, MatchReportsDB } from "../../../database/ScoutMatchReports";
import { CompetitionsDB } from "../../../database/Competitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { SettingsMenuScreenProps } from "../SettingsMenu";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

export function SubmittedForms({ route }: SettingsMenuScreenProps<"Scout/ViewReports">) {
    const { competitionId } = route.params;
    const [reports, setReports] = useState<MatchReportReturnData[]>([]);
    const [offlineReports, setOfflineReports] = useState<MatchReportReturnData[]>([]);
    const { colors } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState<"Offline" | "In Database">("Offline");
    const [loading, setLoading] = useState(false);

    async function getOfflineReports() {
        const formsFound = await Promise.all(
            (await AsyncStorage.getAllKeys())
                .filter((key) => key.startsWith("form-"))
                .map((key) => AsyncStorage.getItem(key).then((x) => JSON.parse(x!)))
        );

        setOfflineReports(formsFound);
    }

    async function fetchReportsForCompetition() {
        setLoading(true);
        setReports(await MatchReportsDB.getReportsForCompetition(competitionId));
        setLoading(false);
    }

    useEffect(() => {
        void fetchReportsForCompetition();
        void getOfflineReports();
    }, [competitionId]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 16 }}>
                <View style={{ marginBottom: 16 }}>
                    <UISegmentedControl
                        selected={selectedTheme}
                        options={[{ title: "Offline" }, { title: "In Database" }]}
                        onPress={(option) => {
                            switch (option) {
                                case "Offline":
                                    setSelectedTheme("Offline");
                                    setLoading(true);
                                    getOfflineReports().then(() => setLoading(false));
                                    break;
                                case "In Database":
                                    setSelectedTheme("In Database");
                                    setLoading(true);
                                    fetchReportsForCompetition();
                                    break;
                            }
                        }}
                    />
                </View>

                {loading && <ActivityIndicator animating={loading} size={"large"} />}

                {selectedTheme === "Offline" && offlineReports && offlineReports.length === 0 && (
                    <View
                        style={{
                            padding: 20,
                            borderRadius: 10,
                            alignContent: "center",
                            backgroundColor: colors.border.hex,
                        }}
                    >
                        <UIText size={20} bold style={{ textAlign: "center" }}>
                            No offline reports!
                        </UIText>
                        <UIText size={15} style={{ textAlign: "center" }}>
                            Great job keeping your data up-to-date.
                        </UIText>
                    </View>
                )}

                {selectedTheme === "Offline" && offlineReports.length !== 0 && (
                    <View style={{ flex: 1 }}>
                        <StandardButton
                            color={"red"}
                            text={"Push offline to database"}
                            onPress={async () => {
                                const internetResponse = await CompetitionsDB.getCurrentCompetition()
                                    .then(() => true)
                                    .catch(() => false);

                                if (!internetResponse) {
                                    Alert.alert(
                                        "No internet connection",
                                        "Please connect to the internet to push offline reports"
                                    );
                                    return;
                                }

                                for (let i = 0; i < offlineReports.length; i++) {
                                    const report = offlineReports[i];
                                    const utcMilliseconds = new Date(report.createdAt).getUTCMilliseconds();

                                    try {
                                        await MatchReportsDB.createOfflineScoutReport({
                                            ...report,
                                            form: undefined,
                                            formId: undefined,
                                        });
                                        Toast.show({
                                            type: "success",
                                            text1: "Scouting report submitted!",
                                            visibilityTime: 3000,
                                        });
                                    } catch (error) {
                                        console.error(error);
                                        break;
                                    }

                                    await AsyncStorage.removeItem("form-" + utcMilliseconds);
                                }
                                // clear the offline reports
                                setOfflineReports([]);
                                // refresh the reports
                                MatchReportsDB.getReportsForCompetition(competitionId).then((results) => {
                                    setReports(results);
                                    Toast.show({
                                        type: "success",
                                        text1: "All offline reports have been pushed!",
                                    });
                                });
                            }}
                        />
                        <ReportList reports={offlineReports} reportsAreOffline={true} />
                    </View>
                )}

                {selectedTheme === "In Database" && (
                    <View style={{ flex: 1 }}>
                        <ReportList reports={reports} reportsAreOffline={false} />
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
