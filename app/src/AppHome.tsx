import { createNativeBottomTabNavigator, type NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { type NavigatorScreenParams } from "@react-navigation/native";
import { ScoutFlow, type ScoutMenuParamList } from "./screens/scouting/ScoutingFlow";
import { SearchMenu, type SearchMenuParamList } from "./screens/search/SearchMenu";
import type { RootStackScreenProps } from "./App";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings/SettingsMenu";
import { useEffect } from "react";
import { useUserStore } from "./lib/stores/user";
import { DataMain, type DataMenuParamList } from "./screens/data/DataMain";
import { Platform } from "react-native";
import { useTheme } from "./lib/contexts/ThemeContext.ts";

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
    const { colors } = useTheme();

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
            <Tab.Navigator
                labeled
                translucent
                tabBarStyle={Platform.OS === "ios" ? {} : { backgroundColor: colors.bg2.hex }}
                tabBarActiveTintColor={Platform.OS === "ios" ? colors.primary.hex : colors.fg.hex}
                tabBarInactiveTintColor={colors.fg.hex}
                activeIndicatorColor={colors.tertiary.hex} //< Android only
            >
                <Tab.Screen
                    name="Home"
                    component={ScoutFlow}
                    options={{
                        title: "Scouting",
                        tabBarIcon: ({ focused }) =>
                            Platform.OS === "ios" || focused
                                ? require("bootstrap-icons/icons/binoculars-fill.svg")
                                : require("bootstrap-icons/icons/binoculars.svg"),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchMenu}
                    options={{
                        title: "Teams",
                        tabBarIcon: ({ focused }) =>
                            Platform.OS !== "ios" && focused
                                ? require("bootstrap-icons/icons/search-heart-fill.svg")
                                : require("bootstrap-icons/icons/search.svg"),
                    }}
                />
                <Tab.Screen
                    name="Data"
                    component={DataMain}
                    options={{
                        title: "Data",
                        tabBarIcon: ({ focused }) =>
                            Platform.OS === "ios" || focused
                                ? require("bootstrap-icons/icons/bar-chart-line-fill.svg")
                                : require("bootstrap-icons/icons/bar-chart-line.svg"),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsMenu}
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ focused }) =>
                            Platform.OS === "ios" || focused
                                ? require("bootstrap-icons/icons/person-fill.svg")
                                : require("bootstrap-icons/icons/person.svg"),
                    }}
                />
            </Tab.Navigator>
        </>
    );
}
