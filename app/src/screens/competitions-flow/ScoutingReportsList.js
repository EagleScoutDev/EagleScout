import {View, Text, ActivityIndicator} from 'react-native';
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
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    console.log('HERE');
    ScoutReportsDB.getReportsForCompetition(competition.id).then(reports => {
      // console.log('reports found!');
      // console.log(reports);
      console.log('number of reports: ' + reports.length);
      setReports(reports);
      setReportsLoading(false);
    });
  }, [competition]);
  if (reportsLoading) {
    return <ActivityIndicator />;
  }
  return <ReportList reports={reports} isOffline={false} expandable={false} displayHeaders={false} />;
};

export default ScoutingReportsList;
