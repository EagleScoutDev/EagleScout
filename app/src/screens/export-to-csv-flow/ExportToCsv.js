import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CompetitionsDB from '../../database/Competitions';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import NoInternet from '../../components/NoInternet';
import ScoutReports from '../../database/ScoutReports';
import FormsDB from '../../database/Forms';
import {supabase} from '../../lib/supabase';
import RNFS from 'react-native-fs';

const ExportToCsv = () => {
  const {colors} = useTheme();
  const [internetError, setInternetError] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCompetitions = async () => {
    try {
      const data = await CompetitionsDB.getCompetitions();
      // sort the data by start time
      data.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
      });
      setCompetitionList(data);
      setInternetError(false);
    } catch (error) {
      console.error(error);
      setInternetError(true);
    }
  };

  useEffect(() => {
    getCompetitions().catch(console.error);
  }, []);

  if (internetError) {
    return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
  }

  const exportToCsv = async comp => {
    setLoading(true);
    let form;
    try {
      form = await FormsDB.getForm(comp.formId);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Error', 'An error occurred while fetching the form');
      return;
    }
    let reports;
    try {
      reports = await ScoutReports.getReportsForCompetition(comp.id);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert(
        'Error',
        'An error occurred while fetching the reports for the competition',
      );
      return;
    }
    const namesPromises = reports.map(async report => {
      const {data: userData, error: userError} = await supabase
        .from('profiles')
        .select('name')
        .eq('id', report.userId)
        .single();
      if (userError) {
        throw userError;
      }
      return userData.name;
    });
    let names;
    try {
      names = await Promise.all(namesPromises);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Error', 'An error occurred while fetching the user names');
      return;
    }
    console.log(reports);
    const csvrows = [];
    const header = [];
    header.push('user id');
    header.push('user name');
    header.push('match number');
    header.push('team number');
    form.formStructure.forEach(q => {
      if (q.type === 'radio' || q.type === 'textbox' || q.type === 'number') {
        header.push(q.question);
      }
    });
    csvrows.push(header.join(','));
    reports.forEach((report, index) => {
      const row = [];
      row.push(report.userId);
      row.push(names[index]);
      row.push(report.matchNumber);
      row.push(report.teamNumber);
      form.formStructure.forEach((q, i) => {
        if (q.type === 'radio') {
          row.push(q.options[report.data[i]]);
        } else if (q.type === 'number') {
          row.push(report.data[i]);
        } else if (q.type === 'textbox') {
          row.push(report.data[i]);
        }
      });
      csvrows.push(row.join(','));
    });
    console.log(csvrows);

    let csvContent = '';

    csvrows.forEach(function (row) {
      csvContent += row + '\r\n';
    });

    let path = RNFS.DocumentDirectoryPath + `/${comp.name}.csv`;
    RNFS.writeFile(path, csvContent, 'utf8')
      .then(async success => {
        setLoading(false);
        try {
          const result = await Share.share({
            url: `file://${path}`,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert('Cannot show share dialog', error.message);
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert(
          'Error',
          'An error occurred while writing the CSV file. Please make sure the app has the necessary permissions.',
        );
        console.log(err.message);
      });
  };

  return (
    <>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <View style={{flex: 1}}>
        {/*TODO: Make this bigger*/}
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: colors.background,
            height: '100%',
            borderRadius: 10,
            padding: '10%',
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 5,
              color: colors.text,
              textDecorationStyle: 'solid',
              textDecorationColor: colors.border,
            }}>
            Choose a Competition
          </Text>
          <Text
            style={{
              color: colors.text,
              marginBottom: 15,
            }}>
            Choose a competition to export the scout reports to a CSV file
          </Text>
          <ScrollView>
            {competitionList.map((comp, index) => (
              <TouchableOpacity
                key={comp.id}
                disabled={loading}
                onPress={() => {
                  console.log(comp);
                  exportToCsv(comp);
                }}
                style={{
                  padding: 20,
                  borderRadius: 10,
                  backgroundColor:
                    index % 2 === 0 ? colors.border : colors.background,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  {comp.name} ({new Date(comp.startTime).getFullYear()})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default ExportToCsv;
