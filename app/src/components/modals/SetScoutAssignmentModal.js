import React, {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import StandardModal from './StandardModal';
import SelectMenu from '../form/SelectMenu';
import StandardButton from '../StandardButton';
import {useTheme} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
import {useEffect, useState} from 'react';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

function SetScoutAssignmentModal({
  visible,
  setVisible,
  competition,
  match,
  setNameCb,
}) {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [names, setNames] = useState([]);
  const [existsAssignment, setExistsAssignment] = useState(false);
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    user_name_input: {
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
    button_row: {flexDirection: 'row', justifyContent: 'space-evenly'},
  });

  const searchForUser = async nameArg => {
    if (nameArg === '' || nameArg == null) {
      setNames([]);
      return;
    }
    let namesArray = nameArg.split(' ');
    namesArray = namesArray.filter(element => element !== '');
    const result = "'" + namesArray.join("' & '") + "'";
    const {data, error} = await supabase
      .from('profiles')
      .select('id, name')
      .textSearch('name', result);
    if (error) {
      console.error(error);
    } else {
      setNames(data);
    }
  };

  useEffect(() => {
    if (match != null) {
      setName(match.name);
      setNames([]);
      setUserId(null);
    }
  }, [match, visible]);

  useEffect(() => {
    searchForUser(name).catch(console.error);
  }, [name]);

  useEffect(() => {
    if (userId == null) {
      return;
    }
    for (const nameObj of names) {
      if (nameObj.id === userId) {
        setName(nameObj.name);
        return;
      }
    }
  }, [names, userId]);

  const onSubmit = async () => {
    if (userId == null) {
      Alert.alert('Error', 'Please select a user.');
      return;
    }
    const {error} = await supabase.from('scout_assignments').upsert(
      {
        competition_id: competition.id,
        match_id: match.id,
        user_id: userId,
      },
      {onConflict: 'competition_id, match_id'},
    );
    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to set scout assignment.');
    } else {
      setNameCb(name);
      setVisible(false);
    }
  };

  const deleteScoutAssignment = async () => {
    const {error} = await supabase
      .from('scout_assignments')
      .delete()
      .match({competition_id: competition.id, match_id: match.id});
    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete scout assignment.');
    } else {
      setNameCb(null);
      setVisible(false);
    }
  };

  const onDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this scout assignment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteScoutAssignment(),
        },
      ],
    );
  };

  return (
    <>
      {match && (
        <StandardModal title={'Set scout assignment'} visible={visible}>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Match: {match.match}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Team: {match.teamFormatted}
          </Text>
          <Text style={styles.label_background}>Search for a user</Text>
          <Spacer />
          <TextInput
            style={styles.user_name_input}
            placeholder="User's name"
            onChangeText={text => setName(text)}
            value={name}
          />
          <Spacer />

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
              setSelected={setUserId}
              data={names.map(f => ({
                value: f.name,
                key: f.id,
              }))}
              searchEnabled={false}
              searchPlaceholder={'Search for a user...'}
              placeholder={'Select a user...'}
              notFoundText={'No users found'}
              maxHeight={100}
            />
          </View>

          <Spacer />
          <View style={styles.button_row}>
            <StandardButton
              color={colors.primary}
              onPress={() => setVisible(false)}
              text={'Cancel'}
              width={'40%'}
            />
            <StandardButton
              color={'#29a329'}
              onPress={() => {
                console.log('submitting scout assignment');
                onSubmit().catch(console.error);
              }}
              text={'Submit'}
              width={'40%'}
            />
          </View>
          {match.assignmentExists && (
            <View style={styles.button_row}>
              <StandardButton
                color={'#e60000'}
                onPress={() => {
                  console.log('deleting scout assignment');
                  onDelete();
                }}
                text={'Delete'}
                width={'40%'}
              />
            </View>
          )}
        </StandardModal>
      )}
    </>
  );
}

export default SetScoutAssignmentModal;
