import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import {useTheme} from '@react-navigation/native';
import {AutoPath} from '../../components/games/reefscape/AutoPath';
import {ReefscapeViewer} from '../../components/games/reefscape/ReefscapeViewer';

export const AutoPathsForTeam = ({route}) => {
  const {team_number, competitionId} = route.params;
  const {colors} = useTheme();
  const [autoPaths, setAutoPaths] = useState<AutoPath[] | undefined>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <Text style={{color: colors.text}}>
          {autoPaths ? `Path ${currentIndex + 1} of ${autoPaths.length}` : ''}
        </Text>
        {autoPaths ? (
          <ReefscapeViewer autoPath={autoPaths[currentIndex]} />
        ) : (
          <Text style={{color: colors.text}}>No auto paths found</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            marginTop: 10,
            gap: 10,
          }}>
          <Pressable
            style={{
              backgroundColor: colors.card,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            }}>
            <Text style={{color: colors.text}}>Previous</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: colors.card,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              if (currentIndex < autoPaths.length - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}>
            <Text style={{color: colors.text}}>Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
