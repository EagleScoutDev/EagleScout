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
import {useNavigation, useTheme} from '@react-navigation/native';
import {styles} from './styles';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';

const Login = ({onSubmit, error}) => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  const {colors} = useTheme();
  const navigation = useNavigation();

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
              placeholder={'Password'}
              placeholderTextColor={'gray'}
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
