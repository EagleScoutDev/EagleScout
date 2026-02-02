import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import { ScoutTabMain } from "./ScoutTabMain";
import { NoteScreen } from "@/navigation/tabs/scout/(note)/NoteFlow";
import { PitScoutingFlow } from "@/navigation/tabs/scout/(pit)/PitScoutingFlow";
import { MatchScoutingFlow } from "@/navigation/tabs/scout/(match)/MatchScoutingFlow";

const Stack = createNativeStackNavigator<ScoutMenuParamList>();
export type ScoutMenuScreenProps<T extends keyof ScoutMenuParamList> = NativeStackScreenProps<
    ScoutMenuParamList,
    T
>;
export type ScoutMenuParamList = {
    Main: undefined;
    Match: undefined;
    Note: undefined;
    Pit: undefined;
};

export function ScoutTab() {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={useStackThemeConfig()}>
            <Stack.Screen
                name="Main"
                component={ScoutTabMain}
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Match"
                options={{
                    title: "Match Scouting",
                }}
                component={MatchScoutingFlow}
            />
            <Stack.Screen
                name="Note"
                options={{
                    title: "Note",
                }}
                component={NoteScreen}
            />
            <Stack.Screen
                name="Pit"
                options={{
                    title: "Pit Scouting",
                }}
                component={PitScoutingFlow}
            />
        </Stack.Navigator>
    );
}
