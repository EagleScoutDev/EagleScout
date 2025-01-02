import React, {StyleSheet, TextInput, View, Alert} from 'react-native';
import StandardButton from '../../components/StandardButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import {supabase} from '../../lib/supabase';

function EditProfile({navigation, route, getUser}) {
  const {initialFirstName, initialLastName} = route.params;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isLoading, setIsLoading] = useState(false);

  const {colors} = useTheme();
  const styles = StyleSheet.create({
    text_input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      width: '100%',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: colors.text,
    },
    button_row: {flexDirection: 'row', justifyContent: 'space-evenly'},
  });

  return (
    <View>
      <View style={{width: '80%', alignSelf: 'center', marginTop: '5%'}}>
        <MinimalSectionHeader title={'First Name'} />
        <TextInput
          style={styles.text_input}
          onChangeText={text => setFirstName(text)}
          value={firstName}
          defaultValue={initialFirstName}
        />
        <MinimalSectionHeader title={'Last Name'} />
        <TextInput
          style={styles.text_input}
          onChangeText={text => setLastName(text)}
          value={lastName}
          defaultValue={initialLastName}
        />
      </View>
      <View style={styles.button_row}>
        <StandardButton
          color={
            firstName === initialFirstName && lastName === initialLastName
              ? 'grey'
              : colors.primary
          }
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            const {
              data: {user},
            } = await supabase.auth.getUser();
            const {error} = await supabase
              .from('profiles')
              .update({first_name: firstName, last_name: lastName})
              .eq('id', user.id);
            if (error) {
              console.error(error);
              Alert.alert('Error updating your profile');
            }

            const {data: data2, error: error2} = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', user.id)
              .single();
            if (error2) {
              console.error(error2);
              console.error("Couldn't get user profile");
            } else {
              const currentUserObj = JSON.parse(
                await AsyncStorage.getItem('user'),
              );
              await AsyncStorage.setItem(
                'user',
                JSON.stringify({
                  ...currentUserObj,
                  ...data2,
                }),
              );
            }
            setFirstName('');
            setLastName('');
            setIsLoading(false);
            // get user temporarily removed for development.
            getUser();
            console.log('popping back to main settings page from edit profile');
            navigation.pop();
          }}
          text={'Save'}
          width={'40%'}
        />
      </View>
    </View>
  );
}

export default EditProfile;
