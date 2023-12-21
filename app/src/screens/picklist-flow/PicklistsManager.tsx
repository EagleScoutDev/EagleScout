import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PicklistsManagerScreen from './PicklistsManagerScreen';
import PicklistCreator from './PicklistCreator';

const Stack = createStackNavigator();

function PicklistsManager() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="PicklistsManager"
        component={PicklistsManagerScreen}
        options={{
          title: 'Picklists',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Picklist Creator"
        component={PicklistCreator}
        options={{
          title: 'Picklist Creator',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default PicklistsManager;
