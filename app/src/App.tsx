import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { FormHelper } from "./FormHelper";
import { PlusMenu } from "./PlusMenu";
import { useDeepLinking } from "./lib/hooks/useDeepLinking";
import { ThemeOptions, ThemeOptionsMap } from "./themes";
import { ThemeContext } from "./lib/contexts/ThemeContext";
import { handleDeepLink } from "./deepLink";
import { AccountContext } from "./lib/contexts/AccountContext";
import { type Account, recallAccount, saveAccount } from "./lib/user/account";
import { AppHome, type AppHomeParamList } from "./AppHome";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import { OnboardingFlow, type OnboardingParamList } from "./screens/onboarding";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStackScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;
export type RootStackParamList = {
    App: NavigatorScreenParams<AppHomeParamList>;
    PlusMenu: undefined;
    Onboarding: NavigatorScreenParams<OnboardingParamList>;
};

export default function App() {
    const deepLink = useDeepLinking();

    const [account, setAccount] = useState<Account | null>(null);
    const [themePreference, setThemePreference] = useState(ThemeOptions.SYSTEM);

    useEffect(() => {
        recallAccount().then(setAccount);
    }, []);
    useEffect(() => {
        // saveAccount(account);
    }, [account]);

    useEffect(() => {
        FormHelper.readAsyncStorage(FormHelper.THEME).then((r) => {
            if (r != null) {
                console.log("theme found: " + r);
                setThemePreference(parseInt(r, 10));
            }
        });
    }, []);

    useEffect(() => {
        handleDeepLink(deepLink);
    }, [deepLink]);

    return (
        <ThemeContext.Provider
            value={{
                themePreference,
                setThemePreference,
            }}
        >
            <AccountContext.Provider
                value={{
                    account,
                    setAccount,
                }}
            >
                <GestureHandlerRootView>
                    <NavigationContainer theme={ThemeOptionsMap.get(themePreference)!}>
                        <RootStack.Navigator
                            initialRouteName="Onboarding"
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            <RootStack.Group>
                                <RootStack.Screen
                                    name="App"
                                    component={AppHome}
                                    options={{
                                        animationTypeForReplace: "pop",
                                    }}
                                />

                                <RootStack.Screen
                                    name="PlusMenu"
                                    component={PlusMenu}
                                    options={{
                                        presentation: "transparentModal",
                                    }}
                                />
                            </RootStack.Group>

                            <RootStack.Screen name="Onboarding" component={OnboardingFlow} />
                        </RootStack.Navigator>
                        <Toast />
                    </NavigationContainer>
                </GestureHandlerRootView>
            </AccountContext.Provider>
        </ThemeContext.Provider>
    );
}
