import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import DebugOffline from '../DebugOffline';
import SettingsHome from './SettingsHome';

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
        children={props => <EditProfileModal {...props} getUser={getUser} />}
      />
      <Stack.Screen name="Change Password" component={ChangePasswordModal} />
      <Stack.Screen
        options={{
          headerBackTitle: 'Back',
        }}
        name="Debug Offline"
        component={DebugOffline}
      />
    </Stack.Navigator>
  );
}

export default SettingsMain;
