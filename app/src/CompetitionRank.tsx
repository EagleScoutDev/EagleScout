import React, {useEffect} from 'react';
import {SimpleEvent, TBA} from './lib/TBAUtils';
import {useTheme} from '@react-navigation/native';
import {View, Text} from 'react-native';

// TODO: Add a loading indicator
// TODO: When it is clicked on, expand and show their rank history for the past few competitions they have attended
function CompetitionRank({team_number}: {team_number: number}) {
  const [currentCompetition, setCurrentCompetition] =
    React.useState<SimpleEvent>();
  const [currentCompetitionRank, setCurrentCompetitionRank] =
    React.useState<number>();

  const {colors} = useTheme();

  useEffect(() => {
    TBA.getCurrentCompetitionForTeam(team_number).then(event => {
      setCurrentCompetition(event);
      TBA.getTeamRank(currentCompetition!.key, team_number).then(rank => {
        setCurrentCompetitionRank(rank);
      });
    });
  }, [currentCompetition]);

  const rankToColor = (rank: number) => {
    if (rank < 8) {
      return 'green';
    } else if (rank < 16) {
      return 'deepskyblue';
    } else if (rank < 24) {
      return 'orangered';
    }
    return 'red';
  };

  return (
    <View
      style={{
        minWidth: '85%',
        maxWidth: '85%',
        padding: '5%',
        marginVertical: '5%',
        backgroundColor:
          currentCompetitionRank === undefined
            ? 'white'
            : rankToColor(currentCompetitionRank!),
        borderRadius: 10,
        alignSelf: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 20,
          marginTop: '2%',
          fontWeight: '800',
        }}>
        Ranked #{currentCompetitionRank}
      </Text>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 20,
          marginTop: '2%',
        }}>
        at {currentCompetition?.name}
      </Text>
    </View>
  );
}

export default CompetitionRank;
