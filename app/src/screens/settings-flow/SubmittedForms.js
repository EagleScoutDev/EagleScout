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
import ReportList from '../../components/ReportList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import SegmentedOption from '../../components/pickers/SegmentedOption';
import DBManager from '../../DBManager';
import React from 'react-native';
import StandardButton from '../../components/StandardButton';
import Toast from 'react-native-toast-message';
import ScoutReportsDB from '../../database/ScoutReports';
import CompetitionsDB from '../../database/Competitions';

const DEBUG = false;

function SubmittedForms() {
  const [reports, setReports] = useState([]);
  const [offlineReports, setOfflineReports] = useState([]);
  const {colors} = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('Offline');
  const [loading, setLoading] = useState(false);

  async function getOfflineReports() {
    const allOffline = await AsyncStorage.getAllKeys();
    if (DEBUG) {
      console.log('all offline: ' + allOffline);
    }
    const offReports = allOffline.filter(key => key.startsWith('form-'));
    if (DEBUG) {
      console.log('offline reports: ' + offReports);
    }

    const formsFound = [];
    for (let i = 0; i < offReports.length; i++) {
      const report = await AsyncStorage.getItem(offReports[i]);
      if (DEBUG) {
        console.log('report: ' + report);
      }
      formsFound.push(JSON.parse(report));
      console.log(JSON.parse(report));
    }
    setOfflineReports(formsFound);
  }

  useEffect(() => {
    setLoading(true);
    ScoutReportsDB.getReportsForSelf().then(result => {
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
      color: colors.text,
      fontWeight: 'bold',
    },
    offline_subtext: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.text,
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
            ScoutReportsDB.getReportsForSelf().then(results => {
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
                const internetResponse =
                  await CompetitionsDB.getCurrentCompetition()
                    .then(() => true)
                    .catch(() => false);

                if (!internetResponse) {
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
                  const utcMilliseconds = new Date(
                    report.createdAt,
                  ).getUTCMilliseconds();

                  try {
                    await ScoutReportsDB.createOfflineScoutReport({
                      ...report,
                      form: undefined,
                      formId: undefined,
                    });
                    Toast.show({
                      type: 'success',
                      text1: 'Scouting report submitted!',
                      visibilityTime: 3000,
                    });
                  } catch (error) {
                    console.error(error);
                    break;
                  }

                  await AsyncStorage.removeItem('form-' + utcMilliseconds);
                }
                // clear the offline reports
                setOfflineReports([]);
                // refresh the reports
                ScoutReportsDB.getReportsForSelf().then(results => {
                  setReports(results);
                  Toast.show({
                    type: 'success',
                    text1: 'All offline reports have been pushed!',
                  });
                });
              }}
            />
            <ReportList reports={offlineReports} isOffline={true} />
          </View>
        )}

      {selectedTheme === 'In Database' && (
        <View style={{flex: 1}}>
          <ReportList reports={reports} isOffline={false} />
        </View>
      )}
    </SafeAreaView>
  );
}

export default SubmittedForms;
