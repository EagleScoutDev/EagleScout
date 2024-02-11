import {View, Text} from 'react-native';
import ReportList from '../../components/ReportList';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';

function ReportsForTeam({route}) {
  // const [team, setTeam] = useState('');
  const {team_number, competitionId} = route.params;
  const {colors} = useTheme();
  const [responses, setResponses] = useState<ScoutReportReturnData[] | null>(
    null,
  );

  useEffect(() => {
    CompetitionsDB.getCompetitionById(competitionId).then(competition => {
      if (!competition) {
        return;
      }
      ScoutReportsDB.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        setResponses(reports);
        console.log('scout reports for team ' + team_number + ' : ' + reports);
        console.log('no reports? ' + (reports.length === 0));
      });
    });
  }, [team_number]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            paddingLeft: '5%',
            color: colors.text,
            marginTop: '5%',
          }}>
          Reports for Team #{team_number}
        </Text>
        <ReportList
          reports={responses}
          isOffline={false}
          displayHeaders={false}
        />
      </View>
    </View>
  );
}

export default ReportsForTeam;
