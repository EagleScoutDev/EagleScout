import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MatchBetting } from './MatchBetting';
import { BettingScreen } from './BettingScreen';

const MatchBettingStack = createStackNavigator();

export const MatchBettingNavigator = () => {
    return (
        <MatchBettingStack.Navigator>
            <MatchBettingStack.Screen
                name="MatchBettingMain"
                component={MatchBetting}
                options={{ headerShown: false }}
            />
            <MatchBettingStack.Screen
                name="BettingScreen"
                component={BettingScreen}
                options={{ headerShown: false }}
            />
        </MatchBettingStack.Navigator>
    );
};
