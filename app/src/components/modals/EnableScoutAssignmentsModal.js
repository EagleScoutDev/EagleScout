import React, {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import StandardButton from '../StandardButton';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import StandardModal from './StandardModal';
import {supabase} from '../../lib/supabase';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

function EnableScoutAssignmentsModal({
  visible,
  setVisible,
  competition,
  onRefresh,
}) {
  const {colors} = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const {error} = await supabase
      .from('competitions')
      .update({
        scout_assignments_enabled: true,
      })
      .eq('id', competition.id);
    return !error;
  };

  const styles = StyleSheet.create({
    tbakey_input: {
      // height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      width: '100%',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: colors.text,
      fontSize: 18,
    },
    label: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    button_row: {flexDirection: 'row', justifyContent: 'space-evenly'},
  });

  return (
    <StandardModal title={'Enable Scout Assignments?'} visible={visible}>
      <Spacer />
      <View style={styles.button_row}>
        <StandardButton
          color={colors.notification}
          onPress={() => setVisible(false)}
          text={'Cancel'}
          width={'40%'}
        />
        <StandardButton
          color={colors.primary}
          isLoading={isSubmitting}
          onPress={() => {
            setIsSubmitting(true);
            submit().then(success => {
              setIsSubmitting(false);
              if (success) {
                onRefresh();
                setVisible(false);
              } else {
                Alert.alert(
                  'Error',
                  'There was an error enabling scout assignments. Please check if the TBA key is correct.',
                );
              }
            });
          }}
          text={'Yes'}
          width={'40%'}
        />
      </View>
    </StandardModal>
  );
}

export default EnableScoutAssignmentsModal;
