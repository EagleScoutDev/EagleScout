import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {
    createBottomTabNavigator,
    type BottomTabBarProps,
    BottomTabBar,
    type BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { type NavigatorScreenParams, useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { ScoutFlow, type ScoutMenuParamList } from "./screens/scouting/ScoutingFlow";
import { MatchBettingNavigator } from "./screens/scoutcoin/betting/MatchBettingNavigator";
import { SearchMenu, type SearchMenuParamList } from "./screens/search/SearchMenu";
import type { RootStackScreenProps } from "./App";
import * as Bs from "./ui/icons";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings/SettingsMenu";
import { useEffect } from "react";
import { useAccount } from "./lib/hooks/useAccount";
import { DataMain, type DataMenuParamList } from "./screens/data/DataMain";

const Tab = createBottomTabNavigator<AppHomeParamList>();
export type AppHomeScreenProps<K extends keyof AppHomeParamList> = BottomTabScreenProps<AppHomeParamList, K>;
export type AppHomeParamList = {
    Home: NavigatorScreenParams<ScoutMenuParamList>;
    Search: NavigatorScreenParams<SearchMenuParamList>;
    PlusMenuLauncher: undefined;
    Data: NavigatorScreenParams<DataMenuParamList>;
    Settings: NavigatorScreenParams<SettingsMenuParamList>;
};

export interface AppHomeProps extends RootStackScreenProps<"App"> {}
export const AppHome = ({ route, navigation }: AppHomeProps) => {
    const { colors } = useTheme();
    const { account } = useAccount();

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
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={ScoutFlow}
                options={{
                    tabBarIcon: ({ color, size, focused }) =>
                        focused ? <Bs.HouseFill color={color} size={size} /> : <Bs.House color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchMenu}
                options={{
                    tabBarIcon: ({ color, size }) => <Bs.Search size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name={"PlusMenuLauncher"}
                children={() => <View />}
                listeners={{
                    tabPress: (event) => {
                        event.preventDefault();
                        ReactNativeHapticFeedback.trigger("impactLight", {
                            enableVibrateFallback: true,
                            ignoreAndroidSystemSettings: false,
                        });
                        navigation.push("PlusMenu");
                    },
                }}
                options={{
                    tabBarLabel: "",
                    tabBarIcon: () => <Bs.PlusCircleFill size={"220%"} style={{ bottom: "20%" }} fill={colors.primary} />,
                }}
            />
            <Tab.Screen
                name="Data"
                component={DataMain}
                options={{
                    tabBarIcon: ({ color, size, focused }) =>
                        focused ? (
                            <Bs.BarChartLineFill size={size} color={color} />
                        ) : (
                            <Bs.BarChartLine size={size} color={color} />
                        ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsMenu}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ size, color }) => <Bs.PersonCircle size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};
