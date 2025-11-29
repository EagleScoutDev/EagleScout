import "react-native-gesture-handler";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useDeepLinking } from "./lib/hooks/useDeepLinking";
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
import { ModalSafeAreaProvider } from "./ui/ModalSafeAreaProvider";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { Appearance } from "react-native";
import { useLocalStore } from "./lib/stores/local.ts";
import { Theme } from "./theme";
import { ThemedNavigationContainer } from "./ui/ThemedNavigationContainer.tsx";

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
    "use memo";

    const deepLink = useDeepLinking();
    useEffect(() => void handleDeepLink(deepLink), [deepLink]);

    const themePreference = useLocalStore.use.theme();
    const setThemePreference = useLocalStore.use.setTheme();
    const theme = Theme.get(themePreference);
    useEffect(() => Appearance.setColorScheme(theme.dark ? "dark" : "light"), [theme.dark]);

    return (
        <ErrorBoundary>
            <ThemeContext.Provider
                value={{
                    themePreference,
                    setThemePreference,
                    theme,
                }}
            >
                <GestureHandlerRootView>
                    <SafeAreaProvider>
                        <KeyboardProvider>
                            <ThemedNavigationContainer>
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
                            </ThemedNavigationContainer>
                        </KeyboardProvider>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </ThemeContext.Provider>
        </ErrorBoundary>
    );
}

export default withStallion(App);
