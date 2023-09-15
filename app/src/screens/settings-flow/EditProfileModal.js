import React, {StyleSheet, TextInput, View, Alert} from 'react-native';
import StandardButton from '../../components/StandardButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import { supabase } from '../../lib/supabase';

function EditProfileModal({navigation, route, getUser}) {
  const {initialFirstName, initialLastName, initialEmail} = route.params;
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
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
        {/*<MinimalSectionHeader title={'Email'} />
        <TextInput
          style={styles.text_input}
          onChangeText={text => setEmail(text)}
          value={email}
          defaultValue={initialEmail}
  />*/}
      </View>
      <View style={styles.button_row}>
        <StandardButton
          color={colors.primary}
          onPress={async () => {
            // this needs to do three things:
            // 1) update the user's name and email in the database
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase.from('profiles').update({first_name: firstName, last_name: lastName}).eq('id', user.id);
            if (error) {
              console.error(error);
              Alert.alert('Error updating your profile');
            }


            // 2) update the user's name and email in the firebase auth
            /*auth()
              .currentUser.updateProfile({
                displayName: name,
              })
              .then(() => {
                console.log('Profile updated');
              });

            auth()
              .currentUser.updateEmail(auth().currentUser, email)
              .then(() => {
                console.log('Email updated');
              });*/
            // 3) update the user's name and email in the async storage
            /*const docRef = firestore()
              .collection('users')
              .doc(auth().currentUser.uid);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
              console.log('Document data:', docSnap.data());
              AsyncStorage.setItem('user', JSON.stringify(docSnap.data())).then(
                () => {
                  console.log('user data saved to async storage');
                },
              );
            }*/

            const res = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
            let data2 = res.data;
            const error2 = res.error;
            if (error2) {
              console.error(error2);
              console.error("Couldn't get user profile");
              data2 = {};
            }
            const currentUserObj = JSON.parse(await AsyncStorage.getItem('user'));
            await AsyncStorage.setItem('user', JSON.stringify({
              ...currentUserObj,
              ...data2
            }));

            setFirstName('');
            setLastName('');
            setEmail('');
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
    // </StandardModal>
  );
}

export default EditProfileModal;
