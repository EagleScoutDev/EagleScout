import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {supabase} from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
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

function SignUpModal({setVisible, navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {colors} = useTheme();

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

  return (
    // <Modal animationType={'slide'} visible={visible} transparent={false}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.titleText}>Sign Up</Text>
        <View>
          <>
            <View>
              <MinimalSectionHeader title={'Email'} />
              <TextInput
                autoCapitalize={'none'}
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder="john.doe@team114.org"
                placeholderTextColor={'gray'}
                style={styles.input}
                inputMode={'email'}
              />
              <View style={{height: 30}} />
              <MinimalSectionHeader title={'Password'} />
              <TextInput
                onChangeText={text => setPassword(text)}
                value={password}
                style={styles.input}
                secureTextEntry={true}
              />
              <StandardButton
                text={'Register'}
                textColor={
                  email === '' || password === '' ? 'red' : colors.primary
                }
                disabled={email === '' || password === ''}
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
                }}
              />
            </View>
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
                navigation.navigate('Register new team');
              }}>
              <Text style={{color: 'gray'}}>
                Register your team with EagleScout
              </Text>
            </TouchableOpacity>
          </>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default SignUpModal;
