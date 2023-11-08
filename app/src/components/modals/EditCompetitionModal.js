import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import StandardButton from '../StandardButton';
import {supabase} from '../../lib/supabase';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import StandardModal from './StandardModal';

const DEBUG = false;

const EditCompetitionModal = ({setVisible, onRefresh, tempComp}) => {
  const {colors} = useTheme();

  const [name, setName] = useState(tempComp.name);
  const [startDate, setStartDate] = useState(new Date(tempComp.startTime));
  const [editStartDate, setEditStartDate] = useState(false);

  const [endDate, setEndDate] = useState(new Date(tempComp.endTime));
  const [editEndDate, setEditEndDate] = useState(false);

  const changesMade = () => {
    if (name !== tempComp.name) {
      return true;
    }
    if (startDate !== tempComp.startTime) {
      return true;
    }
    if (endDate !== tempComp.endTime) {
      return true;
    }
    return false;
  };

  const updateCompetition = async () => {
    const {data, error} = await supabase
      .from('competitions')
      .update({
        name: name,
        start_time: startDate,
        end_time: endDate,
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 10,
            flex: 0.7,
          }}
          onPress={() => setEditStartDate(true)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Start Date
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colors.border,
            borderRadius: 10,
            padding: 10,
            flex: 1,
          }}
          onPress={() => setEditStartDate(true)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {new Date(startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={editStartDate}
          date={startDate}
          mode={'date'}
          onConfirm={date => {
            setStartDate(date);
            setEditStartDate(false);
          }}
          onCancel={() => {}}
        />
      </View>
      <View style={{height: 20}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 10,
            flex: 0.7,
          }}
          onPress={() => setEditEndDate(true)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            End Date
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colors.border,
            borderRadius: 10,
            padding: 10,
            flex: 1,
          }}
          onPress={() => setEditEndDate(true)}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {new Date(endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={editEndDate}
          date={endDate}
          mode={'date'}
          onConfirm={date => {
            setEndDate(date);
            setEditEndDate(false);
          }}
          onCancel={() => {
            setEditEndDate(false);
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
                'Are you sure you want to delete this competition? This action cannot be undone.',
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
