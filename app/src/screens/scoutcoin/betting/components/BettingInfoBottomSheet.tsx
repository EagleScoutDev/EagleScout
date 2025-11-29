import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { ThemedNavigationContainer } from "../../../../ui/ThemedNavigationContainer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WaitForPlayersStep } from "./WaitForPlayersStep";
import { SelectAllianceStep } from "./SelectAllianceStep";
import { useTheme } from "../../../../lib/contexts/ThemeContext.ts";
import { NavigationIndependentTree } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export function BettingInfoBottomSheet() {
    "use memo";
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
