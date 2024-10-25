import React, {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import StandardButton from '../StandardButton';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import StandardModal from './StandardModal';
import {supabase} from '../../lib/supabase';
import SelectMenu from '../form/SelectMenu';
import {getLighterColor} from '../../lib/ColorReadability';
import {FunctionsHttpError} from '@supabase/supabase-js';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

function AddCompetitionModal({visible, setVisible, onRefresh}) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const {colors} = useTheme();

  const [selectedFormID, setSelectedFormID] = useState(null);

  const [formList, setFormList] = useState([]);
  const [tbakey, settbakey] = useState('');

  const [showStartDate, setShowStartDate] = useState(Platform.OS === 'ios');
  const [showStartTime, setShowStartTime] = useState(Platform.OS === 'ios');
  const [showEndDate, setShowEndDate] = useState(Platform.OS === 'ios');
  const [showEndTime, setShowEndTime] = useState(Platform.OS === 'ios');

  const getFormIDs = async () => {
    // get form ids
    let {data: forms, error} = await supabase.from('forms').select('id, name');
    if (error) {
      console.error('Failed to get forms');
      console.error(error);
    } else {
      setFormList(forms);
    }
  };

  const submitCompetition = async () => {
    // if no form is selected, alert the user
    if (selectedFormID == null) {
      Alert.alert('Error', 'Please select a form to use for this competition.');
      return false;
    }
    // if the start time is after (or equal to) the end time, alert the user
    if (startTime >= endTime) {
      Alert.alert('Error', 'Start time must be before end time.');
      return false;
    }
    // if the name is empty, alert the user
    if (name === '') {
      Alert.alert('Error', 'Please enter a name for this competition.');
      return false;
    }

    const {error: fetchTbaEventError} = await supabase.functions.invoke(
      'fetch-tba-event',
      {
        body: {tbakey: tbakey},
      },
    );
    if (fetchTbaEventError) {
      if (fetchTbaEventError instanceof FunctionsHttpError) {
        const errorMessage = await fetchTbaEventError.context.json();
        Alert.alert('Error', errorMessage.message);
      } else {
        Alert.alert(
          'Error',
          'An unknown error has occurred. Try again or contact support.',
        );
      }
      return false;
    }
    const {data: eventData, error: eventError} = await supabase
      .from('tba_events')
      .select('id')
      .eq('event_key', tbakey)
      .single();
    if (eventError) {
      Alert.alert('Error', 'Failed to get TBA key from events in database');
      return false;
    }

    const {error} = await supabase.from('competitions').insert({
      name: name,
      start_time: startTime,
      end_time: endTime,
      form_id: selectedFormID,
      tba_event_id: eventData.id,
    });
    return error == null;
  };

  useEffect(() => {
    setName('');
    setSelectedFormID(null);
    getFormIDs();
  }, [visible]);

  const styles = StyleSheet.create({
    competition_name_input: {
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
    label_background: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 10,
      flex: 0.7,
    },
    date_background: {
      backgroundColor: colors.border,
      borderRadius: 10,
      padding: 10,
      flex: 1,
      marginLeft: 5,
    },
    date: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
    },
    date_row: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    button_row: {flexDirection: 'row', justifyContent: 'space-evenly'},
  });

  return (
    <StandardModal title={'Add Competition'} visible={visible}>
      <TextInput
        style={styles.competition_name_input}
        placeholder="Name"
        placeholderTextColor={colors.text}
        onChangeText={text => setName(text)}
        value={name}
      />
      <View style={styles.date_row}>
        <View style={styles.label_background}>
          <Text style={styles.label}>Start Time</Text>
        </View>
      </View>
      <View style={styles.date_row}>
        {Platform.OS !== 'ios' && (
          <TouchableOpacity
            style={styles.date_background}
            onPress={() => setShowStartDate(true)}>
            <Text style={styles.date}>
              {startTime.toLocaleDateString('en-US')}
            </Text>
          </TouchableOpacity>
        )}
        {Platform.OS !== 'ios' && (
          <TouchableOpacity
            style={styles.date_background}
            onPress={() => setShowStartTime(true)}>
            <Text style={styles.date}>
              {startTime.toLocaleTimeString('en-US')}
            </Text>
          </TouchableOpacity>
        )}
        {showStartDate && (
          <RNDateTimePicker
            value={startTime}
            mode={'date'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowStartDate(false);
              }
              if (event.type === 'set') {
                setStartTime(date);
              }
            }}
          />
        )}
        {showStartTime && (
          <RNDateTimePicker
            value={startTime}
            mode={'time'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowStartTime(false);
              }
              if (event.type === 'set') {
                setStartTime(date);
              }
            }}
          />
        )}
      </View>
      <View style={styles.date_row}>
        <View style={styles.label_background}>
          <Text style={styles.label}>End Time</Text>
        </View>
      </View>
      <View style={styles.date_row}>
        {Platform.OS !== 'ios' && (
          <TouchableOpacity
            style={styles.date_background}
            onPress={() => setShowEndDate(true)}>
            <Text style={styles.date}>
              {endTime.toLocaleDateString('en-US')}
            </Text>
          </TouchableOpacity>
        )}
        {Platform.OS !== 'ios' && (
          <TouchableOpacity
            style={styles.date_background}
            onPress={() => setShowEndTime(true)}>
            <Text style={styles.date}>
              {endTime.toLocaleTimeString('en-US')}
            </Text>
          </TouchableOpacity>
        )}
        {showEndDate && (
          <RNDateTimePicker
            value={endTime}
            mode={'date'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowEndDate(false);
              }
              if (event.type === 'set') {
                setEndTime(date);
              }
            }}
          />
        )}
        {showEndTime && (
          <RNDateTimePicker
            value={endTime}
            mode={'time'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowEndTime(false);
              }
              if (event.type === 'set') {
                setEndTime(date);
              }
            }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          zIndex: 100,
          // align with competition name input
          marginTop: 10,
        }}>
        <SelectMenu
          setSelected={setSelectedFormID}
          data={formList.map(f => ({
            value: f.name,
            key: f.id,
          }))}
          searchEnabled={false}
          searchPlaceholder={'Search for a form...'}
          placeholder={'Select a form...'}
          maxHeight={100}
        />
      </View>

      <Spacer />
      <Text style={styles.label}>The event's The Blue Alliance key</Text>
      <Spacer />
      <TextInput
        style={styles.competition_name_input}
        placeholder="TBA Key"
        onChangeText={text => settbakey(text)}
        value={tbakey}
      />

      <Spacer />
      <View style={styles.button_row}>
        <StandardButton
          textColor={colors.notification}
          color={colors.background}
          onPress={() => setVisible(false)}
          text={'Cancel'}
          width={'40%'}
        />
        <StandardButton
          color={colors.primary}
          onPress={() => {
            submitCompetition().then(success => {
              if (success) {
                setVisible(false);
                onRefresh();
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

export default AddCompetitionModal;
