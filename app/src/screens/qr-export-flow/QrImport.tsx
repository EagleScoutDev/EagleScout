import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Code} from 'react-native-vision-camera';
import {QrScannerModal} from '../../components/camera/QrScannerModal';
import StandardButton from '../../components/StandardButton';
import FormHelper from '../../FormHelper';

export const QrImport = () => {
  const {colors} = useTheme();
  const [step, setStep] = useState('scan');
  const [currentData, setCurrentData] = useState<{
    competitionId: number;
    matchNumber: number;
    teamNumber: number;
    data: any[];
    createdAt: string;
  }>();
  const [storedComp, setStoredComp] = useState<{
    id: number;
    name: string;
    formStructure: any[];
  }>();
  useEffect(() => {
    (async () => {
      const comp = await FormHelper.readAsyncStorage(
        FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
      );
      if (comp != null) {
        const parsedComp = JSON.parse(comp);
        if (parsedComp.id !== currentData?.competitionId) {
          return;
        }
        setStoredComp(JSON.parse(comp));
        console.log(comp);
      }
    })();
  }, [currentData]);
  const onCodeScanned = (codes: Code[]) => {
    console.log(codes);
    if (codes.length === 0 || !codes[0].value) {
      return;
    }
    setCurrentData(JSON.parse(codes[0].value));
    setStep('confirm');
  };
  if (!storedComp) {
    return (
      <SafeAreaView style={{flex: 1, alignItems: 'center', gap: 5}}>
        <Text
          style={{
            color: colors.text,
            paddingTop: '10%',
            fontSize: 30,
            fontWeight: 'bold',
          }}>
          No Competition Active
        </Text>
      </SafeAreaView>
    );
  }
  if (step === 'confirm') {
    return (
      <SafeAreaView style={{flex: 1, alignItems: 'center', gap: 5}}>
        <Text
          style={{
            color: colors.text,
            paddingTop: '10%',
            fontSize: 30,
            fontWeight: 'bold',
          }}>
          Confirm Import
        </Text>
        <Text style={{color: colors.text, fontSize: 20}}>
          Competition: {currentData?.competitionId}
        </Text>
        <Text style={{color: colors.text, fontSize: 20}}>
          Match: {currentData?.matchNumber}
        </Text>
        <Text style={{color: colors.text, fontSize: 20, paddingBottom: '5%'}}>
          Team: {currentData?.teamNumber}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <StandardButton
            color="red"
            text="Cancel"
            onPress={() => {
              setCurrentData(undefined);
              setStep('scan');
            }}
            width="40%"
          />
          <StandardButton
            color="green"
            text="Import"
            onPress={async () => {
              await FormHelper.saveFormOffline({
                data: currentData?.data,
                competitionId: currentData?.competitionId,
                matchNumber: currentData?.matchNumber,
                teamNumber: currentData?.teamNumber,
                createdAt: currentData?.createdAt,
                competitionName: storedComp.name,
                formId: storedComp.id,
                formStructure: storedComp.formStructure,
              });
              setStep('scan');
            }}
            width="40%"
          />
        </View>
      </SafeAreaView>
    );
  }
  return <QrScannerModal onCodeScanned={onCodeScanned} />;
};
