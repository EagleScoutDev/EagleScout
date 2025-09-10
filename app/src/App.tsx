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
import { Account, recallAccount } from "./lib/account";
import { AppTabs, AppTabsParamList } from "./AppTabs";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { OnboardingFlow, OnboardingParamList } from "./screens/onboarding-flow";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

const RootStack = createStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    App: NavigatorScreenParams<AppTabsParamList>,
    PlusMenu: undefined,
    Onboarding: NavigatorScreenParams<OnboardingParamList>,
};

const RootNavigator = () => {
    const deepLink = useDeepLinking();

    const [themePreference, setThemePreference] = useState(ThemeOptions.SYSTEM);
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
        handleDeepLink(deepLink);
    }, [deepLink])


    useEffect(() => {
        recallAccount().then(r => {
            console.log("account loaded:", r)
            setAccount(r)
        })
    }, [])

    return (
        <ThemeContext.Provider
            value={{
                themePreference, setThemePreference,
            }}>
            <AccountContext.Provider
                value={{
                    account, setAccount
                }}>

                <ThemedNavigationContainer>
                    <RootStack.Navigator
                        screenOptions={{
                            headerShown: false,
                            presentation: "transparentModal",
                        }}>{
                        account !== null
                            ? <RootStack.Group>
                                <RootStack.Screen name="App" component={AppTabs} />
                                <RootStack.Screen name="PlusMenu" component={PlusNavigationModal} />
                            </RootStack.Group>

                            :<RootStack.Screen name="Onboarding" component={OnboardingFlow} />
                        }
                    </RootStack.Navigator>
                    <Toast />
                </ThemedNavigationContainer>

            </AccountContext.Provider>
        </ThemeContext.Provider>
    );
};

export default RootNavigator;
