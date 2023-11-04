import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
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

function SignUpModal({setVisible, navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {colors} = useTheme();

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
            Sign Up
          </Text>
          <View>
            <InputLabel title="Email" visible={email !== ''} />
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              style={{
                ...styles.input,
              }}
              inputMode={'email'}
            />
            <InputLabel title="Password" visible={password !== ''} />
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              style={{
                ...styles.input,
              }}
              secureTextEntry={true}
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
              const {error} = await supabase.auth.signUp({
                email: email,
                password: password,
              });
              if (error) {
                console.error(error);
                Alert.alert('Error signing up', error.toString());
              } else {
                Alert.alert(
                  'Success!',
                  'You received an email to confirm your account. Please follow the instructions in the email for next steps.',
                );
                navigation.navigate('Login');
              }
            }}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SignUpModal;
