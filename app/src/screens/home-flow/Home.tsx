import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import UpcomingRoundsView from '../UpcomingRoundsView';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Gamification from '../scouting-flow/Gamification';
import ScoutingFlow from '../scouting-flow/ScoutingFlow';
import FormHelper from '../../FormHelper';
import HomeMain from './HomeMain';
import NoteScreen from './Note';
import NoteViewer from './NoteViewer';

const HomeStack = createStackNavigator();

function Home({navigation}) {
  const {colors} = useTheme();
  const [scoutStylePreference, setScoutStylePreference] =
    React.useState<string>('Paginated');

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(value => {
      if (value != null) {
        setScoutStylePreference(value);
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
  });

  const ScoutReportComponent = props => (
    <ScoutingFlow
      {...props}
      isScoutStylePreferenceScrolling={scoutStylePreference === 'Scrolling'}
    />
  );

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home Main"
        component={HomeMain}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={'Scout Report'}
        options={{
          headerBackTitle: 'Home',
        }}
        component={ScoutReportComponent}
      />
      <HomeStack.Screen
        name={'Note'}
        options={{
          headerBackTitle: 'Home',
        }}
        component={NoteScreen}
      />
      <HomeStack.Screen
        name={'Note Viewer'}
        options={{
          headerBackTitle: 'Home',
        }}
        component={NoteViewer}
      />
    </HomeStack.Navigator>
  );
}

export default Home;
