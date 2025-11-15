import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { type BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { type NavigatorScreenParams, useTheme } from "@react-navigation/native";
import { View } from "react-native";
import { ScoutFlow, type ScoutMenuParamList } from "./screens/scouting/ScoutingFlow";
import { SearchMenu, type SearchMenuParamList } from "./screens/search/SearchMenu";
import type { RootStackScreenProps } from "./App";
import * as Bs from "./ui/icons";
import { SettingsMenu, type SettingsMenuParamList } from "./screens/settings/SettingsMenu";
import { useEffect, useRef } from "react";
import { useUserStore } from "./lib/stores/user";
import { DataMain, type DataMenuParamList } from "./screens/data/DataMain";
import { UISheetModal } from "./ui/UISheetModal";
import { PlusMenu } from "./PlusMenu";

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
export const AppHome = ({ navigation }: AppHomeProps) => {
    const { colors } = useTheme();
    const account = useUserStore.use.account();

    const plusMenuRef = useRef<UISheetModal>(null);

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
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                    },
                    animation: "shift",
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={ScoutFlow}
                    options={{
                        tabBarIcon: ({ color, size, focused }) =>
                            focused ? (
                                <Bs.HouseFill color={color} size={size} />
                            ) : (
                                <Bs.House color={color} size={size} />
                            ),
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
                            plusMenuRef.current?.present();
                        },
                    }}
                    options={{
                        tabBarLabel: "",
                        tabBarIcon: () => (
                            <Bs.PlusCircleFill size={"220%"} style={{ bottom: "20%" }} fill={colors.primary} />
                        ),
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

            <PlusMenu ref={plusMenuRef} navigation={navigation} />
        </>
    );
};
