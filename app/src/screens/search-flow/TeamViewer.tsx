import React, {useEffect, useState} from 'react';
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
import {CaretRight} from '../../SVGIcons';
import ListItemContainer from '../../components/ListItemContainer';
import ListItem from '../../components/ListItem';
import Svg, {Path} from 'react-native-svg';
import QuestionFormulaCreator from '../data-flow/QuestionFormulaCreator';
import CombinedGraph from './CombinedGraph'; // adjust the import path to match your file structur

interface TeamViewerProps {
  team: SimpleTeam;
  goBack: () => void;
}

const TeamViewer: React.FC<TeamViewerProps> = ({route}) => {
  const {colors} = useTheme();
  // team is a SimpleTeam
  const {team, competitionId} = route.params;
  const navigation = useNavigation();

  const [graphCreationModalVisible, setGraphCreationModalVisible] =
    useState(false);
  const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>(
    [],
  );
  const [graphActive, setGraphActive] = useState(false);

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

  useEffect(() => {
    if (chosenQuestionIndices.length > 0 && !graphCreationModalVisible) {
      setGraphActive(true);
    }
  }, [chosenQuestionIndices, graphCreationModalVisible]);

  return (
    <View>
      <ScrollView>
        <Text style={styles.team_header}>Team #{team.team_number}</Text>
        <Text style={styles.team_subheader}>{team.nickname}</Text>

        <CompetitionRank team_number={team.team_number} />

        <ListItemContainer title={'Team Stats'}>
          <ListItem
            text={'See all scouting reports and notes'}
            onPress={() => {
              navigation.navigate('Reports for Team', {
                team_number: team.team_number,
                competitionId: competitionId,
              });
            }}
            caretVisible={true}
            disabled={false}
            icon={() => null}
          />
          <ListItem
            text={'Create Performance Graph'}
            onPress={() => setGraphCreationModalVisible(true)}
            caretVisible={false}
            disabled={false}
            icon={() => {
              return (
                <Svg
                  width="16"
                  height="16"
                  fill={colors.text}
                  viewBox="0 0 16 16">
                  <Path d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </Svg>
              );
            }}
          />
        </ListItemContainer>

        <QuestionFormulaCreator
          visible={graphCreationModalVisible}
          setVisible={setGraphCreationModalVisible}
          chosenQuestionIndices={chosenQuestionIndices}
          setChosenQuestionIndices={setChosenQuestionIndices}
          compId={competitionId}
        />

        <CombinedGraph
          team_number={team.team_number}
          competitionId={competitionId}
          modalActive={graphActive}
          setModalActive={setGraphActive}
          questionIndices={chosenQuestionIndices}
        />

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
