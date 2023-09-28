import {View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import DBManager from '../../DBManager';

const ScoutingReportsList = ({navigation, competition}) => {
  const {colors} = useTheme();

  /**
   * reports is an array of objects, each object is a report
   * {
   *     id: number, // scout_report id
   *     team: number,
   *     match_number: number
   * }
   */
  const [reports, setReports] = useState([]);

  useEffect(() => {
    DBManager.getReportsForCompetition(competition).then(reports => {
      console.log('reports found!');
      console.log(reports);
    });
  }, []);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
      }}>
      <Text style={{color: colors.text}}>Scouting Reports List</Text>
      {/*<Text style={{color: colors.text}}>{competition.name}</Text>*/}
      {reports.map(report => (
        <Text style={{color: colors.text}}>{report.team}</Text>
      ))}
    </View>
  );
};

export default ScoutingReportsList;
