import FormSection from './FormSection';
import {StyleSheet, Text, TextInput} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

function MatchInformation({match, setMatch, team, setTeam, disabled = false}) {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      padding: 10,
      color: colors.text,
    },
    badInput: {
      height: 40,
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
      color: 'red',
    },
    subtitle: {
      textAlign: 'left',
      paddingBottom: 15,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <FormSection
      colors={colors}
      title={'Match Information'}
      disabled={disabled}
      description={'Enter the match and team number.'}>
      <Text style={styles.subtitle}>match number</Text>
      <TextInput
        style={
          match > 100 || match === '0' ? styles.badInput : styles.textInput
        }
        placeholder={'000'}
        placeholderTextColor={'gray'}
        value={match}
        onChangeText={text => setMatch(text)}
        keyboardType={'numeric'}
      />
      {(match > 100 || match === '0') && (
        <Text style={{color: 'red'}}>match number invalid</Text>
      )}
      <Text style={styles.subtitle}>team number</Text>
      <TextInput
        style={styles.textInput}
        placeholder={'000'}
        placeholderTextColor={'gray'}
        value={team}
        onChangeText={text => setTeam(text)}
        keyboardType={'numeric'}
      />
    </FormSection>
  );
}

export default MatchInformation;
