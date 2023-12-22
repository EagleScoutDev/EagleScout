import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import ThemePicker from '../../components/pickers/ThemePicker';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import StandardButton from '../../components/StandardButton';
import ScoutingStylePicker from '../../components/pickers/ScoutingStylePicker';
import {Path, Svg} from 'react-native-svg';
import UserCard from '../../components/UserCard';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import DebugOffline from '../DebugOffline';
import {CaretRight} from '../../SVGIcons';
import ListItemContainer from '../../components/ListItemContainer';
import ListItem from '../../components/ListItem';

const Stack = createStackNavigator();
const VERSION = '3.0.1';

function SettingsView({onSignOut, setTheme, setScoutingStyle}) {
  const {colors} = useTheme();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    foundUser = JSON.parse(foundUser);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const attemptSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You will require an internet connection to use the app again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => signOutFunction()},
      ],
    );
  };

  const signOutFunction = () => {
    // AsyncStorage.setItem('authenticated', 'false');
    // TODO: triple check if this is the right way to do this
    AsyncStorage.clear().then(() => {
      console.log('Sign out successful');
      onSignOut();
    });
  };

  return (
    <Stack.Navigator initialRouteName={'Main Settings'}>
      <Stack.Screen
        name="Main Settings"
        options={{headerShown: false}}
        children={() => (
          <SafeAreaView>
            <UserCard
              name={user ? user.first_name + ' ' + user.last_name : 'No user'}
              //email={user ? user.email : 'No user'}
            />
            <ListItemContainer title={'Account'}>
              <ListItem
                text={'Edit Profile'}
                onPress={() => {
                  navigation.navigate('Edit Profile', {
                    initialFirstName: user ? user.first_name : '',
                    initialLastName: user ? user.last_name : '',
                    //initialEmail: user.email,
                  });
                }}
                caretVisible={true}
                disabled={false}
              />
              <ListItem
                text={'Change Password'}
                onPress={() => {
                  navigation.navigate('Change Password');
                }}
                caretVisible={true}
                disabled={false}
              />
              <ListItem
                text={'Request Account Deletion'}
                onPress={() => {}}
                caretVisible={true}
                disabled={false}
              />
              <ListItem
                text={'Sign Out'}
                onPress={() => attemptSignOut()}
                caretVisible={false}
                disabled={false}
              />
            </ListItemContainer>
            <ThemePicker colors={colors} setTheme={setTheme} />
            <ScoutingStylePicker
              colors={colors}
              setScoutingStyle={setScoutingStyle}
            />
            <MinimalSectionHeader title={'Dev Tools'} />
            <StandardButton
              color={'black'}
              onPress={() => {
                navigation.navigate('Debug Offline');
              }}
              text={'View Device Storage'}
            />
            <View style={{marginVertical: '10%'}} />
            <View
              style={{
                // position: 'absolute',
                marginBottom: '5%',
                alignSelf: 'center',
                bottom: 0,
              }}>
              <Text style={{color: 'gray'}}>v{VERSION}</Text>
            </View>
          </SafeAreaView>
        )}
      />
      <Stack.Screen
        name="Edit Profile"
        children={props => <EditProfileModal {...props} getUser={getUser} />}
      />
      <Stack.Screen name="Change Password" component={ChangePasswordModal} />
      <Stack.Screen name="Debug Offline" component={DebugOffline} />
    </Stack.Navigator>
  );
}

export default SettingsView;
