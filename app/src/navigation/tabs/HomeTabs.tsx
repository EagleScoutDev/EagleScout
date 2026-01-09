import { createNativeBottomTabNavigator, type NativeBottomTabScreenProps } from "@bottom-tabs/react-navigation";
import { type NavigatorScreenParams } from "@react-navigation/native";
import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/user";
import { Platform } from "react-native";
import { useTheme } from "@/ui/context/ThemeContext";

import type { RootStackScreenProps } from "@/navigation";
import { type ScoutMenuParamList, ScoutTab } from "./scout";
import { BrowseTab, type BrowseTabParamList } from "./browse";
import { SettingsTab, type SettingsTabParamList } from "./settings";
import { DataTab, type DataTabParamList } from "./data";

const Tab = createNativeBottomTabNavigator<HomeTabsParamList>();
export type HomeTabProps<K extends keyof HomeTabsParamList> = NativeBottomTabScreenProps<HomeTabsParamList, K>;
export type HomeTabsParamList = {
    Home: NavigatorScreenParams<ScoutMenuParamList>;
    Browse: NavigatorScreenParams<BrowseTabParamList>;
    Data: NavigatorScreenParams<DataTabParamList>;
    Settings: NavigatorScreenParams<SettingsTabParamList>;
};

export interface HomeTabsProps extends RootStackScreenProps<"HomeTabs"> {}
export function HomeTabs({ navigation }: HomeTabsProps) {
    const { colors } = useTheme();
    const account = useUserStore((state) => state.account);

    useEffect(() => {
        if (account === null) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Onboarding", params: { state: undefined } }],
            });
        }
    }, [account, navigation]);

    return (
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
                component={ScoutTab}
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) =>
                        Platform.OS === "ios"
                        ? { sfSymbol: "binoculars.fill" }
                            : focused
                            ? require("bootstrap-icons/icons/binoculars-fill.svg")
                            : require("bootstrap-icons/icons/binoculars.svg"),
                }}
            />
            <Tab.Screen
                name="Browse"
                component={BrowseTab}
                options={{
                    title: "Browse",
                    role: "search",
                    tabBarIcon: ({ focused }) =>
                        Platform.OS === "ios"
                            ? { sfSymbol: "magnifyingglass" }
                            : focused
                            ? require("bootstrap-icons/icons/search-heart-fill.svg")
                            : require("bootstrap-icons/icons/search.svg"),
                }}
            />
            <Tab.Screen
                name="Data"
                component={DataTab}
                options={{
                    title: "Data",
                    tabBarIcon: ({ focused }) =>
                        Platform.OS === "ios"
                            ? { sfSymbol: "chart.bar.xaxis" }
                            : focused
                            ? require("bootstrap-icons/icons/bar-chart-fill.svg")
                            : require("bootstrap-icons/icons/bar-chart.svg"),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsTab}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) =>
                        Platform.OS === "ios"
                            ? { sfSymbol: "person.fill" }
                            : focused
                            ? require("bootstrap-icons/icons/person-fill.svg")
                            : require("bootstrap-icons/icons/person.svg"),
                }}
            />
        </Tab.Navigator>
    );
}
