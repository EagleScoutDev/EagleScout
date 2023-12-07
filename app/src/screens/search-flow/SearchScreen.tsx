import React, {useEffect, useState} from 'react';
import SearchMain from './SearchMain';

import TeamViewer from './TeamViewer';
import {SimpleTeam} from '../../lib/TBAUtils';
import {createStackNavigator} from '@react-navigation/stack';
import ReportsForTeam from './ReportsForTeam';
import {useTheme} from '@react-navigation/native';

const Stack = createStackNavigator();
function SearchScreen() {
  const [team, setChosenTeam] = useState<SimpleTeam>();
  const {colors} = useTheme();

  // if (team === null || team === undefined) {
  //   return <SearchMain setChosenTeam={setChosenTeam} />;
  // } else {
  //   return <TeamViewer team={team} goBack={() => setChosenTeam(undefined)} />;
  // }
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Main Search"
        component={SearchMain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TeamViewer"
        component={TeamViewer}
        options={{
          // show the back button, but not the header
          headerBackTitle: 'Back',
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={'Reports for Team'}
        component={ReportsForTeam}
        options={{
          headerBackTitle: 'Back',
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
}

export default SearchScreen;
