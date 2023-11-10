import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PicklistsManagerScreen from './PicklistsManagerScreen';
import PicklistCreator from './PicklistCreator';

const Stack = createStackNavigator();

function PicklistsManager() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PicklistsManager"
        component={PicklistsManagerScreen}
        options={{
          title: 'Picklists Manager',
          headerShown: false,
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
