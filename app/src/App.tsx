import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { FormHelper } from "./FormHelper";
import { useDeepLinking } from "./lib/hooks/useDeepLinking";
import { ThemeOptions, ThemeOptionsMap } from "./themes";
import { ThemeContext } from "./lib/contexts/ThemeContext";
import { handleDeepLink } from "./deepLink";
import { AppHome, type AppHomeParamList } from "./AppHome";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import { OnboardingFlow, type OnboardingParamList } from "./screens/onboarding";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeaderButtonsProvider } from "react-navigation-header-buttons/HeaderButtonsProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { withStallion } from "react-native-stallion";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ModalSafeAreaProvider } from "./ui/ModalSafeAreaProvider.tsx";

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

function App() {
    const deepLink = useDeepLinking();

    const [themePreference, setThemePreference] = useState(ThemeOptions.SYSTEM);

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
            <GestureHandlerRootView>
                <SafeAreaProvider>
                    <KeyboardProvider>
                        <NavigationContainer theme={ThemeOptionsMap.get(themePreference)!}>
                            <HeaderButtonsProvider stackType={"native"}>
                                <ModalSafeAreaProvider>
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
                                </ModalSafeAreaProvider>
                            </HeaderButtonsProvider>
                            <Toast />
                        </NavigationContainer>
                    </KeyboardProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </ThemeContext.Provider>
    );
}

export default withStallion(App);
