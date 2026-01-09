import { type NavigatorScreenParams } from "@react-navigation/native";
import { HomeTabs, type HomeTabsParamList } from "@/navigation/tabs/HomeTabs";
import * as React from "react";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingFlow, type OnboardingParamList } from "@/navigation/onboarding";
import { BettingScreen, type BettingScreenParams } from "@/navigation/(betting)/BettingScreen.tsx";
import { MatchBetting } from "@/navigation/(betting)/MatchBetting.tsx";
import { useStackThemeConfig } from "@/ui/lib/theme/native.ts";
import { EditCompetition, type EditCompetitionScreenParams } from "@/navigation/(modals)/EditCompetition.tsx";
import { AddCompetition, type AddCompetitionScreenParams } from "@/navigation/(modals)/AddCompetition.tsx";

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
    Onboarding: NavigatorScreenParams<OnboardingParamList>;

    MatchBetting: undefined;
    "MatchBetting/BettingScreen": BettingScreenParams;
    EditCompetition: EditCompetitionScreenParams;
    AddCompetition: AddCompetitionScreenParams;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export function RootNavigator() {
    return (
        <RootStack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
                headerShown: false,
                ...useStackThemeConfig(),
            }}
        >
            <RootStack.Screen name="HomeTabs" component={HomeTabs} />

            <RootStack.Screen
                name="Onboarding"
                component={OnboardingFlow}
                options={{
                    animation: "ios_from_right",
                }}
            />

            <RootStack.Group screenOptions={{ title: "Match Betting", headerShown: true }}>
                <RootStack.Screen name="MatchBetting" component={MatchBetting} />
                <RootStack.Screen name="MatchBetting/BettingScreen" component={BettingScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ presentation: "formSheet" }}>
                <RootStack.Screen
                    name={"EditCompetition"}
                    component={EditCompetition}
                    options={{
                        title: "Edit Competition",
                    }}
                />
                <RootStack.Screen
                    name={"AddCompetition"}
                    component={AddCompetition}
                    options={{
                        title: "New Competition",
                    }}
                />
            </RootStack.Group>
        </RootStack.Navigator>
    );
}
