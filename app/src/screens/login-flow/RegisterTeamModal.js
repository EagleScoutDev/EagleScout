import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {supabase} from '../../lib/supabase';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {styles} from './styles';
import RadioButtons from '../../components/form/RadioButtons';
import StandardButton from '../../components/StandardButton';

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const RegisterTeamModal = ({navigation}) => {
  const {colors} = useTheme();
  const [team, setTeam] = useState('');
  const [teamOption, setTeamOption] = useState(null);
  const [email, setEmail] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.titleText}>Register your team with EagleScout</Text>
        <View style={{paddingHorizontal: '5%'}}>
          <Text style={styles.label}>
            Are you registering an actual FRC team?
          </Text>
          <View style={{marginBottom: '5%'}}>
            <RadioButtons
              options={[
                'Yes, I am part of an actual FRC team',
                'No, I just want to try the app',
              ]}
              value={teamOption}
              onValueChange={setTeamOption}
              colors={{text: 'white'}}
            />
          </View>
          {teamOption != null && teamOption.substring(0, 1) === 'Y' && (
            <>
              <Text style={styles.label}>Your team number</Text>
              <Spacer />
              <TextInput
                onChangeText={setTeam}
                value={team}
                placeholder="Your team number"
                placeholderTextColor="gray"
                style={styles.input}
                inputMode={'text'}
              />
            </>
          )}
        </View>
        <View style={{paddingHorizontal: '5%'}}>
          <Text style={styles.label}>
            Email (we will use this email to contact you)
          </Text>
          <Spacer />
          <TextInput
            autoCapitalize={'none'}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="gray"
            style={styles.input}
            inputMode={'email'}
          />
        </View>
        <StandardButton
          text={'Register'}
          textColor={
            email === '' ||
            (teamOption != null &&
              teamOption.substring(0, 1) === 'Y' &&
              team === '')
              ? 'dimgray'
              : colors.primary
          }
          disabled={false}
          onPress={async () => {
            if (teamOption == null) {
              Alert.alert(
                'Please select whether you are registering an actual FRC team',
              );
              return;
            }
            if (teamOption.substring(0, 1) === 'Y' && team === '') {
              Alert.alert('Please enter your team number');
              return;
            }
            if (teamOption.substring(0, 1) === 'Y' && isNaN(team)) {
              Alert.alert('Please enter a valid team number');
              return;
            }
            if (email === '') {
              Alert.alert('Please enter your email');
              return;
            }
            let teamVal;
            if (teamOption.substring(0, 1) === 'Y') {
              teamVal = parseInt(team);
            } else {
              teamVal = null;
            }
            const {error} = await supabase
              .from('register_team_requests')
              .insert({
                team: teamVal,
                email: email,
              });
            if (error) {
              console.error(error);
              Alert.alert('Error registering your team', error.toString());
            } else {
              Alert.alert(
                'Success!',
                'We will reach back to you shortly using the email you provided.',
              );
              navigation.navigate('Login');
            }
          }}
        />

        <TouchableOpacity
          style={styles.link_container}
          onPress={() => {
            navigation.navigate('Login');
            setEmail('');
            setTeam('');
            setTeamOption(null);
          }}>
          <Text style={{color: 'gray'}}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link_container}
          onPress={() => {
            navigation.navigate('Sign');
            setEmail('');
            setTeam('');
            setTeamOption(null);
          }}>
          <Text style={{color: 'gray'}}>Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterTeamModal;
