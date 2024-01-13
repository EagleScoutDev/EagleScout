import {View, Text} from 'react-native';
import ReportList from '../../components/ReportList';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';
import PitScoutReports, {
  PitScoutReportReturnData,
} from '../../database/PitScoutReports';
import {PitScoutReportList} from '../../components/PitScoutReportList';

function ReportsForTeam({route}) {
  // const [team, setTeam] = useState('');
  const {team_number} = route.params;
  const {colors} = useTheme();
  const [responses, setResponses] = useState<ScoutReportReturnData[] | null>(
    null,
  );
  const [pitResponses, setPitResponses] = useState<
    PitScoutReportReturnData[] | null
  >(null);

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(competition => {
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
      PitScoutReports.getReportsForTeamAtCompetition(
        team_number,
        competition.id,
      ).then(reports => {
        console.log('pit reports for team ' + team_number + ' : ' + reports);
        setPitResponses(reports);
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
          Match Scouting Reports for Team #{team_number}
        </Text>
        <ReportList reports={responses} isOffline={false} />
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            paddingLeft: '5%',
            color: colors.text,
            marginTop: '5%',
          }}>
          Pit Scouting Reports for Team #{team_number}
        </Text>
        <PitScoutReportList reports={pitResponses} isOffline={false} />
      </View>
    </View>
  );
}

export default ReportsForTeam;
