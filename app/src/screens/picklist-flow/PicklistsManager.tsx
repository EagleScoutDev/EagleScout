import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';

import {createStackNavigator} from '@react-navigation/stack';
import PicklistsManagerScreen from './PicklistsManagerScreen';
import PicklistCreator from './PicklistCreator';

const Stack = createStackNavigator();

function PicklistsManager() {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      color: colors.text,
    },
  });

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
