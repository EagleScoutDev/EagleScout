import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {
    createBottomTabNavigator,
    type BottomTabBarProps,
    BottomTabBar,
    type BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { type NavigatorScreenParams, useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { ScoutFlow, type ScoutMenuParamList } from "./screens/scouting/ScoutingFlow.tsx";
import { MatchBettingNavigator } from "./screens/match-betting-flow/MatchBettingNavigator";
import { SearchScreen, type SearchScreenParamList } from "./screens/search/SearchScreen";
import type { RootStackScreenProps } from "./App";
import * as Bs from "./components/icons/icons.generated";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings/SettingsMenu.tsx";
import { useEffect } from "react";
import { useAccount } from "./lib/hooks/useAccount.ts";
import { DataMain } from "./screens/data/DataMain.tsx";

const Tab = createBottomTabNavigator<AppHomeParamList>();
export type AppHomeScreenProps<K extends keyof AppHomeParamList> = BottomTabScreenProps<AppHomeParamList, K>;
export type AppHomeParamList = {
    Home: NavigatorScreenParams<ScoutMenuParamList>;
    Search: NavigatorScreenParams<SearchScreenParamList>;
    PlusMenuLauncher: undefined;
    Data: undefined;
    Settings: NavigatorScreenParams<SettingsMenuParamList>;
    MatchBetting: undefined;
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
            tabBar={FilteringBottomTabBar(["Home", "Search", "PlusMenuLauncher", "Data", "Settings"])}
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
                component={SearchScreen}
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
            <Tab.Screen
                name="MatchBetting"
                options={{
                    tabBarButton: () => null,
                }}
                component={MatchBettingNavigator}
            />
        </Tab.Navigator>
    );
};

function FilteringBottomTabBar(routes: string[]): (props: BottomTabBarProps) => React.ReactNode {
    return (props) => (
        <BottomTabBar
            {...props}
            state={{
                ...props.state,
                routes: props.state.routes.filter((x) => routes.includes(x.name)),
            }}
        />
    );
}
