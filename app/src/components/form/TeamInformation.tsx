import FormSection from './FormSection';
import {StyleSheet, Text, TextInput} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

function TeamInformation({
  team,
  setTeam,
  disabled = false,
}: {
  team: string;
  setTeam: (team: string) => void;
  disabled?: boolean;
}) {
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
    subtitle: {
      textAlign: 'left',
      paddingBottom: 15,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <FormSection colors={colors} title={'Team Information'} disabled={disabled}>
      <Text style={styles.subtitle}>team number</Text>
      <TextInput
        style={styles.textInput}
        placeholder={'000'}
        value={team}
        onChangeText={text => setTeam(text)}
        keyboardType={'numeric'}
      />
    </FormSection>
  );
}

export default TeamInformation;
