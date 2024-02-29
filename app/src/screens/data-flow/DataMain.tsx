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
import UserManager from './UserManager';
import FormCreationMain from '../form-creation-flow/FormCreationMain';
import FormCreation from '../form-creation-flow/FormCreation';
import ExportToCSV from '../export-to-csv-flow/ExportToCSV';
import ScoutAssignments from "../scout-assignments-flow/ScoutAssignments";

const DataStack = createStackNavigator();

const DataMain = () => {
  const {colors} = useTheme();

  return (
    <DataStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}>
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
          headerShown: false,
          // headerBackTitle: 'Back',
          // headerTitle: 'PicklistA',
        }}
      />
      <DataStack.Screen
        name={'Team Rank'}
        component={DataAggregator}
        options={{
          headerBackTitle: 'Back',
          // headerTitle: 'Team RankA',
        }}
      />
      <DataStack.Screen
        name={'Export to CSV'}
        component={ExportToCSV}
        options={{
          headerBackTitle: 'Back',
          // headerTitle: 'Team RankA',
        }}
      />
      <DataStack.Screen
        name={'Manage Competitions'}
        component={CompetitionsView}
        options={
          {
            // headerBackTitle: 'Back',
          }
        }
      />
      <DataStack.Screen
        name={'Manage Users'}
        component={UserManager}
        options={{
          headerBackTitle: 'Back',
        }}
      />
      <DataStack.Screen
        name={'Manage Forms'}
        component={FormCreation}
        options={{
          headerBackTitle: 'Back',
        }}
      />
      <DataStack.Screen
        name={'Manage Scout Assignments'}
        component={ScoutAssignments}
        options={{
          headerBackTitle: 'Back',
        }}
      />
    </DataStack.Navigator>
  );
};

export default DataMain;
