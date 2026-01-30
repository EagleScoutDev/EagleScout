import { type NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { HomeTabs, type HomeTabsParamList } from "@/navigation/tabs/HomeTabs";
import * as React from "react";
import {
    createNativeStackNavigator,
    type NativeStackNavigationProp,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { OnboardingFlow, type OnboardingParamList } from "@/navigation/onboarding";
import { BettingScreen, type BettingScreenParams } from "@/navigation/(betting)/BettingScreen";
import { MatchBetting } from "@/navigation/(betting)/MatchBetting";
import { useStackThemeConfig } from "@/ui/lib/theme/native";
import { TeamSummary, type TeamSummaryParams } from "@/navigation/(recon)/TeamSummary";
import { TeamAutoPaths, type TeamAutoPathsParams } from "@/navigation/(recon)/TeamAutoPaths";
import { TeamReports, type TeamReportsParams } from "@/navigation/(recon)/TeamReports";
import { TeamComparison, type TeamComparisonParams } from "@/navigation/(recon)/TeamComparison";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export function useRootNavigation() {
    return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

export function RootNavigator() {
    return (
        <SafeAreaProvider>
            <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                    headerShown: false,
                    ...useStackThemeConfig(),
                }}
            >
                <Stack.Screen name="HomeTabs" component={HomeTabs} />

                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingFlow}
                    options={{
                        animation: "ios_from_right",
                    }}
                />

                <Stack.Group screenOptions={{ title: "Match Betting", headerShown: true }}>
                    <Stack.Screen name="MatchBetting" component={MatchBetting} />
                    <Stack.Screen name="MatchBetting/BettingScreen" component={BettingScreen} />
                </Stack.Group>

                <Stack.Screen
                    name="TeamSummary"
                    component={TeamSummary}
                    options={{
                        headerBackButtonDisplayMode: "minimal",
                        headerShown: true,
                        headerTransparent: true,
                        headerTitle: "",
                        headerStyle: {},
                    }}
                />

                <Stack.Group
                    screenOptions={{
                        headerShown: true,
                        headerBackButtonDisplayMode: "minimal",
                    }}
                >
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
                </Stack.Group>
            </Stack.Navigator>
        </SafeAreaProvider>
    );
}
