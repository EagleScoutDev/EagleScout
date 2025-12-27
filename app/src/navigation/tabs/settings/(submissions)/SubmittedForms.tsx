import { View } from "react-native";
import { useEffect, useState } from "react";
import { MatchReportList } from "@/components/MatchReportList";
import Toast from "react-native-toast-message";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useMaterialTopTabThemeConfig } from "@/ui/lib/theme/native";
import { FormHelper } from "@/lib/FormHelper";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { UICard } from "@/ui/components/UICard";
import { UIText } from "@/ui/components/UIText";

const Tab = createMaterialTopTabNavigator<SubmittedFormsParamList>();
type SubmittedFormsParamList = {
    Sent: undefined;
    Offline: undefined;
};

export function SubmittedForms({ route }: SettingsTabScreenProps<"Scout/ViewReports">) {

    const { competitionId } = route.params;

    const themeScreenOptions = useMaterialTopTabThemeConfig();

    const [reports, setReports] = useState<MatchReportReturnData[]>([]);
    const [offlineReports, setOfflineReports] = useState<MatchReportReturnData[]>([]);

    async function refresh() {
        setOfflineReports(await FormHelper.getOfflineForms());
        setReports(await MatchReportsDB.getReportsForCompetition(competitionId));
    }
    useEffect(() => void refresh(), [competitionId]);

    async function publish() {
        const internetResponse = await CompetitionsDB.getCurrentCompetition()
            .then(() => true)
            .catch(() => false);
        if (!internetResponse) {
            await AsyncAlert.alert("No internet connection", "Please connect to the internet to push offline reports");
            return;
        }

        const failed = [];
        for (const report of offlineReports) {
            try {
                await MatchReportsDB.createOfflineScoutReport(report);
                await FormHelper.deleteOfflineReport(new Date(report.createdAt));
            } catch (error) {
                console.error(error);
                failed.push(report);
            }
        }

        await refresh();

        Toast.show({
            type: "success",
            text1: `Successfully uploaded ${offlineReports.length - failed.length}/${offlineReports.length} reports.`,
            visibilityTime: 3000,
        });
    }

    return (
        <SafeAreaProvider>
            <Tab.Navigator screenOptions={themeScreenOptions}>
                <Tab.Screen name={"Sent"} options={{ title: "In Database" }}>
                    {() => <MatchReportList reports={reports} reportsAreOffline={false} />}
                </Tab.Screen>

                <Tab.Screen name={"Offline"} options={{ title: "Offline" }}>
                    {() => (
                        <View style={{ flex: 1 }}>
                            <View style={{ padding: 16 }}>
                                {offlineReports.length > 0 ? (
                                    <UIButton
                                        style={UIButtonStyle.fill}
                                        size={UIButtonSize.xl}
                                        text={"Push offline to database"}
                                        onPress={publish}
                                    />
                                ) : (
                                    <UICard>
                                        <View style={{ alignItems: "center" }}>
                                            <UIText size={20} bold>
                                                No offline reports!
                                            </UIText>
                                            <UIText size={15}>Great job keeping your data up-to-date.</UIText>
                                        </View>
                                    </UICard>
                                )}
                            </View>

                            {offlineReports.length > 0 && (
                                <MatchReportList reports={offlineReports} reportsAreOffline={true} />
                            )}
                        </View>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}
