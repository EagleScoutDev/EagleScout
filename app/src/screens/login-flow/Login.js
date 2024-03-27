import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';

const Login = ({onSubmit, error}) => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        {/*<Text style={styles.titleText}>EagleScout</Text>*/}
        {error !== '' && (
          <View style={styles.error}>
            <Text style={styles.error_text}>{error}</Text>
          </View>
        )}
        <Text style={styles.titleText}>Log In</Text>
        <>
          <View>
            <MinimalSectionHeader title={'Email'} />
            <TextInput
              autoCapitalize={'none'}
              onChangeText={text => setUsername(text)}
              value={username}
              placeholder="john.doe@team114.org"
              placeholderTextColor={'gray'}
              style={{
                ...styles.input,
                borderColor:
                  error === 'auth/missing-email' ||
                  error === 'auth/invalid-email' ||
                  error === 'auth/internal-error'
                    ? 'red'
                    : 'gray',
              }}
              inputMode={'email'}
            />
            <View style={{height: 30}} />
            <MinimalSectionHeader title={'Password'} />
            <TextInput
              onChangeText={text => setPassword(text)}
              value={password}
              style={{
                ...styles.input,
                borderColor:
                  error === 'auth/internal-error' ||
                  error === 'auth/wrong-password'
                    ? 'red'
                    : 'gray',
              }}
              secureTextEntry={true}
            />
            <StandardButton
              text={'Log In'}
              textColor={
                username === '' || password === '' ? 'dimgray' : colors.primary
              }
              disabled={username === '' || password === ''}
              onPress={() => onSubmit(username, password, navigation)}
            />
          </View>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('ResetPassword');
              setUsername('');
              setPassword('');
            }}>
            <Text style={{color: 'gray'}}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Sign');
              setUsername('');
              setPassword('');
            }}>
            <Text style={{color: 'gray'}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Register new team');
              setUsername('');
              setPassword('');
            }}>
            <Text style={{color: 'gray'}}>
              Register your team with EagleScout
            </Text>
          </TouchableOpacity>
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
