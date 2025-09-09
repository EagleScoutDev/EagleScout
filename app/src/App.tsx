import * as React from "react";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import FormHelper from "./FormHelper";
import PlusNavigationModal from "./PlusNavigationModal";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { useDeepLinking } from "./lib/hooks/useDeepLinking";
import { ThemeOptions } from "./themes";
import { ThemeContext } from "./lib/contexts/ThemeContext";
import { ThemedNavigationContainer } from "./components/ThemedNavigationContainer";
import { handleDeepLink } from "./deepLink";
import { AccountContext } from "./lib/contexts/AccountContext";
import { Account } from "./lib/account";
import { AppTabs, AppTabsParamList } from "./AppTabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

const RootStack = createStackNavigator<RootStackParamList, "RootStack">();
export type RootStackScreenProps<K extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, K, "RootStack">;
export type RootStackParamList = {
    App: NavigatorScreenParams<AppTabsParamList>,
    PlusMenu: undefined
};

const RootNavigator = () => {
    const deepLink = useDeepLinking();

    const [themePreference, setThemePreference] = useState(ThemeOptions.SYSTEM);
    const [onboardingActive, setOnboardingActive] = useState(false);
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        FormHelper.readAsyncStorage(FormHelper.THEME).then(r => {
            if (r != null) {
                console.log("theme found: " + r);
                setThemePreference(parseInt(r, 10));
            }
        });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem("authenticated").then(r => {
            setOnboardingActive(!r)
        })
    }, []);

    useEffect(() => {
        handleDeepLink(deepLink);
    }, [deepLink])

    return (
        <ThemeContext.Provider
            value={{
                themePreference, setThemePreference,
                onboardingActive, setOnboardingActive,
            }}>
            <AccountContext.Provider
                value={{
                    account, setAccount
                }}>

                <ThemedNavigationContainer>
                    <RootStack.Navigator
                        id="RootStack"
                        initialRouteName="App"
                        screenOptions={{
                            headerShown: false,
                            presentation: "transparentModal",
                        }}>
                        <RootStack.Screen name="App" component={AppTabs} />
                        <RootStack.Screen name="PlusMenu" component={PlusNavigationModal} />
                    </RootStack.Navigator>
                    <Toast />
                </ThemedNavigationContainer>

            </AccountContext.Provider>
        </ThemeContext.Provider>
    );
};

export default RootNavigator;
