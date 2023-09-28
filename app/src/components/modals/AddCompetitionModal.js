import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import StandardButton from '../StandardButton';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import StandardModal from './StandardModal';
import {supabase} from '../../lib/supabase';

function Spacer() {
  // eslint-disable-next-line react-native/no-inline-styles
  return <View style={{height: '2%'}} />;
}

function AddCompetitionModal({visible, setVisible, onRefresh}) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [editStartDate, setEditStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [editEndDate, setEditEndDate] = useState(false);
  const {colors} = useTheme();

  const submitCompetition = async () => {
    // console.log('competition name: ' + name);
    // console.log('start date: ' + startDate);
    // console.log('end date: ' + endDate);

    const {
      data: {user},
    } = await supabase.auth.getUser();
    // console.log('user', user.id);

    let {data: user_attributes, error} = await supabase
      .from('user_attributes')
      .select('team_id')
      .eq('id', user.id);

    // console.log('user_attributes', user_attributes);
    const {team_id} = user_attributes[0];
    // console.log('final team id: ', team_id);

    const res = await supabase.from('competitions').insert({
      team_id: team_id,
      name: name,
      start_time: startDate,
      end_time: endDate,
    });
    const error2 = res.error;
  };

  useEffect(() => {
    setName('');
    setStartDate(new Date());
    setEndDate(new Date());
  }, [visible]);

  const styles = StyleSheet.create({
    competition_name_input: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      width: '100%',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: colors.text,
      fontSize: 20,
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
        onChangeText={text => setName(text)}
        value={name}
      />
      <Spacer />
      <View style={styles.date_row}>
        <View
          style={styles.label_background}
          onPress={() => setEditStartDate(true)}>
          <Text style={styles.label}>Start Date</Text>
        </View>
        <TouchableOpacity
          style={styles.date_background}
          onPress={() => setEditStartDate(true)}>
          <Text style={styles.date}>
            {startDate.toLocaleDateString('en-US', {
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
          onCancel={() => {
            setEditStartDate(false);
          }}
        />
      </View>
      <Spacer />
      <View style={styles.date_row}>
        <View
          style={styles.label_background}
          onPress={() => setEditEndDate(true)}>
          <Text style={styles.label}>End Date</Text>
        </View>
        <TouchableOpacity
          style={styles.date_background}
          onPress={() => setEditEndDate(true)}>
          <Text style={styles.date}>
            {endDate.toLocaleDateString('en-US', {
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
          onPress={() => {
            submitCompetition().then(() => onRefresh());
            setVisible(false);
          }}
          text={'Submit'}
          width={'40%'}
        />
      </View>
    </StandardModal>
  );
}

export default AddCompetitionModal;
