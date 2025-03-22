import React, {useEffect, useMemo, useState} from 'react';
import {TBA} from '../../lib/TBAUtils';
import {Pressable, Text, View} from 'react-native';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';
import CompetitionsDB from '../../database/Competitions';
import {useNavigation, useTheme} from '@react-navigation/native';
import {TBATeam} from '../../../database/TBATeams';

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
  const {competitionId, getTeamsForMatchDetailed} =
    useCurrentCompetitionMatches();
  const [competitionTeams, setCompetitionTeams] = useState<TBATeam[]>([]);

  useEffect(() => {
    CompetitionsDB.getCompetitionTBAKey(competitionId).then(key => {
      TBA.getTeamsAtCompetition(key).then(teams => {
        setCompetitionTeams(teams);
      });
    });
  }, []);

  const teamsInMatch = useMemo(() => {
    return getTeamsForMatchDetailed(matchNumber);
  }, [matchNumber]);

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {teamsInMatch
          .map(team => (team.alliance === alliance ? team.team : null))
          .filter(team => team !== null)
          .map(teamId =>
            competitionTeams.find(
              team => team.key.replace('frc', '') === teamId,
            ),
          )
          .map(team => (
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
