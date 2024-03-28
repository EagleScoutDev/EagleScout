import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ScoutingFlow from '../scouting-flow/ScoutingFlow';
import HomeMain from './HomeMain';
import NoteScreen from './Note';
import Svg, {Path} from 'react-native-svg';
import FormHelper from '../../FormHelper';

const HomeStack = createStackNavigator();

function Home() {
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [scoutingStyle, setScoutingStyle] = useState('Paginated');
  const {colors} = useTheme();

  useEffect(() => {
    let interval: NodeJS.Timeout = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && seconds !== 0) {
      clearInterval(isTimerActive);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(r => {
      if (r != null) {
        setScoutingStyle(r);
      }
    });
  }, []);

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsTimerActive(false);
  };

  const ScoutingFlowWrapper = useMemo(
    () =>
      ({navigation, route}: any) => {
        return (
          <ScoutingFlow
            navigation={navigation}
            route={route}
            resetTimer={resetTimer}
            isModalActive={isModalActive}
            setIsModalActive={setIsModalActive}
          />
        );
      },
    [],
  );

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
              {scoutingStyle === 'Paginated' && (
                <Pressable
                  onPress={() => {
                    setIsModalActive(!isModalActive);
                    console.log('Modal Active: ' + isModalActive);
                  }}>
                  <Svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16">
                    <Path
                      fill={isModalActive ? colors.primary : 'gray'}
                      d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z"
                    />
                    <Path
                      fill={isModalActive ? colors.primary : 'gray'}
                      d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27"
                    />
                  </Svg>
                </Pressable>
              )}
            </View>
          ),
        }}
        component={ScoutingFlowWrapper}
      />
      <HomeStack.Screen
        name={'Note'}
        options={{
          headerBackTitle: 'Home',
        }}
        component={NoteScreen}
      />
    </HomeStack.Navigator>
  );
}

export default Home;
