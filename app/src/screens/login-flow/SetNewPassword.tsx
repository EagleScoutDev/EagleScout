import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {styles} from './styles';
import StandardButton from '../../components/StandardButton';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import {supabase} from '../../lib/supabase';
import {SetNewPasswordProps} from './types';

const SetNewPassword = ({navigation}: SetNewPasswordProps) => {
  const {colors} = useTheme();
  const [password, setPassword] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.titleText}>Set New Password</Text>
        <>
          <View>
            <MinimalSectionHeader title={'New Password'} />
            <TextInput
              onChangeText={text => setPassword(text)}
              value={password}
              placeholder={'Password'}
              placeholderTextColor={'gray'}
              style={{
                ...styles.input,
                borderColor: password === '' ? 'gray' : colors.primary,
              }}
              secureTextEntry={true}
            />
            <StandardButton
              text={'Set New Password'}
              textColor={password === '' ? 'dimgray' : colors.primary}
              disabled={password === ''}
              onPress={async () => {
                if (password === '') {
                  Alert.alert(
                    'Password cannot be blank.',
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
                const {error} = await supabase.auth.updateUser({
                  password,
                });
                if (error) {
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
                  Alert.alert(
                    'Successfully reset password',
                    'Please log in again to continue',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          supabase.auth.signOut();
                          navigation.navigate('Login');
                          setPassword('');
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }}
            />
          </View>
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SetNewPassword;
