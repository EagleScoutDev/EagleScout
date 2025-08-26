import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SimpleTeam} from '../../lib/TBAUtils';
import Statbotics from '../../components/Statbotics';
import CompetitionRank from './CompetitionRank';
import ScoutSummary from './ScoutSummary';
import ListItemContainer from '../../components/ListItemContainer';
import ListItem from '../../components/ListItem';
import Svg, {Path} from 'react-native-svg';
import QuestionFormulaCreator from '../data-flow/QuestionFormulaCreator';
import CombinedGraph from './CombinedGraph';
import {DerivedValueCreator} from './DerivedValueCreator'; // adjust the import path to match your file structur

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
            icon={() => {
              return (
                <Svg
                  width="16"
                  height="16"
                  fill={colors.primary}
                  viewBox="0 0 16 16">
                  <Path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                  <Path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                  <Path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                </Svg>
              );
            }}
          />
          <ListItem
            text={'See auto paths'}
            onPress={() => {
              navigation.navigate('Auto Paths', {
                team_number: team.team_number,
                competitionId: competitionId,
              });
            }}
            caretVisible={true}
            disabled={false}
            icon={() => {
              return (
                <Svg
                  width="16"
                  height="16"
                  fill={colors.primary}
                  viewBox="0 0 256 256">
                  <Path d="M200,164a36.07,36.07,0,0,0-33.94,24H72a28,28,0,0,1,0-56h96a44,44,0,0,0,0-88H72a12,12,0,0,0,0,24h96a20,20,0,0,1,0,40H72a52,52,0,0,0,0,104h94.06A36,36,0,1,0,200,164Zm0,48a12,12,0,1,1,12-12A12,12,0,0,1,200,212Z" />
                </Svg>
              );
            }}
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
                  fill={colors.primary}
                  viewBox="0 0 16 16">
                  <Path d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </Svg>
              );
            }}
          />
          <ListItem
            text={'Compare to another team'}
            onPress={() =>
              navigation.navigate('Compare Teams', {
                team: team,
                compId: competitionId,
              })
            }
            caretVisible={true}
            disabled={false}
            icon={() => {
              return (
                <Svg
                  width="16"
                  height="16"
                  fill={colors.primary}
                  viewBox="0 0 16 16">
                  <Path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
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

        <DerivedValueCreator competitionId={competitionId} />

        <ScoutSummary
          team_number={team.team_number}
          competitionId={competitionId}
        />
      </ScrollView>
    </View>
  );
};

export default TeamViewer;
