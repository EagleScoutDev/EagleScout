import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useTheme} from '@react-navigation/native';
import StandardButton from '../../components/StandardButton';
const Login = ({onSubmit, error, ifAuth}) => {
  let [username, setUsername] = useState();
  let [password, setPassword] = useState();
  const {colors} = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('authenticated').then(r => {
      if (r) {
        console.log('Login page redirecting to Scout Report...');
        // navigation.navigate('Scout Report');
        ifAuth();
      }
    });
  });

  const styles = StyleSheet.create({
    input: {
      textAlign: 'center',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.text,
      margin: 10,
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
    <SafeAreaView style={{flexDirection: 'column'}}>
      <Text style={styles.titleText}>EagleScout</Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          margin: '5%',
          padding: '5%',
          top: '15%',
          borderWidth: 3,
          borderColor: colors.primary,
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
          Log In
        </Text>
        <TextInput
          onChangeText={setUsername}
          value={username}
          placeholder="Email"
          style={{
            ...styles.input,
            borderColor:
              error === 'auth/missing-email' ||
              error === 'auth/invalid-email' ||
              error === 'auth/internal-error'
                ? 'red'
                : colors.text,
          }}
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          style={{
            ...styles.input,
            borderColor:
              error === 'auth/internal-error' || error === 'auth/wrong-password'
                ? 'red'
                : colors.text,
          }}
          secureTextEntry={true}
        />
        <StandardButton
          text={'Log In'}
          onPress={() => onSubmit(username, password)}
          color={colors.primary}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 20,
          }}>
          <Text style={{color: colors.text}}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Sign');
            }}>
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {error !== '' && (
        <View
          style={{
            backgroundColor: 'red',
            padding: '5%',
            margin: '3%',
            borderRadius: 10,
            position: 'absolute',
            top: '130%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Login;
