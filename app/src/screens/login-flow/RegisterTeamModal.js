import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from '../../lib/supabase';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import RadioButtons from '../../components/form/RadioButtons';

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
    label: {
      fontSize: 16,
      paddingTop: 10,
    },
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
          Register your team with EagleScout
        </Text>
        <View>
          <Text style={styles.label}>
            Are you registering an actual FRC team?
          </Text>
          <RadioButtons
            options={[
              'Yes, I am part of an actual FRC team',
              'No, I just want to try the app',
            ]}
            value={teamOption}
            onValueChange={setTeamOption}
            colors={colors}
          />
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
        <View>
          <Text style={styles.label}>
            Email - we will reach back to you on this email
          </Text>
          <Spacer />
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            style={{
              ...styles.input,
            }}
            inputMode={'email'}
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
          }}>
          <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>
            Register your team
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterTeamModal;
