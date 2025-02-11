import {ActivityIndicator, Alert, Text, View} from 'react-native';
import CompetitionsDB, {
  CompetitionReturnData,
} from '../../database/Competitions';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import NoInternet from '../../components/NoInternet';
import {CompetitionList} from './CompetitionList';
import {ExportCompetitionSheet} from './ExportCompetitionSheet';
import {
  exportPitReportsToCsv,
  exportScoutReportsToCsv,
  writeToFile,
} from './export';

const ExportToCSV = () => {
  const {colors} = useTheme();
  const [internetError, setInternetError] = useState(false);
  const [competitionList, setCompetitionList] = useState<
    CompetitionReturnData[]
  >([]);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentCompetition, setCurrentCompetition] =
    useState<CompetitionReturnData | null>();

  const getCompetitions = async () => {
    try {
      const data = await CompetitionsDB.getCompetitions();
      data.sort((a, b) => a.startTime - b.startTime);
      setCompetitionList(data);
      setInternetError(false);
    } catch (error) {
      console.error(error);
      setInternetError(true);
    }
    setCompetitionsLoading(false);
  };

  useEffect(() => {
    getCompetitions();
  }, []);

  if (internetError) {
    return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
  }

  return (
    <>
      {processing && (
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
          <CompetitionList
            competitionList={competitionList}
            competitionsLoading={competitionsLoading}
            processing={processing}
            onCompetitionPress={comp => setCurrentCompetition(comp)}
          />
        </View>
      </View>
      {currentCompetition && (
        <ExportCompetitionSheet
          competitionName={currentCompetition.name}
          onExportScoutReports={async () => {
            setProcessing(true);
            const data = await exportScoutReportsToCsv(currentCompetition);
            if (!data) {
              return;
            }
            await writeToFile(`${currentCompetition.name}.csv`, data);
            setProcessing(false);
          }}
          onExportPitScoutReports={async () => {
            if (!currentCompetition?.pitScoutFormId) {
              Alert.alert(
                'No Pit Scout Form',
                'This competition does not have a pit scout form',
              );
              return;
            }
            setProcessing(true);
            const data = await exportPitReportsToCsv(currentCompetition);
            if (!data) {
              return;
            }
            await writeToFile(`${currentCompetition.name}.csv`, data);
            setProcessing(false);
          }}
          onClose={() => setCurrentCompetition(null)}
        />
      )}
    </>
  );
};

export default ExportToCSV;
