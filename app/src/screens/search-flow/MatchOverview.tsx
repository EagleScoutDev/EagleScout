import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SimpleTeam, TBA} from '../../lib/TBAUtils';
import {Pressable, View, TextInput, Text} from 'react-native';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';
import getCompetitionTeams from '../../database/Competitions';
import {ScoutReportReturnData} from '../../database/ScoutReports';
import {useNavigation, useTheme} from '@react-navigation/native';
import TBATeams, {TBATeam} from '../../../database/TBATeams';

interface OverviewProps {
  route: {
    params: {
      matchNumber: number;
      alliance: string;
    };
  };
}

const MatchOverview = ({route}: OverviewProps) => {
  const colors = useTheme();
  const navigation = useNavigation();
  const {matchNumber, alliance} = route.params;
  const {competitionId, matches} = useCurrentCompetitionMatches();

  const matchTeams = useMemo(
    () =>
      matches
        .filter(match => match.compLevel === 'qm')
        .filter(match => match.match === matchNumber)
        .filter(match => match.alliance === alliance)
        .sort((a, b) => (a.alliance === 'red' ? -1 : 1))
        .map(match => match.team.replace('frc', ''))
        .map(match => match.replace(/[A-Za-z]/g, ' '))
        .map(match => Number(match)),
    [matches],
  );
  const simpleTeams = matchTeams.map(TBA.getTeam);
  console.log(matchTeams);
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {simpleTeams.map(team => (
          <Pressable
            key={team.key}
            onPress={() => {
              navigation.navigate('TeamViewer', {
                team: {team},
                competitionId: competitionId,
              });
            }}>
            <View style={{}}>
              <Text>{team.team_number}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
  //tba stuff here -> get alliance, get teams
  //call supabase to get numbers
  //have buttons to navigate between teams.
};
export default MatchOverview;
