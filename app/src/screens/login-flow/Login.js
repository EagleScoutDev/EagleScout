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
      padding: '5%',
      // backgroundColor: colors.card,
      borderRadius: 20,

      // borderWidth: 2,
      // borderColor: colors.border,
      // marginHorizontal: '5%',
      // marginVertical: '2%',

      justifyContent: 'space-evenly',
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
              top: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{color: 'white', textAlign: 'center'}}>{error}</Text>
          </View>
        )}
        <Text style={styles.titleText}>Log In</Text>
        <>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 10,
              margin: '5%',
              padding: '5%',

              borderColor: colors.border,
              borderWidth: 4,
              // top: '15%',
            }}>
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
              inputMode={'email'}
            />
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              style={{
                ...styles.input,
                borderColor:
                  error === 'auth/internal-error' ||
                  error === 'auth/wrong-password'
                    ? 'red'
                    : colors.text,
              }}
              secureTextEntry={true}
            />
            <StandardButton
              text={'Log In'}
              onPress={() => onSubmit(username, password, navigation)}
              color={colors.primary}
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
            <Text style={{color: colors.text}}>
              Want to bring the whole team?
            </Text>
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              Register A Team
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Sign');
            }}>
            <Text style={{color: colors.text}}>Don't have an account?</Text>
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              Register
            </Text>
          </TouchableOpacity>
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
