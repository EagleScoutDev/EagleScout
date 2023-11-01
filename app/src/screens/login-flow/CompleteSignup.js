import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert
} from 'react-native';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

function InputLabel(props) {
  return (
    <Text
      style={{
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 12,
        paddingTop: 10,
      }}>
      {props.visible ? props.title.toUpperCase() : ''}
    </Text>
  );
}

const CompleteSignup = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [team, setTeam] = React.useState('');
  const {colors} = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    input: {
      // center text
      textAlign: 'center',
      // add padding
      padding: 10,
      // add circular border around input field
      borderRadius: 10,
      // add border
      borderWidth: 1,
      borderColor: colors.text,
      // add margin
      // margin: 10,
      // add horizontal space
      marginHorizontal: 30,
      color: colors.text,
    },
    titleText: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.primary,
      marginVertical: 20,
    },
    button: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'red',
    },
  });

  return (
    // <Modal animationType={'slide'} visible={visible} transparent={false}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '8%',
            left: '5%',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text
            style={{
              ...styles.button,
              color: colors.notification,
              fontSize: 20,
            }}>
            {/*TODO: Figure out the elegant react navigation method for doing this.*/}
            {'< Return Back'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 10,
            margin: '5%',
            padding: '5%',
            top: '13%',
            borderWidth: 3,
            borderColor: colors.primary,
            // add drop shadow
            shadowColor: colors.primary,
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.75,
            shadowRadius: 3.84,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: colors.text,
              padding: 10,
            }}>
            Complete Sign Up
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <InputLabel title="First Name" visible={firstName !== ''} />
                <TextInput
                  onChangeText={setFirstName}
                  value={firstName}
                  placeholder="First Name"
                  style={{
                    ...styles.input,
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <InputLabel title="Last Name" visible={lastName !== ''} />
                <TextInput
                  onChangeText={setLastName}
                  value={lastName}
                  placeholder="Last Name"
                  style={{
                    ...styles.input,
                  }}
                />
              </View>
            </View>
            <InputLabel title="Team" visible={team !== ''} />
            <TextInput
              onChangeText={setTeam}
              value={team}
              placeholder="Team"
              style={{
                ...styles.input,
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 10,
              margin: 10,
              marginHorizontal: 30,
            }}
            onPress={async () => {
              const {
                data: {user}
              } = await supabase.auth.getUser();
              const {error: profilesSetError} = await supabase.from('profiles').update({
                first_name: firstName,
                last_name: lastName,
              }).eq('id', user.id);
              if (profilesSetError) {
                console.error(profilesSetError);
                Alert.alert('Unable to set porofile information. Please try logging in again.');
              }
              const {error: registerUserWithTeamError} = await supabase.rpc(
                'register_user_with_team',
                {
                  team_number: team,
                },
              );
              if (registerUserWithTeamError) {
                console.error(registerUserWithTeamError);
                Alert.alert('Unable to register you with the team provided. Please check if the team number is correct.');
              } else {
                await supabase.auth.signOut();
                Alert.alert("You have completed sign up. You will be able to log in when one of the team's captains approve you.");
                navigation.navigate('Login');
              }
            }}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>
              Complete sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
)};

export default CompleteSignup;