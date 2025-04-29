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
import {ColorChooser} from '../../components/games/OrientationChooser';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ScoutReportReturnData} from '../../database/ScoutReports';

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
      paddingLeft: '3%',
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
  const [error, setError] = useState('');
  useEffect(() => {
    if (!matchNumber || Number(matchNumber) > 400) {
      return;
    }
  }, [matchNumber]);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        padding: '3%',
        position: 'relative',
      }}>
      <Text style={styles.titleText}>Match #: </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={matchNumber}
        onChangeText={text => setMatchNumber(text)}
      />

      <View />
      <Text style={styles.titleText}>Side: </Text>
      <View>
        <ColorChooser
          selectedColor={selectedAlliance}
          setSelectedColor={setSelectedAlliance}
        />
      </View>

      {error && (
        <Text style={{color: colors.notification, paddingVertical: 9}}>
          {error}
        </Text>
      )}
      <Pressable
        onPress={() => {
          if (!Number) {
            setError('Please enter a match number!');
            return;
          }
          if (Number(matchNumber) < 0 || Number(matchNumber) > 400) {
            setError('Match number must be between 1 and 400!');
            return;
          }
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
