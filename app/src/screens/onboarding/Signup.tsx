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
import React, { useMemo, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { styles } from './styles';
import { supabase } from '../../lib/supabase';
import { MinimalSectionHeader } from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';
import { type OnboardingScreenProps } from '.';

export interface SignupProps extends OnboardingScreenProps<"Signup"> {

}
export const Signup = ({ navigation }: SignupProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const formComplete = useMemo(() => email !== '' || password !== '' || confirmPassword !== '', [email, password, confirmPassword])

    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.background}>
                <Text style={styles.titleText}>Sign Up</Text>
                <View>
                    <View>
                        <MinimalSectionHeader title="Email" />
                        <TextInput
                            inputMode="email"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            value={email}
                            placeholder="john.doe@team114.org"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />
                        <View style={{ height: 30 }} />
                        <MinimalSectionHeader title="Password" />
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Password"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />
                        <MinimalSectionHeader title={'Confirm Password'} />
                        <TextInput
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="gray"
                            style={styles.input}
                        />

                        <StandardButton
                            text="Register"
                            textColor={formComplete ? 'dimgray' : colors.primary }
                            disabled={!formComplete}
                            onPress={async () => {
                                if(password !== confirmPassword) {
                                    Alert.alert(
                                        'Passwords do not match',
                                        'Please try again',
                                        [{
                                            text: 'OK',
                                            onPress: () => console.log('OK Pressed'),
                                        }],
                                        { cancelable: false },
                                    );
                                    return;
                                }

                                const { error } = await supabase.auth.signUp({
                                    email: email,
                                    password: password,
                                    options: {
                                        emailRedirectTo: 'eaglescout://confirm-signup',
                                    },
                                })
                                if(error) {
                                    console.error(error);
                                    Alert.alert('Error signing up', error.toString());
                                }
                                else {
                                    Alert.alert(
                                        'Success!',
                                        'You received an email to confirm your account. Please follow the instructions in the email for next steps.',
                                    )
                                    navigation.navigate('Login')
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
                        <Text style={styles.text}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
