import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ScoutingFlow from '../scouting-flow/ScoutingFlow';
import HomeMain from './HomeMain';
import NoteScreen from './Note';
import Svg, {Path} from 'react-native-svg';
import PitScoutingFlow from '../pit-scouting-flow/PitScoutingFlow';

const HomeStack = createStackNavigator();

function Home() {
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const {colors} = useTheme();

  useEffect(() => {
    let interval: NodeJS.Timeout = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsTimerActive(false);
  };

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home Main"
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
                marginRight: '5%',
              }}>
              {seconds > 0 && (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginRight: '5%',
                  }}>
                  {seconds}
                </Text>
              )}
              <Pressable
                onLongPress={() => {
                  resetTimer();
                }}
                onPress={() => {
                  toggleTimer();
                }}
                style={{
                  marginRight: '10%',
                }}>
                <Svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16">
                  <Path
                    fill={isTimerActive ? colors.primary : 'gray'}
                    d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"
                  />
                  <Path
                    fill={isTimerActive ? colors.primary : 'gray'}
                    d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"
                  />
                </Svg>
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

export default Home;
