import * as React from 'react';
import Login from './screens/login-flow/Login';
import SettingsView from './screens/settings-flow/SettingsView';
import 'react-native-gesture-handler';
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
import {supabase} from './lib/supabase';
import {
  ClipboardWithGraph,
  MagnifyingGlass,
  DocumentWithPlus,
  Trophy,
  ListWithDots,
  TwoPeople,
  Gear,
} from './SVGIcons';

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
    const {error} = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    if (error) {
      console.error(error);
      setError(error.toString());
    } else {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      console.log('user: ' + user.id);
      //const { data, error } = await supabase.from('user_attributes').select('team_id, admin').eq('id', user.id);
      //console.log('data: ' + data);
      const {data, error} = await supabase
        .from('user_attributes')
        .select('team_id, scouter, admin')
        .eq('id', user.id)
        .single();
      const res = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
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
          setError(
            'You are not registered with a team. This should not normally happen ' +
              'as the app should register you with a team on signup. Please contact the app develoers.',
          );
        } else if (!data.scouter) {
          setError(
            'Your account has not been approved yet.\n Please contact a captain for approval.',
          );
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
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({
              ...data,
              ...data2,
            }),
          );
          await AsyncStorage.setItem('authenticated', 'true');
        }
      } else {
        console.error('Error: unable to access user attributes.');
        setError(
          'Unable to access your user attributes. This should not happen. Please contact the app developers.',
        );
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
          drawerType: 'slide',
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
                drawerIcon: () => ClipboardWithGraph(),
              }}
            />
            <Drawer.Screen
              name="Search"
              component={SearchScreen}
              options={{
                drawerIcon: () => MagnifyingGlass(),
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
                drawerIcon: () => DocumentWithPlus(),
                headerShown: scoutStylePreference === 'Scrolling',
              }}
            />
            {/*<Drawer.Screen name="Gamified" component={Gamified} />*/}
            {/*<Drawer.Screen name="Upcoming" component={UpcomingRounds} />*/}
            <Drawer.Screen
              name="Competitions"
              component={CompetitionsView}
              options={{
                drawerIcon: () => Trophy(),
              }}
            />
            <Drawer.Screen
              name="Previous Observations"
              component={SubmittedForms}
              options={{
                drawerIcon: () => ListWithDots(),
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
                  drawerIcon: () => TwoPeople(),
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
                drawerIcon: () => Gear(),
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
