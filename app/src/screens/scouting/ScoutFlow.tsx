import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import HomeMain from './Dashboard';
import NoteScreen from './note/NoteFlow';
import { Stopwatch } from '../../components/icons/icons.generated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PitScoutingFlow } from './pit/PitScoutingFlow';
import { MatchScoutingFlow } from './match/MatchScoutingFlow';
import { ScoutTimer, ScoutTimerContext } from './Timer';

export type HomeParamList = {
    Dashboard: undefined;
    "Scout Report": undefined;
    "Note": undefined;
    "Pit Scout": undefined;
}

const HomeStack = createNativeStackNavigator();

export default function Home() {
    return <ScoutTimerContext.Provider value={ScoutTimer()}>
        <HomeStack.Navigator
            initialRouteName='Dashboard'>
            <HomeStack.Screen
                name="Dashboard"
                component={HomeMain}
                options={{
                    headerShown: false,
                }}
            />

            <HomeStack.Screen
                name="Scout Report"
                options={{
                    headerBackTitle: 'Home',
                    headerRight: TimerHeader(),
                }}
                component={MatchScoutingFlow}
            />
            <HomeStack.Screen
                name="Note"
                options={{
                    headerBackTitle: 'Home',
                }}
                component={NoteScreen}
            />
            <HomeStack.Screen
                name="Pit Scout"
                options={{
                    headerBackTitle: 'Home',
                }}
                component={PitScoutingFlow}
            />
        </HomeStack.Navigator>
    </ScoutTimerContext.Provider>
}

const TimerHeader = () => () => {
    const { colors } = useTheme();
    const timer = useContext(ScoutTimerContext);
    return <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}>
        <Text
            style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: 'bold',
                marginRight: 5,
            }}>
            {timer.seconds}
        </Text>
        <Pressable
            onLongPress={timer.resetTimer}
            onPress={timer.toggleTimer}
        >
            <Stopwatch size="24" fill={timer.active ? colors.primary : 'gray'} />
        </Pressable>
    </View>
}
