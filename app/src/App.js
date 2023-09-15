import * as React from 'react';
import Login from './screens/login-flow/Login';
import SettingsView from './screens/settings-flow/SettingsView';
import 'react-native-gesture-handler';
import Svg, {Path} from 'react-native-svg';
import Toast from 'react-native-toast-message';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CompetitionsView from './screens/CompetitionsView';
import UserManager from './screens/UserManager';
import {useEffect, useState} from 'react';
import SubmittedForms from './screens/SubmittedForms';
import DebugOffline from './screens/DebugOffline';
import SearchScreen from './screens/SearchScreen';
import {useColorScheme} from 'react-native';
import ScoutingView from './screens/scouting-flow/ScoutingView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpModal from './screens/login-flow/SignUpModal';
import CustomDrawerContent from './CustomDrawer';
import Gamification from './screens/scouting-flow/Gamification';
import FormHelper from './FormHelper';
import UpcomingRoundsView from './screens/UpcomingRoundsView';
import { supabase } from './lib/supabase';
const Drawer = createDrawerNavigator();

const MyStack = () => {
  const scheme = useColorScheme();
  const [themePreference, setThemePreference] = useState('System');
  const [scoutStylePreference, setScoutStylePreference] = useState('Paginated');

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(value => {
      if (value !== null) {
        setScoutStylePreference(value);
      }
    });
  }, [scoutStylePreference]);
  const [admin, setAdmin] = useState('0');
  let [error, setError] = useState('');

  // checking if user has permission to edit competitions
  const checkAdmin = async () => {
    // use async storage
    const user = await AsyncStorage.getItem('user');
    if (user !== null) {
      console.log('user: ' + user);
      const userObj = JSON.parse(user);
      if (userObj.admin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
  };

  const submitForm = async (username, password) => {
    console.log('[login] username: ' + username);
    console.log('[login] password: ' + password);
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    if (error) {
      console.error(error);
      setError(error.toString());
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('user: ' + user.id);
      //const { data, error } = await supabase.from('user_attributes').select('team_id, admin').eq('id', user.id);
      //console.log('data: ' + data);
      const { data, error } = await supabase.from('user_attributes').select('team_id, scouter, admin').eq('id', user.id).single();
      const res = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
      let data2 = res.data;
      const error2 = res.error;
      if (error2) {
        console.error(error2);
        console.error("Couldn't get user profile");
        data2 = {};
      }
      if (error) {
        console.error(error);
      } else if (data) {
        console.log('User attributes' + JSON.stringify(data));
        if (!data.team_id) {
          console.error('Error: user is not registered with a team.');
          setError('You are not registered with a team. This should not normally happen ' +
            'as the app should register you with a team on signup. Please contact the app develoers.');
        } else if (!data.scouter) {
          setError('Your account has not been approved yet.\n Please contact a captain for approval.');
        } else {
          console.log('are they an admin ' + data.admin);
          if (data.admin) {
            console.log('admin detected');
            setAdmin(true);
          } else {
            console.log('not an admin');
            setAdmin(false);
          }
          setError('');
          await AsyncStorage.setItem('user', JSON.stringify({
            ...data,
            ...data2,
          }));
          await AsyncStorage.setItem('authenticated', 'true');
        }
      } else {
        console.error('Error: unable to access user attributes.');
        setError('Unable to access your user attributes. This should not happen. Please contact the app developers.');
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
      if (value !== null) {
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
          ? DefaultTheme
          : scheme === 'dark'
          ? DarkTheme
          : DefaultTheme
      }>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          drawerType: 'front',
          drawerLabelStyle: {
            marginLeft: -16,
          },
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}
        options={{
          headerShown: false,
        }}>
        {admin === '0' ? (
          <>
            <Drawer.Screen
              name="Login"
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none',
                },
                // prevents the drawer from opening when the user swipes from the left
                swipeEnabled: false,
              }}
              children={() => (
                <Login onSubmit={submitForm} error={error} ifAuth={skipAuth} />
              )}
            />
            <Drawer.Screen
              name="Sign"
              component={SignUpModal}
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none',
                },
              }}
            />
          </>
        ) : (
          <>
            <Drawer.Screen
              name="Upcoming Rounds"
              component={UpcomingRoundsView}
              options={{
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill="gray"
                      d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                    />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Search"
              component={SearchScreen}
              options={{
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill={'gray'}
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Scout Report"
              component={
                scoutStylePreference === 'Scrolling'
                  ? ScoutingView
                  : Gamification
              }
              options={{
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill={'gray'}
                      d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0z"
                    />
                  </Svg>
                ),
                headerShown: scoutStylePreference === 'Scrolling',
              }}
            />
            {/*<Drawer.Screen name="Gamified" component={Gamified} />*/}
            {/*<Drawer.Screen name="Upcoming" component={UpcomingRounds} />*/}
            <Drawer.Screen
              name="Competitions"
              component={CompetitionsView}
              options={{
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill="gray"
                      d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"
                    />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Previous Observations"
              component={SubmittedForms}
              options={{
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill="gray"
                      d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                    />
                  </Svg>
                ),
              }}
            />
            <Drawer.Screen
              name="Debug Offline"
              component={DebugOffline}
              options={{
                drawerItemStyle: {
                  display: 'none',
                },
              }}
            />
            {admin === true && admin !== '0' && (
              <Drawer.Screen
                name="User Management"
                component={UserManager}
                options={{
                  // drawerItemStyle: {
                  //   display: 'none',
                  // },
                  drawerIcon: () => (
                    <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                      <Path
                        fill="gray"
                        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      />
                    </Svg>
                  ),
                }}
              />
            )}
            <Drawer.Screen
              name="Settings"
              // component={SettingsView}
              options={{
                // drawerItemStyle: {
                //   display: 'none',
                // },
                drawerIcon: () => (
                  <Svg width={'8%'} height="100%" viewBox="0 0 16 16">
                    <Path
                      fill={'gray'}
                      d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
                    />
                  </Svg>
                ),
              }}
              children={() => (
                <SettingsView
                  onSignOut={redirectLogin}
                  setTheme={setThemePreference}
                  setScoutingStyle={setScoutStylePreference}
                />
              )}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
  // return <ScoutingViewJSON2 />;
  // } else {
  //   return <Login />;
  // }
};

export default MyStack;
