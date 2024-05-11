import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SimpleEvent, SimpleTeam, TBA} from '../../lib/TBAUtils';
import Statbotics from '../../components/Statbotics';
import CompetitionRank from './CompetitionRank';
import ScoutSummary from './ScoutSummary';
import {CaretRight} from '../../SVGIcons'; // adjust the import path to match your file structur

interface TeamViewerProps {
  team: SimpleTeam;
  goBack: () => void;
}

const TeamViewer: React.FC<TeamViewerProps> = ({route}) => {
  const {colors} = useTheme();
  const {team, competitionId} = route.params;
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    team_header: {
      color: colors.text,
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '5%',
    },
    team_subheader: {
      color: colors.text,
      textAlign: 'center',
      fontStyle: 'italic',
      fontSize: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      padding: '5%',
      borderRadius: 10,
    },
    reports_button: {
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignSelf: 'center',
      minWidth: '85%',
      maxWidth: '85%',
      borderRadius: 10,
      backgroundColor: colors.card,
      marginTop: '5%',
    },
  });

  return (
    <View>
      <ScrollView>
        <Text style={styles.team_header}>Team #{team.team_number}</Text>
        <Text style={styles.team_subheader}>{team.nickname}</Text>

        <CompetitionRank team_number={team.team_number} />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Reports for Team', {
              team_number: team.team_number,
              competitionId: competitionId,
            });
          }}
          style={styles.reports_button}>
          <Text style={styles.label}>See all scouting reports and notes</Text>
          {CaretRight()}
        </TouchableOpacity>

        <Statbotics team={team.team_number} />
        <ScoutSummary
          team_number={team.team_number}
          competitionId={competitionId}
        />
      </ScrollView>
    </View>
  );
};

export default TeamViewer;
