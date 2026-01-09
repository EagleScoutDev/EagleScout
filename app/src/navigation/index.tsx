import { type NavigatorScreenParams } from "@react-navigation/native";
import { HomeTabs, type HomeTabsParamList } from "@/navigation/tabs/HomeTabs";
import * as React from "react";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingFlow, type OnboardingParamList } from "@/navigation/onboarding";
import { BettingScreen, type BettingScreenParams } from "@/navigation/(betting)/BettingScreen.tsx";
import { MatchBetting } from "@/navigation/(betting)/MatchBetting.tsx";
import { useStackThemeConfig } from "@/ui/lib/theme/native.ts";

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
    MatchBetting: undefined;
    "MatchBetting/BettingScreen": BettingScreenParams;
    Onboarding: NavigatorScreenParams<OnboardingParamList>;
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

            <RootStack.Group
                screenOptions={{ title: "Match Betting", headerShown: true }}
            >
                <RootStack.Screen name="MatchBetting" component={MatchBetting} />
                <RootStack.Screen name="MatchBetting/BettingScreen" component={BettingScreen} />
            </RootStack.Group>

            <RootStack.Screen
                name="Onboarding"
                component={OnboardingFlow}
                options={{
                    animation: "ios_from_right",
                }}
            />
        </RootStack.Navigator>
    );
}
