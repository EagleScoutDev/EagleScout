import { useState } from 'react';
import { SearchMain } from './SearchMain';

import { TeamViewer, type TeamViewerParams } from './TeamViewer';
import type { SimpleTeam } from '../../lib/TBAUtils';
import { createStackNavigator } from '@react-navigation/stack';
import { ReportsForTeam, type ReportsForTeamParams } from './ReportsForTeam';
import { AutoPathsForTeam } from './AutoPathsForTeam';
import { useTheme } from '@react-navigation/native';
import { SearchModal, type SearchModalParams } from './SearchModal';
import { CompareTeams } from './CompareTeams';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const Stack = createStackNavigator<SearchScreenParamList>();
export type SearchScreenScreenProps<K extends keyof SearchScreenParamList> = NativeStackScreenProps<SearchScreenParamList, K>
export type SearchScreenParamList = {
    "Main Search": undefined
    "Team Viewer": TeamViewerParams
    "Reports for Team": ReportsForTeamParams
    "Auto Paths": undefined
    "Search Modal": SearchModalParams
    "Compare Teams": undefined
}

export function SearchScreen() {
    const [team, setChosenTeam] = useState<SimpleTeam>();
    const { colors } = useTheme();

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
                name="Team Viewer"
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
                name={'Auto Paths'}
                component={AutoPathsForTeam}
                options={{
                    headerBackTitle: 'Back',
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name={'Search Modal'}
                component={SearchModal}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={'Compare Teams'}
                component={CompareTeams}
                options={{
                    headerBackTitle: 'Back',
                    headerTitle: '',
                }}
            />
        </Stack.Navigator>
    );
};
