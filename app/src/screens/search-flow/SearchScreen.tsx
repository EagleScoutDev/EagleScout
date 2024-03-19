import React, {useEffect, useState} from 'react';
import SearchMain from './SearchMain';

import TeamViewer from './TeamViewer';
import {SimpleTeam} from '../../lib/TBAUtils';
import {createStackNavigator} from '@react-navigation/stack';
import ReportsForTeam from './ReportsForTeam';
import {useNavigation, useTheme} from '@react-navigation/native';
import ScoutViewer from '../../components/modals/ScoutViewer';
import SearchModal from './SearchModal';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();

function SearchScreen({
  navigation: rootNavigation,
}: {
  navigation: BottomTabNavigationProp<{}>;
}) {
  const [team, setChosenTeam] = useState<SimpleTeam>();
  const {colors} = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = rootNavigation.addListener('tabPress', e => {
      console.log(
        'tab press',
        navigation.isFocused(),
        rootNavigation.isFocused(),
      );
      if (navigation.isFocused()) {
        e.preventDefault();
        navigation.navigate('Main Search', {
          searchEnabled: true,
        });
      }
    });

    return unsubscribe;
  }, [rootNavigation]);

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
      <Stack.Screen
        name={'SearchModal'}
        component={SearchModal}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default SearchScreen;
