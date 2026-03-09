import { type NavigatorScreenParams } from "@react-navigation/native";
import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/user";
import { useTheme } from "@/ui/context/ThemeContext";

import type { RootStackScreenProps } from "@/navigation";
import { ScoutTab } from "./scout";
import { BrowseTab, type BrowseTabParamList } from "./browse";
import { SettingsTab, type SettingsTabParamList } from "./settings";
import { DataTab, type DataTabParamList } from "./data";
import { type BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    BarChart,
    BarChartFill,
    House,
    HouseFill,
    Person,
    PersonFill,
    Search,
    SearchHeartFill,
} from "@/ui/icons";

const Tab = createBottomTabNavigator<HomeTabsParamList>();
export type HomeTabProps<K extends keyof HomeTabsParamList> = BottomTabScreenProps<
    HomeTabsParamList,
    K
>;
export type HomeTabsParamList = {
    Home: undefined;
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
            screenOptions={{
                tabBarActiveTintColor: colors.primary.hex,
                tabBarInactiveTintColor: colors.fg.hex,
                headerShown: false,
                animation: "fade"
            }}
        >
            <Tab.Screen
                name="Home"
                component={ScoutTab}
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, color, size }) =>
                        focused ? (
                            <HouseFill size={size} fill={color} />
                        ) : (
                            <House size={size} fill={color} />
                        ),
                }}
            />
            <Tab.Screen
                name="Browse"
                component={BrowseTab}
                options={{
                    title: "Browse",
                    tabBarIcon: ({ focused, color, size }) =>
                        focused ? (
                            <SearchHeartFill size={size} fill={color} />
                        ) : (
                            <Search size={size} fill={color} />
                        ),
                }}
            />
            <Tab.Screen
                name="Data"
                component={DataTab}
                options={{
                    title: "Data",
                    tabBarIcon: ({ focused, color, size }) =>
                        focused ? (
                            <BarChartFill size={size} fill={color} />
                        ) : (
                            <BarChart size={size} fill={color} />
                        ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsTab}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused, color, size }) =>
                        focused ? (
                            <PersonFill size={size} fill={color} />
                        ) : (
                            <Person size={size} fill={color} />
                        ),
                }}
            />
        </Tab.Navigator>
    );
}
