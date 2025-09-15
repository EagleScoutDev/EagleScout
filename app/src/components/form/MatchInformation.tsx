import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {OrientationChooser} from '../games/OrientationChooser';

function MatchInformation({
  match,
  setMatch,
  team,
  setTeam,
  teamsForMatch,
  selectedOrientation,
  setSelectedOrientation,
  selectedAlliance,
  setSelectedAlliance,
}) {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    textInput: {
      // height: 40,
      borderColor: 'gray',
      borderBottomWidth: 2,
      // borderRadius: 10,
      // marginBottom: 15,
      padding: 10,
      color: colors.text,
      fontFamily: 'monospace',
      minWidth: '20%',
      textAlign: 'center',
    },
    badInput: {
      // height: 40,
      borderColor: colors.notification,
      borderBottomWidth: 2,
      // borderRadius: 10,
      // marginBottom: 15,
      padding: 10,
      color: colors.notification,
      fontFamily: 'monospace',
      minWidth: '20%',
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'left',
      padding: '2%',
      color: colors.text, //getLighterColor(parseRGB(colors.primary)),
      opacity: 0.6,
      fontWeight: 'bold',
    },
    label: {
      color: colors.text,
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: 16,
      // minWidth: '70%',
    },
    box: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: '3%',
    },
    container: {
      flexDirection: 'column',
      minWidth: '85%',
      backgroundColor: colors.card,
      margin: '2%',
      padding: '2%',
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>MATCH INFORMATION</Text>
      <View style={styles.box}>
        <Text style={styles.label}>Match Number</Text>
        <TextInput
          style={
            match > 400 || Number.parseInt(match, 10) === 0
              ? styles.badInput
              : styles.textInput
          }
          placeholder={'000'}
          maxLength={3}
          placeholderTextColor={'gray'}
          value={match}
          onChangeText={text => setMatch(text)}
          keyboardType={'numeric'}
        />
      </View>
      {Number.parseInt(match, 10) === 0 && (
        <Text style={{color: colors.notification, textAlign: 'center'}}>
          Match number cannot be 0
        </Text>
      )}
      {match > 400 && (
        <Text style={{color: colors.notification, textAlign: 'center'}}>
          Match number cannot be greater than 400
        </Text>
      )}

      <View style={styles.box}>
        <Text style={styles.label}>Team Number</Text>
        <TextInput
          style={styles.textInput}
          placeholder={'000'}
          placeholderTextColor={'gray'}
          maxLength={7}
          value={team}
          onChangeText={text => setTeam(text)}
          keyboardType={'numeric'}
        />
      </View>
      {team !== '' && !teamsForMatch.includes(Number.parseInt(team, 10)) && (
        <Text style={{color: colors.notification, textAlign: 'center'}}>
          Warning: Team {team} is not in this match
        </Text>
      )}
      <OrientationChooser
        selectedOrientation={selectedOrientation}
        setSelectedOrientation={setSelectedOrientation}
        selectedAlliance={selectedAlliance}
        setSelectedAlliance={setSelectedAlliance}
      />
    </View>
  );
}

export default MatchInformation;
