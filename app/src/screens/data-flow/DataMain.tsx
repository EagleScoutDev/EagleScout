import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DataHome from './DataHome';
import Picklists from '../../database/Picklists';
import PicklistsManagerScreen from '../picklist-flow/PicklistsManagerScreen';
import PicklistsManager from '../picklist-flow/PicklistsManager';
import DataAggregator from './DataAggregator';
import CompetitionsList from '../competitions-flow/CompetitionsList';
import CompetitionsView from '../competitions-flow/CompetitionsView';

const DataStack = createStackNavigator();

const DataMain = () => {
  const {colors} = useTheme();

  return (
    <DataStack.Navigator>
      <DataStack.Screen
        name="DataHome"
        component={DataHome}
        options={{
          headerShown: false,
        }}
      />
      <DataStack.Screen
        name={'Picklist'}
        component={PicklistsManager}
        options={{
          headerBackTitle: 'Back',
        }}
      />
      <DataStack.Screen
        name={'Team Rank'}
        component={DataAggregator}
        options={{
          headerBackTitle: 'Back',
        }}
      />
      <DataStack.Screen
        name={'Manage Competitions'}
        component={CompetitionsView}
        options={{
          headerBackTitle: 'Back',
        }}
      />
    </DataStack.Navigator>
  );
};

export default DataMain;
