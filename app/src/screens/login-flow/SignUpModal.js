import {
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
import {styles} from './styles';
import {supabase} from '../../lib/supabase';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';

function SignUpModal({setVisible, navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {colors} = useTheme();

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
                placeholder={'Password'}
                placeholderTextColor={'gray'}
                value={password}
                style={styles.input}
                secureTextEntry={true}
              />
              <StandardButton
                text={'Register'}
                textColor={
                  email === '' || password === '' ? 'dimgray' : colors.primary
                }
                disabled={email === '' || password === ''}
                onPress={async () => {
                  const {error} = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                      emailRedirectTo: 'eaglescout://confirm-signup',
                    },
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
                setEmail('');
                setPassword('');
              }}>
              <Text style={{color: 'gray'}}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.link_container}
              onPress={() => {
                navigation.navigate('Register new team');
                setEmail('');
                setPassword('');
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
