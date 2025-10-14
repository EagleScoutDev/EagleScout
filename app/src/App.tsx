import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { FormHelper } from "./FormHelper";
import { PlusMenu } from "./PlusMenu";
import { useDeepLinking } from "./lib/react/hooks/useDeepLinking";
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
import { HeaderButtonsProvider } from "react-navigation-header-buttons/HeaderButtonsProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

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
                    <SafeAreaProvider>
                        <NavigationContainer theme={ThemeOptionsMap.get(themePreference)!}>
                            <HeaderButtonsProvider stackType={"native"}>
                                <BottomSheetModalProvider>
                                    <RootStack.Navigator
                                        initialRouteName="Onboarding"
                                        screenOptions={{
                                            headerShown: false,
                                        }}
                                    >
                                        <RootStack.Screen name="App" component={AppHome} />

                                        <RootStack.Screen
                                            name="Onboarding"
                                            component={OnboardingFlow}
                                            options={{
                                                animation: "ios_from_right",
                                            }}
                                        />
                                    </RootStack.Navigator>
                                </BottomSheetModalProvider>
                            </HeaderButtonsProvider>
                            <Toast />
                        </NavigationContainer>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </AccountContext.Provider>
        </ThemeContext.Provider>
    );
}
