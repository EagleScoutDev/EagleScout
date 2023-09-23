/**
 * This file will separate the forms the user has submitted into two:
 * 1) the forms they have submitted offline, but have not been pushed
 *    give option for "select all" and submit, or user can select manually
 * 2) the forms they have uploaded to the database in the past
 */
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useEffect, useState} from 'react';
import ReportList from '../components/ReportList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import SegmentedOption from '../components/pickers/SegmentedOption';
import DBManager from '../DBManager';
import React from 'react-native';
import StandardButton from '../components/StandardButton';
import {Toast} from 'react-native-toast-message/';
import {supabase} from '../lib/supabase';

const DEBUG = false;

function SubmittedForms() {
  const [reports, setReports] = useState([]);
  const [offlineReports, setOfflineReports] = useState([]);
  const [parseableReports, setParseableReports] = useState([]); // [data, match_number, team, competition_id, form_id
  const {colors} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('Offline');
  const [loading, setLoading] = useState(false);

  async function getOfflineReports() {
    const allOffline = await AsyncStorage.getAllKeys();
    if (DEBUG) {
      console.log('all offline: ' + allOffline);
    }
    const offReports = allOffline.filter(key => key.includes('form-'));
    if (DEBUG) {
      console.log('offline reports: ' + offReports);
    }

    const formsFound = [];
    const formsFoundParseable = [];
    for (let i = 0; i < offReports.length; i++) {
      const report = await AsyncStorage.getItem(offReports[i]);
      if (DEBUG) {
        console.log('report: ' + report);
      }
      formsFound.push(JSON.parse(report));
      const reportData = JSON.parse(report);
      const reportParseable = {
        data: reportData.data_arg,
        match_number: reportData.match_number_arg,
        team: reportData.team_arg,
        competition_id: reportData.competition_arg,
        form_id: reportData.form_id_arg,
        timestamp: reportData.timestamp,
      };
      formsFoundParseable.push(reportParseable);
    }
    setOfflineReports(formsFound);
    setParseableReports(formsFoundParseable);
  }

  useEffect(() => {
    setLoading(true);
    DBManager.getReportsForSelf().then(result => {
      setReports(result);
    });
    getOfflineReports().then(() => setLoading(false));
  }, []);

  const styles = StyleSheet.create({
    segmented_picker_container: {
      flexDirection: 'row',
      margin: 20,
      backgroundColor: colors.border,
      padding: 2,
      borderRadius: 10,
      alignContent: 'center',
    },
    loading_indicator: {
      flexDirection: 'row',
      margin: 20,
      alignSelf: 'center',
      padding: 2,
      borderRadius: 10,
      alignContent: 'center',
    },
    offline_card: {
      margin: 20,
      backgroundColor: colors.border,
      padding: 20,
      borderRadius: 10,
      alignContent: 'center',
    },
    offline_text: {
      textAlign: 'center',
      fontSize: 20,
      color: 'green',
      fontWeight: 'bold',
    },
    offline_subtext: {
      textAlign: 'center',
      fontSize: 15,
      color: 'gray',
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.segmented_picker_container}>
        <SegmentedOption
          colors={colors}
          title="Offline"
          selected={selectedTheme}
          onPress={() => {
            setSelectedTheme('Offline');
            setLoading(true);
            getOfflineReports().then(() => setLoading(false));
          }}
        />
        <SegmentedOption
          colors={colors}
          title="In Database"
          selected={selectedTheme}
          onPress={() => {
            setSelectedTheme('In Database');
            setLoading(true);
            DBManager.getReportsForSelf().then(results => {
              setReports(results);
              console.log('reports found: ' + results);
              setLoading(false);
            });
          }}
        />
      </View>

      {loading && (
        <View style={styles.loading_indicator}>
          <ActivityIndicator animating={loading} size="large" color={'red'} />
        </View>
      )}

      {selectedTheme === 'Offline' &&
        offlineReports &&
        offlineReports.length === 0 && (
          <View style={styles.offline_card}>
            <Text style={styles.offline_text}>No offline reports!</Text>
            <Text style={styles.offline_subtext}>
              Great job keeping your data up-to-date.
            </Text>
          </View>
        )}

      {selectedTheme === 'Offline' &&
        offlineReports &&
        offlineReports.length !== 0 && (
          <View style={{flex: 1}}>
            <StandardButton
              color={'red'}
              text={'Push offline to database'}
              onPress={async () => {
                const googleResponse = await fetch('https://google.com').catch(
                  () => {},
                );

                if (!googleResponse) {
                  Alert.alert(
                    'No internet connection',
                    'Please connect to the internet to push offline reports',
                  );
                  return;
                }

                for (let i = 0; i < offlineReports.length; i++) {
                  if (DEBUG) {
                    console.log(
                      'in subforms: ' + JSON.stringify(offlineReports[i]),
                    );
                  }
                  const report = offlineReports[i];
                  const {seconds} = report.timestamp;

                  const {error} = await supabase.rpc('add_scout_report', {
                    ...report,
                    timestamp: undefined,
                    competition: undefined,
                    form: undefined,
                  });
                  if (error) {
                    console.error(error);
                    break;
                  }

                  await AsyncStorage.removeItem('form-' + seconds);
                }
                // clear the offline reports
                setOfflineReports([]);
                setParseableReports([]);
                // refresh the reports
                DBManager.getReportsForSelf().then(results => {
                  setReports(results);
                  Toast.show({
                    type: 'success',
                    text1: 'All offline reports have been pushed!',
                  });
                });
              }}
            />
            <ReportList forms={parseableReports} />
          </View>
        )}

      {selectedTheme === 'In Database' && (
        <View style={{flex: 1}}>
          <ReportList forms={reports} />
        </View>
      )}
    </SafeAreaView>
  );
}

export default SubmittedForms;
