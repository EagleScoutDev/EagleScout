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
    },
    titleText: {
      textAlign: 'left',
      padding: '5%',
      fontSize: 30,
      fontWeight: 'bold',
      color: 'colors.text',
      // marginVertical: 20,
    },
    button: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      fontColor: colors.text,
      color: colors.primary,
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
    <View style={{backgroundColor: colors.card}}>
      <Text style={styles.titleText}>Match #: </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={matchNumber}
        onChangeText={text => setMatchNumber(text)}
      />
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
        <View>
          <Text style={styles.titleText}>Generate Alliance Overview</Text>
        </View>
      </Pressable>
    </View>
  );
};
export default MatchOverviewSelector;
