import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { FormHelper } from "./FormHelper";
import { PlusMenu } from "./PlusMenu";
import { useDeepLinking } from "./lib/hooks/useDeepLinking";
import { ThemeOptions, ThemeOptionsMap } from "./themes";
import { ThemeContext } from "./lib/contexts/ThemeContext";
import { handleDeepLink } from "./deepLink";
import { AccountContext } from "./lib/contexts/AccountContext";
import { Account, recallAccount } from "./lib/account";
import { AppHome, type AppHomeParamList } from "./AppHome";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import { OnboardingFlow, type OnboardingParamList } from "./screens/onboarding";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    App: NavigatorScreenParams<AppHomeParamList>,
    PlusMenu: undefined,
    Onboarding: NavigatorScreenParams<OnboardingParamList>,
};

export function RootNavigator()  {
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
            console.log("local account:", r)
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

                <NavigationContainer theme={ThemeOptionsMap.get(themePreference)!}>
                    <RootStack.Navigator
                        initialRouteName="Onboarding"
                        screenOptions={{
                            headerShown: false
                        }}>
                        <RootStack.Group>
                            <RootStack.Screen name="App" component={AppHome} options={{
                                animationTypeForReplace: "pop"
                            }} />

                            <RootStack.Screen name="PlusMenu" component={PlusMenu} options={{
                                presentation: "transparentModal"
                            }} />
                        </RootStack.Group>

                        <RootStack.Screen name="Onboarding" component={OnboardingFlow} />
                    </RootStack.Navigator>
                    <Toast />
                </NavigationContainer>

            </AccountContext.Provider>
        </ThemeContext.Provider>
    );
};


