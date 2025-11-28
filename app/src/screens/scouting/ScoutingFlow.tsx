import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ScoutFlowHome } from "./Dashboard";
import { NoteScreen } from "./note/NoteFlow";
import * as Bs from "../../ui/icons";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { PitScoutingFlow } from "./pit/PitScoutingFlow";
import { MatchScoutingFlow } from "./match/MatchScoutingFlow";
import { ScoutTimer, ScoutTimerContext } from "./components/Timer";

const HomeStack = createNativeStackNavigator<ScoutMenuParamList>();
export type ScoutMenuScreenProps<T extends keyof ScoutMenuParamList> = NativeStackScreenProps<ScoutMenuParamList, T>;
export type ScoutMenuParamList = {
    Dashboard: undefined;
    Match: undefined;
    Note: undefined;
    Pit: undefined;
};

export function ScoutFlow() {
    return (
        <ScoutTimerContext.Provider value={ScoutTimer()}>
            <HomeStack.Navigator initialRouteName="Dashboard">
                <HomeStack.Screen
                    name="Dashboard"
                    component={ScoutFlowHome}
                    options={{
                        title: "Home",
                        headerShown: false,
                    }}
                />

                <HomeStack.Group
                    screenOptions={{
                        headerTransparent: true,
                        headerBackButtonDisplayMode: "minimal",
                    }}
                >
                    <HomeStack.Screen
                        name="Match"
                        options={{
                            title: "Scout Report",
                            headerRight: TimerHeader,
                        }}
                        component={MatchScoutingFlow}
                    />
                    <HomeStack.Screen
                        name="Note"
                        options={{
                            title: "Note",
                        }}
                        component={NoteScreen}
                    />
                    <HomeStack.Screen
                        name="Pit"
                        options={{
                            title: "Pit Scout",
                        }}
                        component={PitScoutingFlow}
                    />
                </HomeStack.Group>
            </HomeStack.Navigator>
        </ScoutTimerContext.Provider>
    );
}

function TimerHeader() {
    const { colors } = useTheme();
    const timer = useContext(ScoutTimerContext);
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "bold",
                    marginRight: 5,
                }}
            >
                {timer.seconds}
            </Text>
            <Pressable onLongPress={timer.resetTimer} onPress={timer.toggleTimer}>
                <Bs.Stopwatch size="24" fill={timer.active ? colors.primary : "gray"} />
            </Pressable>
        </View>
    );
}
