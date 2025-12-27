import { type NavigatorScreenParams } from "@react-navigation/native";
import { HomeTabs, type HomeTabsParamList } from "@/navigation/tabs/HomeTabs";
import * as React from "react";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingFlow, type OnboardingParamList } from "@/navigation/onboarding";

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    HomeTabs: NavigatorScreenParams<HomeTabsParamList>;
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
        </RootStack.Navigator>
    );
}
