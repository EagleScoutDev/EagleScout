import React, {useState} from 'react';
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
import {useNavigation, useTheme} from '@react-navigation/native';
import {styles} from './styles';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import {supabase} from '../../lib/supabase';

const ResetPassword = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.titleText}>Reset Password</Text>
        <>
          <View>
            <MinimalSectionHeader title={'Email'} />
            <TextInput
              autoCapitalize={'none'}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholder="john.doe@team114.org"
              placeholderTextColor={'gray'}
              style={{
                ...styles.input,
                borderColor: email === '' ? 'gray' : colors.primary,
              }}
              inputMode={'email'}
            />
            <StandardButton
              text={'Reset Password'}
              textColor={email === '' ? 'dimgray' : colors.primary}
              disabled={email === ''}
              onPress={async () => {
                if (email === '') {
                  console.log('Email cannot be blank.');
                  Alert.alert(
                    'Email cannot be blank.',
                    'Please try again',
                    [
                      {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                      },
                    ],
                    {cancelable: false},
                  );
                  return;
                }
                const {data, error} = await supabase.auth.resetPasswordForEmail(
                  email,
                );
                if (error) {
                  console.log('Error resetting password:', error);
                  Alert.alert(
                    'Error resetting password',
                    'Please try again',
                    [
                      {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  console.log('Password reset email sent');
                  Alert.alert(
                    'Password reset email sent',
                    'Please check your email',
                    [
                      {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Login');
              setEmail('');
            }}>
            <Text style={{color: 'gray'}}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Sign');
              setEmail('');
            }}>
            <Text style={{color: 'gray'}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Register new team');
              setEmail('');
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

export default ResetPassword;
