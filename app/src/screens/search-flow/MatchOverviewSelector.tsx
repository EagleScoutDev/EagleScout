import React, {useEffect, useState} from 'react';
import {
  Pressable,
  View,
  TextInput,
  StyleSheet,
  Button,
  Text,
} from 'react-native';
import {SimpleTeam, TBA} from '../../lib/TBAUtils';
import {OrientationChooser} from '../../components/games/OrientationChooser';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ScoutReportReturnData} from '../../database/ScoutReports';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';

const MatchOverviewSelector = () => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    input: {
      textAlign: 'left',
      paddingTop: '5%',
      paddingBottom: '2%',
      borderRadius: 10,
      borderBottomWidth: 1,
      borderColor: 'gray',
      // margin: 10,
      // marginHorizontal: 30,
      color: colors.text,
        paddingLeft:'3%',
    },
    titleText: {
      textAlign: 'left',
      paddingTop: '5%',
      paddingBottom: '1%',
      paddingLeft: '2%',
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      // marginVertical: 20,
    },
    button: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      fontColor: colors.text,
      backgroundColor: colors.primary,
      marginX: '3%',
      marginBottom: '2%',
      borderRadius: 10,
    },
  });

  const navigation = useNavigation();

  const [selectedAlliance, setSelectedAlliance] = useState<string>('Blue');
  const [matchNumber, setMatchNumber] = useState('');
  const [fieldOrientation, setFieldOrientation] = useState('red');
  useEffect(() => {
    if (!matchNumber || Number(matchNumber) > 400) {
      return;
    }
  }, [matchNumber]);

  return (
    <View style={{backgroundColor: colors.card, padding: '3%'}}>
      <Text style={styles.titleText}>Match #: </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={matchNumber}
        onChangeText={text => setMatchNumber(text)}
      />
      {Number.parseInt(matchNumber, 10) === 0 && (
        <Text
          style={{
            color: colors.notification,
            textAlign: 'center',
            paddingTop: '2%',
          }}>
          Match number cannot be 0!
        </Text>
      )}
      {Number(matchNumber) > 400 ? (
        <Text
          style={{
            color: colors.notification,
            textAlign: 'center',
            paddingTop: '2%',
          }}>
          Please Enter Valid Match!
        </Text>
      ) : (
        <View />
      )}

      <Text style={styles.titleText}>Side: </Text>
      <OrientationChooser
        selectedOrientation={fieldOrientation}
        setSelectedOrientation={setFieldOrientation}
        selectedAlliance={selectedAlliance}
        setSelectedAlliance={setSelectedAlliance}
      />
      <Pressable
        onPress={() => {
          navigation.navigate('MatchOverview', {
            matchNumber: Number(matchNumber),
            alliance: selectedAlliance,
          });
        }}>
        <View style={styles.button}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              padding: '2%',
              textAlign: 'center',
              color: colors.text,
            }}>
            Generate Alliance Overview
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
export default MatchOverviewSelector;
