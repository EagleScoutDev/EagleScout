import {
  Alert,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {supabase} from '../../lib/supabase';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import RadioButtons from '../../components/form/RadioButtons';
import StandardButton from '../../components/StandardButton';

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

function Spacer() {
  return <View style={{height: '2%'}} />;
}

const RegisterTeamModal = ({navigation}) => {
  const {colors} = useTheme();
  const [team, setTeam] = useState('');
  const [teamOption, setTeamOption] = useState(null);
  const [email, setEmail] = useState('');

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
    label: {
      color: 'gray',
      fontWeight: 'bold',
      fontSize: 12,
      paddingTop: 10,
    },
  });

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
                style={{
                  ...styles.input,
                }}
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
            placeholderTextColor={'gray'}
            style={{
              ...styles.input,
            }}
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
          }}>
          <Text style={{color: 'gray'}}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link_container}
          onPress={() => {
            navigation.navigate('Sign');
          }}>
          <Text style={{color: 'gray'}}>Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterTeamModal;
