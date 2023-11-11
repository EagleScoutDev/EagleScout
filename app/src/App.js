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
import CompetitionsView from './screens/competitions-flow/CompetitionsView';
import UserManager from './screens/UserManager';
import CompleteSignup from './screens/login-flow/CompleteSignup';
import {useEffect, useState} from 'react';
import SubmittedForms from './screens/SubmittedForms';
import DebugOffline from './screens/DebugOffline';
import SearchScreen from './screens/search-flow/SearchScreen';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpModal from './screens/login-flow/SignUpModal';
import CustomDrawerContent from './CustomDrawer';
import ScoutingFlow from './screens/scouting-flow/ScoutingFlow';
import FormHelper from './FormHelper';
// import UpcomingRoundsView from './screens/UpcomingRoundsView';
import {supabase} from './lib/supabase';
import {
  ClipboardWithGraph,
  MagnifyingGlass,
  DocumentWithPlus,
  Trophy,
  ListWithDots,
  TwoPeople,
  Gear,
  CheckList,
} from './SVGIcons';
import PicklistsManager from './screens/picklist-flow/PicklistsManager';
import codePush from 'react-native-code-push';

const Drawer = createDrawerNavigator();

const MyStack = () => {
  const scheme = useColorScheme();
  const [themePreference, setThemePreference] = useState('System');
  const [scoutStylePreference, setScoutStylePreference] = useState('Paginated');

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(value => {
      if (value != null) {
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
      if (user.user_metadata.requested_deletion) {
        setError('Your account has been marked for deletion.');
        return;
      }
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

  const ScoutReportComponent = props => (
    <ScoutingFlow
      {...props}
      isScoutStylePreferenceScrolling={scoutStylePreference === 'Scrolling'}
    />
  );

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
            <Drawer.Screen
              name="CompleteSignUp"
              component={CompleteSignup}
              options={{
                headerShown: false,
                drawerItemStyle: {
                  display: 'none',
                },
                // prevents the drawer from opening when the user swipes from the left
                swipeEnabled: false,
              }}
            />
          </>
        ) : (
          <>
            {/*<Drawer.Screen*/}
            {/*  name="Upcoming Rounds"*/}
            {/*  component={UpcomingRoundsView}*/}
            {/*  options={{*/}
            {/*    drawerIcon: () => ClipboardWithGraph(),*/}
            {/*  }}*/}
            {/*/>*/}
            <Drawer.Screen
              name="Search"
              component={SearchScreen}
              options={{
                drawerIcon: () =>
                  MagnifyingGlass({
                    width: '8%',
                    height: '100%',
                  }),
              }}
            />
            <Drawer.Screen
              name="Scout Report"
              component={ScoutReportComponent}
              options={{
                drawerIcon: () => DocumentWithPlus(),
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
              name={'Picklists'}
              component={PicklistsManager}
              options={{
                drawerIcon: () => CheckList(),
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
      <Toast />
    </NavigationContainer>
  );
  // return <ScoutingViewJSON2 />;
  // } else {
  //   return <Login />;
  // }
};

export default codePush(MyStack);
