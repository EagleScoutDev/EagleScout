import React, {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import StandardButton from '../StandardButton';
import {supabase} from '../../lib/supabase';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import StandardModal from './StandardModal';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const DEBUG = true;

const EditCompetitionModal = ({setVisible, onRefresh, tempComp}) => {
  const {colors} = useTheme();

  const [name, setName] = useState(tempComp.name);
  const [startTime, setStartTime] = useState(new Date(tempComp.startTime));
  const [endTime, setEndTime] = useState(new Date(tempComp.endTime));

  const changesMade = () => {
    if (name !== tempComp.name) {
      return true;
    }
    if (startTime !== tempComp.startTime) {
      return true;
    }
    if (endTime !== tempComp.endTime) {
      return true;
    }
    return false;
  };

  const styles = StyleSheet.create({
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
    date_row: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  });

  const updateCompetition = async () => {
    const {data, error} = await supabase
      .from('competitions')
      .update({
        name: name,
        start_time: startTime,
        end_time: endTime,
      })
      .eq('id', tempComp.id);

    return error;
  };

  const deleteCompetition = async () => {
    const {data, error} = await supabase
      .from('competitions')
      .delete()
      .eq('id', tempComp.id);
    if (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'There was an error deleting the competition. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (DEBUG) {
                console.log('OK Pressed');
              }
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      if (DEBUG) {
        console.log('deleted competition');
      }
      setVisible(false);
      onRefresh();
    }
  };

  return (
    <StandardModal title={`Edit "${name}"`} visible={true}>
      <TextInput
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          padding: 10,
          borderRadius: 10,
          width: '100%',
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.text,
        }}
        placeholder="Competition Name"
        placeholderTextColor={colors.text}
        onChangeText={text => {
          setName(text);
        }}
        value={name}
      />
      <View style={styles.date_row}>
        <View style={styles.label_background}>
          <Text style={styles.label}>Start Time</Text>
        </View>
      </View>
      <View style={styles.date_row}>
        <RNDateTimePicker
          value={startTime}
          mode={'date'}
          onChange={(event, date) => {
            setStartTime(date);
          }}
        />
        <RNDateTimePicker
          value={startTime}
          mode={'time'}
          onChange={(event, date) => {
            setStartTime(date);
          }}
        />
      </View>
      <View style={styles.date_row}>
        <View style={styles.label_background}>
          <Text style={styles.label}>End Time</Text>
        </View>
      </View>
      <View style={styles.date_row}>
        <RNDateTimePicker
          value={endTime}
          mode={'date'}
          onChange={(event, date) => {
            setEndTime(date);
          }}
        />
        <RNDateTimePicker
          value={endTime}
          mode={'time'}
          onChange={(event, date) => {
            setEndTime(date);
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <StandardButton
            text={'Delete'}
            color={colors.notification}
            width={'40%'}
            onPress={() => {
              Alert.alert(
                'Delete ' + name + '?',
                'Are you sure you want to delete this competition? This action cannot be undone.\nWARNING: This will delete all scout reports for this competition.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      setVisible(false);
                      if (DEBUG) {
                        console.log('Cancel Pressed');
                      }
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: async () => deleteCompetition(),
                  },
                ],
                {cancelable: false},
              );
            }}
          />

          <StandardButton
            text={'Cancel'}
            color={colors.primary}
            width={'40%'}
            onPress={() => setVisible(false)}
          />
        </View>
        <StandardButton
          text={'Save'}
          color={'green'}
          width={'100%'}
          onPress={async () => {
            if (!changesMade()) {
              setVisible(false);
              return;
            }

            if (startTime > endTime) {
              Alert.alert(
                'Error',
                'The start time must be before the end time.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (DEBUG) {
                        console.log('OK Pressed');
                      }
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
              return;
            }

            const error = await updateCompetition();

            if (error) {
              console.error(error);
              Alert.alert(
                'Error',
                'There was an error updating the competition. Please try again.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (DEBUG) {
                        console.log('OK Pressed');
                      }
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
              if (DEBUG) {
                console.log(error);
              }
            } else {
              if (DEBUG) {
                console.log('updated competition');
              }
              setVisible(false);
              onRefresh();
            }
          }}
        />
      </View>
    </StandardModal>
  );
};

export default EditCompetitionModal;
