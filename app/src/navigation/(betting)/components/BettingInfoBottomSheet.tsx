import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WaitForPlayersStep } from "./WaitForPlayersStep.tsx";
import { SelectAllianceStep } from "./SelectAllianceStep.tsx";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useTheme } from "@/ui/context/ThemeContext.ts";
import { ThemedNavigationContainer } from "@/ui/ThemedNavigationContainer.tsx";

const Stack = createNativeStackNavigator();

export function BettingInfoBottomSheet() {
    const { colors } = useTheme();

    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                enableDynamicSizing={false}
                snapPoints={["55%"]}
                enablePanDownToClose={true}
                animateOnMount={true}
                handleIndicatorStyle={{
                    backgroundColor: colors.fg.hex,
                }}
                backgroundStyle={{
                    backgroundColor: colors.bg1.hex,
                }}
            >
                <NavigationIndependentTree>
                    <ThemedNavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="WaitForPlayers" component={WaitForPlayersStep} />
                            <Stack.Screen name="SelectAlliance" component={SelectAllianceStep} />
                        </Stack.Navigator>
                    </ThemedNavigationContainer>
                </NavigationIndependentTree>
            </BottomSheet>
        </>
    );
}
