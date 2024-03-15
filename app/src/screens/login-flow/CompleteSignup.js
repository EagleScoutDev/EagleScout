import {useNavigation, useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import {supabase} from '../../lib/supabase';
import StandardButton from '../../components/StandardButton';

function InputLabel(props) {
  return (
    <Text
      style={{
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 12,
        paddingTop: '8%',
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
      textAlign: 'left',
      padding: '5%',
      borderRadius: 10,
      borderBottomWidth: 1,
      borderColor: 'gray',
      // margin: 10,
      // marginHorizontal: 30,
      color: 'white',
    },
    titleText: {
      textAlign: 'left',
      padding: '5%',
      fontSize: 30,
      fontWeight: 'bold',
      color: 'rgb(191, 219, 247)',
      // marginVertical: 20,
    },
    button: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'red',
    },
    link_container: {
      flexDirection: 'row',
      padding: '4%',
      borderRadius: 20,
    },
    background: {
      flexDirection: 'column',
      backgroundColor: 'rgb(0,0,25)',
      flex: 1,
    },
    error: {
      backgroundColor: 'red',
      padding: '5%',
      margin: '3%',
      borderRadius: 10,
      position: 'absolute',
      top: '5%',
      right: '5%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    error_text: {
      color: 'white',
      textAlign: 'center',
    },
  });

  const checkFields = () => {
    if (firstName == '') {
      Alert.alert('First name cannot be empty');
      return false;
    } else if (lastName == '') {
      Alert.alert('Last name cannot be empty');
      return false;
    } else if (team == '') {
      Alert.alert('Team cannot be empty');
      return false;
    }
    return true;
  };

  return (
    // <Modal animationType={'slide'} visible={visible} transparent={false}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <View>
          <Text style={styles.titleText}>Set Up Your Account</Text>
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
          <StandardButton
            text={'Save Changes'}
            textColor={
              firstName === '' || lastName === '' || team === ''
                ? 'dimgray'
                : colors.primary
            }
            disabled={firstName === '' || lastName === '' || team === ''}
            onPress={async () => {
              if (checkFields()) {
                const {
                  data: {user},
                } = await supabase.auth.getUser();
                const {error: profilesSetError} = await supabase
                  .from('profiles')
                  .update({
                    first_name: firstName,
                    last_name: lastName,
                  })
                  .eq('id', user.id);
                if (profilesSetError) {
                  console.error(profilesSetError);
                  Alert.alert(
                    'Unable to set porofile information. Please try logging in again.',
                  );
                }
                const {error: registerUserWithTeamError} = await supabase.rpc(
                  'register_user_with_organization',
                  {
                    organization_number: team,
                  },
                );
                if (registerUserWithTeamError) {
                  console.error(registerUserWithTeamError);
                  Alert.alert(
                    'Unable to register you with the team provided. Please check if the team number is correct.',
                  );
                } else {
                  await supabase.auth.signOut();
                  Alert.alert(
                    "You have completed sign up. You will be able to log in when one of the team's captains approve you.",
                  );
                  navigation.navigate('Login');
                }
              }
            }}
          />
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{color: 'gray'}}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CompleteSignup;
