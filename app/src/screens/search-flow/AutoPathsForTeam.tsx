import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import {useTheme} from '@react-navigation/native';
import {AutoPath} from '../../components/games/crescendo/AutoPath';
import {CrescendoAutoViewer} from '../../components/games/crescendo/CrescendoAutoViewer';

export const AutoPathsForTeam = ({route}) => {
  const {team_number, competitionId} = route.params;
  const {colors} = useTheme();
  const [autoPaths, setAutoPaths] = useState<AutoPath[] | undefined>();

  useEffect(() => {
    CompetitionsDB.getCompetitionById(competitionId).then(competition => {
      if (!competition) {
        return;
      }
      ScoutReportsDB.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        setAutoPaths(
          reports
            .map(report => report.autoPath)
            .filter(autoPath => autoPath) as AutoPath[],
        );
      });
    });
  }, [team_number]);

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 25,
          paddingLeft: '5%',
          color: colors.text,
        }}>
        Auto Paths for Team {team_number}
      </Text>
      {autoPaths?.map(autoPath => (
        <CrescendoAutoViewer autoPath={autoPath} />
      ))}
    </View>
  );
};
