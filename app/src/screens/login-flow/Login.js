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
      // backgroundColor: colors.card,
      borderRadius: 20,

      // borderWidth: 2,
      // borderColor: colors.border,
      // marginHorizontal: '5%',
      // marginVertical: '2%',

      // justifyContent: 'space-evenly',
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={{
          flexDirection: 'column',
          backgroundColor: 'rgb(0,0,25)',
          flex: 1,
        }}>
        {/*<Text style={styles.titleText}>EagleScout</Text>*/}
        {error !== '' && (
          <View
            style={{
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
            }}>
            <Text style={{color: 'white', textAlign: 'center'}}>{error}</Text>
          </View>
        )}
        <Text style={styles.titleText}>Log In</Text>
        <>
          <View>
            <MinimalSectionHeader title={'Email'} />
            <TextInput
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
                username === '' || password === '' ? 'red' : colors.primary
              }
              disabled={username === '' || password === ''}
              onPress={() => onSubmit(username, password, navigation)}
              // color={colors.primary}
            />

            {/*<View*/}
            {/*  style={{*/}
            {/*    flexDirection: 'row',*/}
            {/*    justifyContent: 'space-around',*/}
            {/*    padding: 20,*/}
            {/*  }}>*/}
            {/*  <Text style={{color: colors.text}}>Don't have an account?</Text>*/}
            {/*  <TouchableOpacity*/}
            {/*    onPress={() => {*/}
            {/*      navigation.navigate('Sign');*/}
            {/*    }}>*/}
            {/*    <Text style={{color: colors.primary, fontWeight: 'bold'}}>*/}
            {/*      Register*/}
            {/*    </Text>*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}

            {/*<View*/}
            {/*  style={{*/}
            {/*    flexDirection: 'column',*/}
            {/*    justifyContent: 'space-around',*/}
            {/*    padding: 20,*/}
            {/*  }}>*/}
            {/*  <Text style={{color: colors.text}}>*/}
            {/*    Want to bring the whole team?*/}
            {/*  </Text>*/}
            {/*  <TouchableOpacity*/}
            {/*    onPress={() => {*/}
            {/*      navigation.navigate('Register new team');*/}
            {/*    }}>*/}
            {/*    <Text style={{color: colors.primary, fontWeight: 'bold'}}>*/}
            {/*      Register your team with EagleScout*/}
            {/*    </Text>*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
          </View>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Sign');
            }}>
            <Text style={{color: 'gray'}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Sign');
            }}>
            <Text
              style={{
                color: 'gray',
                // add underline
                // textDecorationLine: 'underline',
                // textDecorationStyle: 'solid',
              }}>
              Register your team with EagleScout
            </Text>
          </TouchableOpacity>
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
