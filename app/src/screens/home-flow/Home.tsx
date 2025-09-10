import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ScoutingFlow from '../scouting-flow/ScoutingFlow';
import HomeMain from './Dashboard';
import NoteScreen from './Note';
import PitScoutingFlow from '../pit-scouting-flow/PitScoutingFlow';
import { Stopwatch } from '../../components/icons/icons.generated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type HomeParamList = {
    Dashboard: undefined;
    "Scout Report": undefined;
    "Note": undefined;
    "Pit Scout": undefined;
}

const HomeStack = createNativeStackNavigator();

export default function Home() {
    const [seconds, setSeconds] = useState(0)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const toggleTimer = () => {setIsTimerActive(!isTimerActive)}
    const resetTimer = () => {setSeconds(0), setIsTimerActive(false)}

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if(isTimerActive) {
            interval = setInterval(() => setSeconds(seconds => seconds + 1), 1000)
        }
        else if(interval !== null && seconds !== 0) {
            clearInterval(interval)
        }
        return () => { interval && clearInterval(interval) };
    }, [isTimerActive, seconds]);


    const { colors } = useTheme();
    return (
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
                name={'Scout Report'}
                options={{
                    headerBackTitle: 'Home',
                    headerRight: () => (
                        <View
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
                                {seconds}s
                            </Text>
                            <Pressable
                                onLongPress={resetTimer}
                                onPress={toggleTimer}
                            >
                                <Stopwatch size="24" fill={isTimerActive ? colors.primary : 'gray'} />
                            </Pressable>
                        </View>
                    ),
                }}>
                {() => <ScoutingFlow resetTimer={resetTimer} />}
            </HomeStack.Screen>
            <HomeStack.Screen
                name={'Note'}
                options={{
                    headerBackTitle: 'Home',
                }}
                component={NoteScreen}
            />
            <HomeStack.Screen
                name={'Pit Scout'}
                options={{
                    headerBackTitle: 'Home',
                }}
                component={PitScoutingFlow}
            />
        </HomeStack.Navigator>
    );
}
