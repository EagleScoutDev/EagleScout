import {View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import ScoutReportsDB from '../../database/ScoutReports';
import ReportList from '../../components/ReportList';

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
    console.log('HERE');
    ScoutReportsDB.getReportsForCompetition(competition.id).then(reports => {
      console.log('reports found!');
      console.log(reports);
      console.log('number of reports: ' + reports.length);
      setReports(reports);
    });
  }, [competition]);

  return <ReportList forms={reports} isOffline={false} />;
};

export default ScoutingReportsList;
