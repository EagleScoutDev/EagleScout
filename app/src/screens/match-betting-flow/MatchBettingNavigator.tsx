import { MatchBetting } from "./MatchBetting";
import { BettingScreen, type BettingScreenParams } from "./BettingScreen";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<MatchBettingParamList>();
export type MatchBettingScreenProps<K extends keyof MatchBettingParamList> = NativeStackScreenProps<
    MatchBettingParamList,
    K
>;
export type MatchBettingParamList = {
    MatchBetting: undefined;
    BettingScreen: BettingScreenParams;
};

export const MatchBettingNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MatchBetting" component={MatchBetting} options={{ headerShown: false }} />
            <Stack.Screen name="BettingScreen" component={BettingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};
