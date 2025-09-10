import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DebugOffline from '../DebugOffline';
import SettingsHome from './SettingsHome';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from "../../lib/account";
import SubmittedForms from './SubmittedForms';
import DeleteAccountModal from './DeleteAccountModal';
import {SubmittedNotes} from './SubmittedNotes';

const Stack = createStackNavigator();

interface SettingsMainProps {
  onSignOut: () => void
}

function SettingsMain({ onSignOut }: SettingsMainProps) {
  const [user, setUser] = useState<Account | null>(null);

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    if (foundUser != null) {
      let foundUserObject: Account = JSON.parse(foundUser);
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
            // setOled={setOled}
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
      <Stack.Screen
        name={'Notes'}
        options={{
          headerBackTitle: 'Back',
        }}
        component={SubmittedNotes}
      />
    </Stack.Navigator>
  );
}

export default SettingsMain;
