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
  const [tbakey, settbakey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    settbakey('');
  }, [visible]);

  const submit = async () => {
    const {error: fetchTbaEventError} = await supabase.functions.invoke(
      'fetch-tba-event',
      {
        body: {tbakey: tbakey},
      },
    );
    if (fetchTbaEventError) {
      return false;
    }
    const {data: eventData, error: eventError} = await supabase
      .from('tba_events')
      .select('id')
      .eq('event_key', tbakey)
      .single();
    if (eventError) {
      return false;
    }
    const {error} = await supabase
      .from('competitions')
      .update({
        scout_assignments_enabled: true,
        tba_event_id: eventData.id,
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
    <StandardModal title={'Enable Scout Asignments'} visible={visible}>
      <Text style={styles.label}>The event's The Blue Alliance key</Text>
      <Spacer />
      <TextInput
        style={styles.tbakey_input}
        placeholder="TBA Key"
        onChangeText={text => settbakey(text)}
        value={tbakey}
      />

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
          text={'Submit'}
          width={'40%'}
        />
      </View>
    </StandardModal>
  );
}

export default EnableScoutAssignmentsModal;
