import {useTheme} from '@react-navigation/native';
import React from 'react';
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
import {styles} from './styles';
import {supabase} from '../../lib/supabase';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import {CompleteSignUpProps} from './types';

const CompleteSignup = ({navigation}: CompleteSignUpProps) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [team, setTeam] = React.useState('');
  const {colors} = useTheme();

  return (
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
                <MinimalSectionHeader title="First Name" />
                <TextInput
                  onChangeText={setFirstName}
                  value={firstName}
                  placeholder="First Name"
                  placeholderTextColor="gray"
                  style={styles.input}
                />
              </View>
              <View style={{flex: 1}}>
                <MinimalSectionHeader title="Last Name" />
                <TextInput
                  onChangeText={setLastName}
                  value={lastName}
                  placeholder="Last Name"
                  placeholderTextColor="gray"
                  style={styles.input}
                />
              </View>
            </View>
            <MinimalSectionHeader title="Team" />
            <TextInput
              onChangeText={setTeam}
              value={team}
              placeholder="Team"
              placeholderTextColor="gray"
              style={styles.input}
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
              const {
                data: {user},
              } = await supabase.auth.getUser();
              if (!user) {
                console.error('No user found');
                Alert.alert(
                  'Error setting profile',
                  'Unable to set profile information. Please try logging in again.',
                );
                return;
              }
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
                  'Error setting profile',
                  'Unable to set profile information. Please try logging in again.',
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
                  'Error registering with team',
                  'Unable to register you with the team provided. Please check if the team number is correct.',
                );
              } else {
                await supabase.auth.signOut();
                Alert.alert(
                  'Sign up complete!',
                  "You have completed sign up. You will be able to log in when one of the team's captains approve you.",
                );
                navigation.navigate('Login');
              }
            }}
          />
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.text}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CompleteSignup;
