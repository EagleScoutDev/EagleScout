import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {EnterTeamEmailProps} from '../types';
import UserAttributes from '../../../database/UserAttributes';
import {styles} from '../styles';
import MinimalSectionHeader from '../../../components/MinimalSectionHeader';
import StandardButton from '../../../components/StandardButton';
import {supabase} from '../../../lib/supabase';
import {useTheme} from '@react-navigation/native';

export const EnterTeamEmail = ({navigation}: EnterTeamEmailProps) => {
  const {colors} = useTheme();
  const [orgId, setOrgId] = useState<number | null>();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    UserAttributes.getCurrentUserAttribute().then(r => {
      if (r) {
        setOrgId(r.organization_id);
      }
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.background}>
        <View>
          <Text style={styles.titleText}>Enter Team Email</Text>
          <View>
            <MinimalSectionHeader title="Team Email" />
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="dev@team114.org"
              placeholderTextColor="gray"
              style={styles.input}
            />
          </View>
          <StandardButton
            text={'Next'}
            textColor={email === '' ? 'dimgray' : colors.primary}
            disabled={email === ''}
            onPress={async () => {
              const {error: orgEmailError} = await supabase
                .from('organizations')
                .update({
                  email,
                })
                .eq('id', orgId);
              if (orgEmailError) {
                console.error(orgEmailError);
                Alert.alert(
                  'Error setting team email',
                  'Unable to set team email. Please try again later.',
                );
              }
              const {error: userAdminError} = await supabase
                .from('user_attributes')
                .update({
                  scouter: true,
                  admin: true,
                })
                .eq('id', (await UserAttributes.getCurrentUserAttribute()).id);
              if (userAdminError) {
                console.error(userAdminError);
                Alert.alert(
                  'Error making you an admin',
                  'Unable to make you an admin. Please try again later.',
                );
              }
              // todo: navigate to home screen, without requiring another login
              navigation.navigate('Login');
              Alert.alert(
                'Success!',
                'Please log in again to start using Eaglescout',
              );
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
