import { createNativeBottomTabNavigator, type NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { type NavigatorScreenParams } from "@react-navigation/native";
import { ScoutFlow, type ScoutMenuParamList } from "./screens/scouting/ScoutingFlow";
import { SearchMenu, type SearchMenuParamList } from "./screens/search/SearchMenu";
import type { RootStackScreenProps } from "./App";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings/SettingsMenu";
import { useEffect } from "react";
import { useUserStore } from "./lib/stores/user";
import { DataMain, type DataMenuParamList } from "./screens/data/DataMain";

const Tab = createNativeBottomTabNavigator<AppHomeParamList>();
export type AppHomeScreenProps<K extends keyof AppHomeParamList> = NativeBottomTabScreenProps<AppHomeParamList, K>;
export type AppHomeParamList = {
    Home: NavigatorScreenParams<ScoutMenuParamList>;
    Search: NavigatorScreenParams<SearchMenuParamList>;
    Data: NavigatorScreenParams<DataMenuParamList>;
    Settings: NavigatorScreenParams<SettingsMenuParamList>;
};

export interface AppHomeProps extends RootStackScreenProps<"App"> {}
export function AppHome({ navigation }: AppHomeProps) {
    const account = useUserStore.use.account();

    useEffect(() => {
        if (account === null) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Onboarding", params: { state: undefined } }],
            });
        }
    }, [account, navigation]);

    return (
        <>
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={ScoutFlow}
                    options={{
                        title: "Scouting",
                        tabBarIcon: () => require("bootstrap-icons/icons/binoculars-fill.svg"),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchMenu}
                    options={{
                        title: "Search",
                        tabBarIcon: () => require("bootstrap-icons/icons/search.svg"),
                    }}
                />
                <Tab.Screen
                    name="Data"
                    component={DataMain}
                    options={{
                        title: "Data",
                        tabBarIcon: () => require("bootstrap-icons/icons/bar-chart-line-fill.svg"),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsMenu}
                    options={{
                        title: "Profile",
                        tabBarIcon: () => require("bootstrap-icons/icons/person-fill.svg"),
                    }}
                />
            </Tab.Navigator>
        </>
    );
}
