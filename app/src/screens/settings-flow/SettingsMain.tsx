import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DebugOffline from '../DebugOffline';
import SettingsHome from './SettingsHome';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoredUser} from '../../lib/StoredUser';
import SubmittedForms from './SubmittedForms';
import DeleteAccountModal from './DeleteAccountModal';

const Stack = createStackNavigator();

interface SettingsMainProps {
  onSignOut: () => void;
  setTheme: (arg0: string) => void;
  setScoutingStyle: (arg0: string) => void;
}

function SettingsMain({
  onSignOut,
  setTheme,
  setScoutingStyle,
}: SettingsMainProps) {
  const [user, setUser] = useState<StoredUser | null>(null);

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    if (foundUser != null) {
      let foundUserObject: StoredUser = JSON.parse(foundUser);
      setUser(foundUserObject);
    }
  };

  const signOutFunction = () => {
    // AsyncStorage.setItem('authenticated', 'false');
    // TODO: triple check if this is the right way to do this
    AsyncStorage.clear().then(() => {
      console.log('Sign out successful');
      onSignOut();
    });
  };

  return (
    <Stack.Navigator initialRouteName={'Main Settings'}>
      <Stack.Screen
        name="Main Settings"
        options={{headerShown: false}}
        children={() => (
          <SettingsHome
            onSignOut={onSignOut}
            setScoutingStyle={setScoutingStyle}
            setTheme={setTheme}
          />
        )}
      />
      <Stack.Screen
        name="Edit Profile"
        options={{
          headerBackTitle: 'Back',
        }}
        children={props => <EditProfile {...props} getUser={getUser} />}
      />
      <Stack.Screen name="Change Password" component={ChangePassword} />
      <Stack.Screen
        name={'Request Account Deletion'}
        children={props => (
          <DeleteAccountModal {...props} signOut={signOutFunction} />
        )}
      />
      <Stack.Screen
        options={{
          headerBackTitle: 'Back',
        }}
        name="Debug Offline"
        component={DebugOffline}
      />
      <Stack.Screen
        name={'Reports'}
        options={{
          headerBackTitle: 'Back',
        }}
        component={SubmittedForms}
      />
    </Stack.Navigator>
  );
}

export default SettingsMain;
