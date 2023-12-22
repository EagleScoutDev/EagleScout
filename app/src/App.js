import * as React from 'react';
import Login from './screens/login-flow/Login';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import CompetitionsView from './screens/competitions-flow/CompetitionsView';
import CompleteSignup from './screens/login-flow/CompleteSignup';
import {useEffect, useState} from 'react';
import SearchScreen from './screens/search-flow/SearchScreen';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpModal from './screens/login-flow/SignUpModal';
import CustomDrawerContent from './CustomDrawer';
import FormHelper from './FormHelper';
import UpcomingRoundsView from './screens/UpcomingRoundsView';
import {supabase} from './lib/supabase';
import codePush from 'react-native-code-push';
import Svg, {Path} from 'react-native-svg';
import Home from './screens/Home';
import ScoutingFlow from './screens/scouting-flow/ScoutingFlow';
import DataMain from './screens/data-flow/DataMain';
import SettingsMain from './screens/settings-flow/SettingsMain';

const Tab = createBottomTabNavigator();

const CustomLightTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    card: 'rgb(242, 242, 242)',
    background: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

const MyStack = () => {
  const scheme = useColorScheme();
  const [themePreference, setThemePreference] = useState('System');
  const [scoutStylePreference, setScoutStylePreference] = useState('Paginated');
  const {colors} = useTheme();

  const ScoutReportComponent = props => (
    <ScoutingFlow
      {...props}
      isScoutStylePreferenceScrolling={scoutStylePreference === 'Scrolling'}
    />
  );

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(value => {
      if (value != null) {
        setScoutStylePreference(value);
        console.log('scout style pref identified');
      } else {
        setScoutStylePreference('Paginated');
      }
    });
  }, []);

  const [admin, setAdmin] = useState('0');
  let [error, setError] = useState('');

  // checking if user has permission to edit competitions
  const checkAdmin = async () => {
    // use async storage
    const user = await AsyncStorage.getItem('user');
    if (user != null) {
      console.log('user: ' + user);
      const userObj = JSON.parse(user);
      if (userObj.admin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
  };

  const submitForm = async (username, password, navigation) => {
    console.log('[login] username: ' + username);
    console.log('[login] password: ' + password);
    const {error} = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      console.log('user: ' + user.id);
      const {data: userAttribData, error: userAttribError} = await supabase
        .from('user_attributes')
        .select('team_id, scouter, admin')
        .eq('id', user.id)
        .single();
      const {data: profilesData, error: profilesError} = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      if (userAttribError) {
        console.error(userAttribError);
        setError('Cannot access user attributes');
      } else if (profilesError) {
        console.error(profilesError);
        setError('Cannot acccess profiles');
      } else {
        if (!userAttribData.team_id) {
          setError('');
          navigation.navigate('CompleteSignUp');
        } else if (!userAttribData.scouter) {
          setError(
            'Your account has not been approved yet.\n Please contact a captain for approval.',
          );
        } else {
          setAdmin(userAttribData.admin);
          setError('');
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({
              ...userAttribData,
              ...profilesData,
            }),
          );
          await AsyncStorage.setItem('authenticated', 'true');
        }
      }
    }
  };

  const skipAuth = () => {
    console.log('skipping auth');
    checkAdmin().then(r => console.log('check admin response: ' + r));
  };

  const redirectLogin = () => {
    console.log('redirecting to login');
    setAdmin('0');
  };

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.THEME).then(value => {
      if (value != null) {
        console.log('[useEffect] data: ' + value);
        setThemePreference(value);
      }
    });
  }, []);

  return (
    <NavigationContainer
      theme={
        themePreference === 'Dark'
          ? DarkTheme
          : themePreference === 'Light'
          ? CustomLightTheme
          : scheme === 'dark'
          ? DarkTheme
          : CustomLightTheme
      }>
      <Tab.Navigator
        initialRouteName="Login"
        drawerContent={props => <CustomDrawerContent {...props} />}
        options={{
          headerShown: false,
        }}>
        {admin === '0' ? (
          <Tab.Group
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                display: 'none',
              },
            }}>
            <Tab.Screen
              name="Login"
              children={() => (
                <Login onSubmit={submitForm} error={error} ifAuth={skipAuth} />
              )}
            />
            <Tab.Screen name="Sign" component={SignUpModal} />
            <Tab.Screen name="CompleteSignUp" component={CompleteSignup} />
          </Tab.Group>
        ) : (
          <>
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({color, size, focused}) =>
                  focused ? (
                    <Svg width={size} height={size} viewBox="0 0 16 16">
                      <Path
                        fill={color}
                        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"
                      />
                      <Path
                        fill={color}
                        d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"
                      />
                    </Svg>
                  ) : (
                    <Svg width={size} height={size} viewBox="0 0 16 16">
                      <Path
                        fill={color}
                        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                      />
                    </Svg>
                  ),
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({color, size, focused}) => (
                  <Svg viewBox="0 0 16 16" width={size} height={size}>
                    <Path
                      fill={color}
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </Svg>
                ),
              }}
            />
            <Tab.Screen
              name="Data"
              component={DataMain}
              options={{
                headerShown: false,
                tabBarIcon: ({color, size, focused}) =>
                  focused ? (
                    <Svg width={size} height={size} viewBox="0 0 16 16">
                      <Path
                        fill={color}
                        d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"
                      />
                    </Svg>
                  ) : (
                    <Svg width={size} height={size} viewBox="0 0 16 16">
                      <Path
                        fill={color}
                        d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"
                      />
                    </Svg>
                  ),
              }}
            />
            <Tab.Screen
              name="Profile"
              options={{
                headerShown: false,
                tabBarIcon: ({size, color}) => (
                  <Svg width={size} height={size} viewBox="0 0 16 16">
                    <Path fill={color} d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <Path
                      fill={color}
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </Svg>

                  // <Svg width={size} height={size} viewBox="0 0 16 16">
                  //   <Path
                  //     fill={color}
                  //     d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
                  //   />
                  // </Svg>
                ),
              }}
              children={() => (
                <SettingsMain
                  onSignOut={redirectLogin}
                  setTheme={setThemePreference}
                  setScoutingStyle={setScoutStylePreference}
                />
              )}
            />
          </>
        )}
      </Tab.Navigator>
      <Toast />
      <Tab.Screen name={'Scout Report'} component={ScoutReportComponent} />
    </NavigationContainer>
  );
};

export default codePush(MyStack);
