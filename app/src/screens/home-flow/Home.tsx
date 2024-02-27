import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import UpcomingRoundsView from '../UpcomingRoundsView';
import {useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Gamification from '../scouting-flow/Gamification';
import ScoutingFlow from '../scouting-flow/ScoutingFlow';
import FormHelper from '../../FormHelper';
import HomeMain from './HomeMain';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const HomeStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();


function Home() {
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
        component={ScoutingFlow}
      />
    </HomeStack.Navigator>
  );
}

export default Home;
