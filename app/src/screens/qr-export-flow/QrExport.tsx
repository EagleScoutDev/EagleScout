import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StandardButton from '../../components/StandardButton';
import {useTheme} from '@react-navigation/native';

interface OfflineReport {
  form: any[];
  formId: string;
  data: any[];
  matchNumber: number;
  teamNumber: number;
  competitionId: string;
  competitionName: string;
  createdAt: string;
}

const Card = ({children}: {children: React.ReactNode}) => (
  <View
    style={{
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    }}>
    {children}
  </View>
);

export const QrExport = () => {
  const [offlineReports, setOfflineReports] = useState<OfflineReport[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {colors} = useTheme();

  const getOfflineReports = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const offReports = keys.filter(key => key.includes('form-'));

    const offlineReportData = await AsyncStorage.multiGet(offReports);
    setOfflineReports(
      offlineReportData
        .map(
          report =>
            report != null &&
            (JSON.parse(report[1] as string) as OfflineReport),
        )
        .filter(Boolean) as OfflineReport[],
    );
  };

  useEffect(() => {
    getOfflineReports();
  }, []);

  useEffect(() => {
    if (offlineReports.length === 0) {
      return;
    }
    const formKey = new Date(
      offlineReports[currentIndex].createdAt,
    ).getUTCMilliseconds();
    console.log('deleting', `form-${formKey}`);
    AsyncStorage.removeItem(`form-${formKey}`);
    AsyncStorage.setItem(
      `imported-${formKey}`,
      JSON.stringify(offlineReports[currentIndex]),
    );
  }, [currentIndex, offlineReports]);

  if (offlineReports.length === 0) {
    return (
      <View>
        <Text>No offline reports found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Card>
        <Text style={{color: colors.text}}>
          Team: {offlineReports[currentIndex].teamNumber}
        </Text>
        <Text style={{color: colors.text}}>
          Match: {offlineReports[currentIndex].matchNumber}
        </Text>
        <QRCodeStyled
          data={JSON.stringify({
            competitionId: offlineReports[currentIndex].competitionId,
            matchNumber: offlineReports[currentIndex].matchNumber,
            teamNumber: offlineReports[currentIndex].teamNumber,
            data: offlineReports[currentIndex].data,
            createdAt: offlineReports[currentIndex].createdAt,
          })}
        />
      </Card>
      {currentIndex < offlineReports.length - 1 && (
        <StandardButton
          color={colors.primary}
          text={'Next'}
          onPress={() => {
            setCurrentIndex(currentIndex + 1);
          }}
        />
      )}
      <Text
        style={{
          color: colors.text,
          opacity: 0.5,
          textAlign: 'center',
          marginHorizontal: 20,
        }}>
        Note: You will not be able to revisit this QR code after you press next
        or leave this page
      </Text>
    </SafeAreaView>
  );
};
