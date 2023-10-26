import React, {
  Alert,
  KeyboardAvoidingView,
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
import UserAttributesDB from '../../database/UserAttributes';
import SelectMenu from '../form/SelectMenu';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

function AddCompetitionModal({visible, setVisible, onRefresh}) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [editStartDate, setEditStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [editEndDate, setEditEndDate] = useState(false);
  const {colors} = useTheme();

  const [selectedFormID, setSelectedFormID] = useState(null);

  const [formList, setFormList] = useState([]);

  const getFormIDs = async () => {
    const current_team_id = (await UserAttributesDB.getCurrentUserAttribute())
      .team_id;

    // get form ids
    let {data: forms, error} = await supabase
      .from('forms')
      .select('id, name')
      .eq('team_id', current_team_id);
    setFormList(forms);
  };

  const submitCompetition = async () => {
    // if no form is selected, alert the user
    if (selectedFormID === null) {
      Alert.alert('Error', 'Please select a form to use for this competition.');
      return;
    }
    // if the start date is after (or equal to) the end date, alert the user
    if (startDate >= endDate) {
      Alert.alert('Error', 'Start date must be before end date.');
      return;
    }
    // if the name is empty, alert the user
    if (name === '') {
      Alert.alert('Error', 'Please enter a name for this competition.');
      return;
    }

    const {
      data: {user},
    } = await supabase.auth.getUser();

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
      form_id: selectedFormID,
    });
    const error2 = res.error;
  };

  useEffect(() => {
    setName('');
    setStartDate(new Date());
    setEndDate(new Date());
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
