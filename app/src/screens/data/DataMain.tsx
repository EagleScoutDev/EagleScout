import { React } from 'react';
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataHome } from './DataHome';
import { PicklistsManager } from '../picklist-flow/PicklistsManager';
import { DataAggregator } from './DataAggregator';
import { CompetitionsView } from '../competitions-flow/CompetitionsView';
import { UserManager } from './UserManager';
import { FormCreation } from '../form-creation-flow/FormCreation';
import { ExportToCSV } from '../export-to-csv-flow/ExportToCSV';
import { ScoutAssignments } from '../scout-assignments-flow/ScoutAssignments';
import { WeightedRank } from './WeightedRank';
import { ManageBets } from '../match-betting-flow/admin/ManageBets';
import { ScoutcoinLedger } from '../scoutcoin-flow/ScoutcoinLedger';
import { ScoutcoinLeaderboard } from '../scoutcoin-flow/ScoutcoinLeaderboard';
import { MatchPredictor } from './MatchPredictor';
import { ScoutcoinShop } from '../scoutcoin-flow/ScoutcoinShop';

const DataStack = createStackNavigator();

export const DataMain = () => {
    const { colors } = useTheme();

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
                name={'Weighted Team Rank'}
                component={WeightedRank}
                options={{
                    headerBackTitle: 'Back',
                    // headerTitle: 'Team RankA',
                }}
            />
            <DataStack.Screen
                name={'Match Predictor'}
                component={MatchPredictor}
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
                name={'Scoutcoin Leaderboard'}
                component={ScoutcoinLeaderboard}
                options={{
                    headerBackTitle: 'Back',
                }}
            />
            <DataStack.Screen
                name={'Scoutcoin Ledger'}
                component={ScoutcoinLedger}
                options={{
                    headerBackTitle: 'Back',
                }}
            />
            <DataStack.Screen
                name={'Scoutcoin Shop'}
                component={ScoutcoinShop}
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
            <DataStack.Screen
                name={'Manage Match Bets'}
                component={ManageBets}
                options={{
                    headerBackTitle: 'Back',
                }}
            />
        </DataStack.Navigator>
    );
};
