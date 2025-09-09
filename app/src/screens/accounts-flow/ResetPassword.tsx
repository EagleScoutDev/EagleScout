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
import {useTheme} from '@react-navigation/native';
import {styles} from './styles';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import {supabase} from '../../lib/supabase';
import { AccountsScreenProps } from '.';

export interface ResetPasswordProps extends AccountsScreenProps<"ResetPassword"> {

}
export const ResetPassword = ({navigation}: ResetPasswordProps) => {
  const {colors} = useTheme();
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
                const {error} = await supabase.auth.resetPasswordForEmail(
                  email,
                  {
                    redirectTo: 'eaglescout://forgot-password',
                  },
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
            <Text style={styles.text}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link_container}
            onPress={() => {
              navigation.navigate('Signup');
              setEmail('');
            }}>
            <Text style={styles.text}>Create Account</Text>
          </TouchableOpacity>
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
