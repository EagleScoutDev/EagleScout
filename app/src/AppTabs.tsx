import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { createBottomTabNavigator, BottomTabBarProps, BottomTabBar, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams, useTheme } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { saveAccount } from "./lib/account";
import { AccountContext } from "./lib/contexts/AccountContext";
import DataMain from "./screens/data-flow/DataMain";
import Home, { HomeParamList } from "./screens/home-flow/Home";
import { MatchBettingNavigator } from "./screens/match-betting-flow/MatchBettingNavigator";
import SearchScreen from "./screens/search-flow/SearchScreen";
import SettingsMain from "./screens/settings-flow/SettingsMain";
import { RootStackScreenProps } from "./App";
import { BarChartLine, BarChartLineFill, House, HouseFill, PersonCircle, PlusCircleFill, Search } from "./components/icons/icons.generated";

const Tab = createBottomTabNavigator<AppTabsParamList>();
export type AppTabsScreenProps<K extends keyof AppTabsParamList> = BottomTabScreenProps<AppTabsParamList, K>
export type AppTabsParamList = {
    Home: NavigatorScreenParams<HomeParamList>
    Search: undefined
    PlusMenuLauncher: undefined
    Data: undefined
    Profile: undefined
    MatchBetting: undefined
}

export interface AppMainProps extends RootStackScreenProps<"App"> {

}
export const AppTabs = ({ route, navigation }: AppMainProps) => {
    const { colors } = useTheme();
    const { account, setAccount } = useContext(AccountContext);

    const redirectLogin = () => {
        saveAccount(null)
        setAccount(null)
    }

    return <Tab.Navigator
        tabBar={FilteringBottomTabBar(["Home", "Search", "PlusMenuLauncher", "Data", "Profile"])}
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
            name="Profile"
            options={{
                tabBarIcon: ({ size, color }) =>
                    <PersonCircle size={size} color={color} />
            }}
            children={() => (
                <SettingsMain onSignOut={redirectLogin}/>
            )}
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
