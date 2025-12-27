import * as React from "react";
import { useEffect } from "react";
import { useLocalStore } from "@/lib/stores/local";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { HeaderButtonsProvider } from "react-navigation-header-buttons/HeaderButtonsProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { Theme, ThemeOption } from "@/ui/lib/theme";
import { ModalSafeAreaProvider } from "@/ui/context/ModalSafeArea";
import { ThemedNavigationContainer } from "@/ui/ThemedNavigationContainer";
import { ThemeContext } from "@/ui/context/ThemeContext";
import { Appearance } from "react-native";
import { withStallion } from "react-native-stallion";
import { RootNavigator } from "@/navigation";

function App() {
    const themePreference = useLocalStore((state) => state.theme) ?? ThemeOption.system;
    const setThemePreference = useLocalStore((state) => state.setTheme);
    const theme = Theme.get(themePreference);

    useEffect(() => {
        Appearance.setColorScheme(theme.dark ? "dark" : "light");
    }, [theme]);

    return (
        // <ErrorBoundary>
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
                                            <RootNavigator />
                                        </BottomSheetModalProvider>
                                    </ModalSafeAreaProvider>
                                </HeaderButtonsProvider>
                                <Toast />
                            </ThemedNavigationContainer>
                        </KeyboardProvider>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </ThemeContext.Provider>
        // </ErrorBoundary>
    );
}

export default withStallion(App);
