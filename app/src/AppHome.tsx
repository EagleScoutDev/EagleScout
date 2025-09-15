import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { createBottomTabNavigator, type BottomTabBarProps, BottomTabBar, type BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { type NavigatorScreenParams, useTheme } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { saveAccount } from "./lib/account";
import { AccountContext } from "./lib/contexts/AccountContext";
import DataMain from "./screens/data/DataMain";
import Home, { type HomeParamList } from "./screens/scouting/ScoutFlow";
import { MatchBettingNavigator } from "./screens/match-betting-flow/MatchBettingNavigator";
import SearchScreen from "./screens/search/SearchScreen";
import type { RootStackScreenProps } from "./App";
import { BarChartLine, BarChartLineFill, House, HouseFill, PersonCircle, PlusCircleFill, Search } from "./components/icons/icons.generated";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings-menu/SettingsMenu";

const Tab = createBottomTabNavigator<AppHomeParamList>();
export type AppHomeScreenProps<K extends keyof AppHomeParamList> = BottomTabScreenProps<AppHomeParamList, K>
export type AppHomeParamList = {
    Home: NavigatorScreenParams<HomeParamList>
    Search: undefined
    PlusMenuLauncher: undefined
    Data: undefined
    Settings: NavigatorScreenParams<SettingsMenuParamList>
    MatchBetting: undefined
}

export interface AppHomeProps extends RootStackScreenProps<"App"> {

}
export const AppHome = ({ route, navigation }: AppHomeProps) => {
    const { colors } = useTheme();
    const { account, setAccount } = useContext(AccountContext);

    useEffect(() => {
        if (account === null) {
            saveAccount(null)
            navigation.reset({
                index: 0,
                routes: [
                    { name: "Onboarding", params: { state: undefined } }
                ]
            })
        }
    }, [account])

    return <Tab.Navigator
        tabBar={FilteringBottomTabBar(["Home", "Search", "PlusMenuLauncher", "Data", "Settings"])}
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: colors.background,
            },
        }}>
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon: ({ color, size, focused }) =>
                    focused ? <HouseFill color={color} size={size} />
                        : <House color={color} size={size} />
            }}
        />
        <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
                tabBarIcon: ({ color, size }) =>
                    <Search size={size} color={color} />
            }}
        />
        <Tab.Screen
            name={"PlusMenuLauncher"}
            children={() => <View />}
            listeners={{
                tabPress: event => {
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
                tabBarIcon: () =>
                    <PlusCircleFill size={"220%"} style={{ bottom: "20%" }} fill={colors.primary} />
            }}
        />
        <Tab.Screen
            name="Data"
            component={DataMain}
            options={{
                tabBarIcon: ({ color, size, focused }) =>
                    focused ? <BarChartLineFill size={size} color={color} />
                        : <BarChartLine size={size} color={color} />
            }}
        />
        <Tab.Screen
            name="Settings"
            component={SettingsMenu}
            options={{
                title: "Profile",
                tabBarIcon: ({ size, color }) =>
                    <PersonCircle size={size} color={color} />
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
};

function FilteringBottomTabBar(routes: string[]): (props: BottomTabBarProps) => React.ReactNode {
    return (props) => <BottomTabBar {...props} state={{
        ...props.state, routes: props.state.routes.filter(x => routes.includes(x.name))
    }} />
}
