import React, { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import StandardModal from '../../components/modals/StandardModal';
import StandardButton from '../../components/StandardButton';
import {useEffect, useState} from 'react';
import {supabase} from '../../lib/supabase';
import CheckBox from 'react-native-check-box';
import TextBox from "../form-creation-flow/components/questions/TextBox";

function AutoAssignModal({visible, setVisible, colors, compId}) {
  const styles = StyleSheet.create({
    button_row: {flexDirection: 'row', justifyContent: 'space-evenly'},
  });
  const [users, setUsers] = useState([]);
  const [usersChecked, setUsersChecked] = useState([]);
  const [usersKey, setUsersKey] = useState(0);
  const [numberOfRounds, setNumberOfRounds] = useState('0');
  const [numberOfRoundsInShift, setNumberOfRoundsInShift] = useState('0');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .then(({data, error}) => {
        if (error) {
          console.error(error);
        } else {
          setUsers(data);
          setUsersChecked(new Array(data.length).fill(false));
        }
      });
    console.log('AutoAssignModal useEffect');
  }, []);

  const onSubmit = () => {
    const numberOfRoundsInt = parseInt(numberOfRounds, 10);
    if (isNaN(numberOfRoundsInt) || numberOfRoundsInt <= 0) {
      Alert.alert(
        'Error',
        'Number of rounds must be a number and greater than 0',
      );
      return;
    }
    const numberOfRoundsInShiftInt = parseInt(numberOfRoundsInShift, 10);
    if (isNaN(numberOfRoundsInShiftInt) || numberOfRoundsInShiftInt <= 0) {
      Alert.alert(
        'Error',
        'Number of rounds in a shift must be a number and greater than 0',
      );
      return;
    }
    if (numberOfRoundsInt < numberOfRoundsInShiftInt) {
      Alert.alert(
        'Error',
        'Number of rounds must be greater than or equal to number of rounds in a shift',
      );
      return;
    }
    const selectedUsers = users.filter((user, idx) => usersChecked[idx]);
    const userIds = selectedUsers.map(user => user.id);
    if (userIds.length < 6) {
      Alert.alert('Error', 'You must select at least 6 users');
      return;
    }
    supabase
      .rpc('assign_rounds', {
        competition_id_arg: compId,
        user_ids: userIds,
        number_of_rounds: numberOfRoundsInt,
        number_of_rounds_in_shift: numberOfRoundsInShiftInt,
      })
      .then(({data, error}) => {
        if (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to auto-assign rounds');
        } else {
          Alert.alert('Success', 'Successfully auto-assigned rounds');
          setVisible(false);
        }
      });
  };

  return (
    <StandardModal title={'Auto-Assign rounds'} visible={visible}>
      <Text>This is the auto assign modal.</Text>
      <ScrollView
        style={{
          maxHeight: '50%',
          width: '100%',
        }}>
        {users.map((user, idx) => {
          return (
            <View
              key={user.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <CheckBox
                  key={usersKey}
                  onClick={() => {
                    let newUsersChecked = usersChecked;
                    newUsersChecked[idx] = !newUsersChecked[idx];
                    setUsersChecked(newUsersChecked);
                    console.log(usersChecked);
                    setUsersKey(usersKey + 1);
                  }}
                  isChecked={usersChecked[idx]}
                />
              </View>
              <Text
                style={{
                  flex: 8,
                }}>
                {user.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <Text>Number of rounds:</Text>
      <TextInput
        onChangeText={setNumberOfRounds}
        value={numberOfRounds}
        style={{
          height: 40,
          width: '100%',
          margin: 5,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        placeholder="Number of rounds"
        keyboardType="numeric"
      />
      <Text>Number of rounds in a shift:</Text>
      <TextInput
        onChangeText={setNumberOfRoundsInShift}
        value={numberOfRoundsInShift}
        style={{
          height: 40,
          width: '100%',
          margin: 5,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
        }}
        placeholder="Number of rounds in a shift:"
        keyboardType="numeric"
      />
      <View style={styles.button_row}>
        <StandardButton
          color={colors.primary}
          onPress={() => setVisible(false)}
          text={'Cancel'}
          width={'40%'}
        />
        <StandardButton
          color={'#29a329'}
          onPress={() => onSubmit()}
          text={'Submit'}
          width={'40%'}
        />
      </View>
    </StandardModal>
  );
}

export default AutoAssignModal;
