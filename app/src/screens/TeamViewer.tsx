import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SimpleEvent, SimpleTeam, TBA} from '../lib/TBAUtils';
import Statbotics from '../components/Statbotics';
import CompetitionRank from '../CompetitionRank';
import ScoutSummary from './ScoutSummary'; // adjust the import path to match your file structure

interface TeamViewerProps {
  team: SimpleTeam;
  goBack: () => void;
}

const TeamViewer: React.FC<TeamViewerProps> = ({team, goBack}) => {
  const {colors} = useTheme();

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          goBack();
        }}>
        <Text style={{color: 'gray', fontSize: 20, padding: '4%'}}>Back</Text>
      </TouchableOpacity>
      <Text
        style={{
          color: colors.text,
          fontSize: 30,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Team #{team.team_number}
      </Text>
      <Text
        style={{
          color: colors.text,
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: 20,
        }}>
        {team.nickname}
      </Text>
      <CompetitionRank team_number={team.team_number} />
      {/*<Statbotics team={team.team_number} />*/}
      <ScoutSummary team_number={team.team_number} />
    </View>
  );
};

export default TeamViewer;
