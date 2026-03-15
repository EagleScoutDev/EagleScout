import * as React from "react";
import { type NavigatorScreenParams } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { HomeTabs, type HomeTabsParamList } from "@/navigation/tabs/HomeTabs";
import { OnboardingFlow, type OnboardingParamList } from "@/navigation/onboarding";
import { BettingScreen, type BettingScreenParams } from "@/navigation/(betting)/BettingScreen";
import { MatchBetting } from "@/navigation/(betting)/MatchBetting";
import { useStackThemeConfig } from "@/ui/lib/theme/native";
import { TeamSummary, type TeamSummaryParams } from "@/navigation/(recon)/TeamSummary";
import { TeamAutoPaths, type TeamAutoPathsParams } from "@/navigation/(recon)/TeamAutoPaths";
import { TeamReports, type TeamReportsParams } from "@/navigation/(recon)/TeamReports";
import { TeamComparison, type TeamComparisonParams } from "@/navigation/(recon)/TeamComparison";
import { MatchScoutingFlow } from "@/navigation/(scouting)/(match)/MatchScoutingFlow";
import { PitScoutingFlow } from "@/navigation/(scouting)/(pit)/PitScoutingFlow";
import { NoteScreen } from "@/navigation/(scouting)/(note)/NoteFlow";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
    MatchOverview,
    type MatchOverviewParams,
} from "@/navigation/tabs/data/MatchOverviews/MatchOverview";
import {
    MatchReportModal,
    type MatchReportModalParams,
} from "@/navigation/(modals)/MatchReportModal";

const Stack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    K
>;
export type RootStackParamList = {
    HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
    Onboarding: NavigatorScreenParams<OnboardingParamList>;

    MatchBetting: undefined;
    "MatchBetting/BettingScreen": BettingScreenParams;

    TeamSummary: TeamSummaryParams;
    TeamReports: TeamReportsParams;
    TeamAutoPaths: TeamAutoPathsParams;
    TeamComparison: TeamComparisonParams;
    MatchOverview: MatchOverviewParams;

    Match: undefined;
    Note: undefined;
    Pit: undefined;

    MatchReportModal: MatchReportModalParams;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export function RootNavigator() {
    return (
        <SafeAreaProvider>
            <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Group screenOptions={useStackThemeConfig("layer")}>
                    <Stack.Screen name="HomeTabs" component={HomeTabs} />

                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingFlow}
                        options={{ animation: "ios_from_right" }}
                    />

                    <Stack.Group screenOptions={{ title: "Match Betting", headerShown: true }}>
                        <Stack.Screen name="MatchBetting" component={MatchBetting} />
                        <Stack.Screen name="MatchBetting/BettingScreen" component={BettingScreen} />
                    </Stack.Group>
                </Stack.Group>
                <Stack.Group screenOptions={useStackThemeConfig("infoPage")}>
                    <Stack.Screen
                        name="TeamSummary"
                        component={TeamSummary}
                        options={{ title: "Team Summary" }}
                    />
                    <Stack.Screen
                        name="MatchOverview"
                        component={MatchOverview}
                        options={{ title: "Match Overview" }}
                    />
                </Stack.Group>
                <Stack.Group screenOptions={useStackThemeConfig("screen")}>
                    <Stack.Screen
                        name="TeamAutoPaths"
                        component={TeamAutoPaths}
                        options={({ route: { params } }) => ({
                            title: `Auto Paths for Team ${params.team_number}`,
                        })}
                    />
                    <Stack.Screen
                        name="TeamComparison"
                        component={TeamComparison}
                        options={{ title: "Compare Teams" }}
                    />
                    <Stack.Screen
                        name="TeamReports"
                        component={TeamReports}
                        options={({ route: { params } }) => ({
                            title: `Reports for Team ${params.team_number}`,
                        })}
                    />

                    <Stack.Screen
                        name="Match"
                        component={MatchScoutingFlow}
                        options={{ title: "Match Scouting" }}
                    />
                    <Stack.Screen
                        name="Pit"
                        component={PitScoutingFlow}
                        options={{ title: "Pit Scouting" }}
                    />
                    <Stack.Screen name="Note" component={NoteScreen} options={{ title: "Note" }} />
                </Stack.Group>

                <Stack.Group screenOptions={useStackThemeConfig("infoSheet")}>
                    <Stack.Screen
                        name="MatchReportModal"
                        component={MatchReportModal}
                        options={{ title: "Match Report" }}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </SafeAreaProvider>
    );
}
