import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const Stack = createStackNavigator();
const VERSION = '3.0.1';

function SettingsView({onSignOut, setTheme, setScoutingStyle}) {
  const {colors} = useTheme();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const caret = (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      stroke="gray"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: 'absolute',
        right: 20,
        top: 20,
      }}>
      <Path
        fill-rule="evenodd"
        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
      />
    </Svg>
  );

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

  const styles = StyleSheet.create({
    list_item: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      backgroundColor: colors.card,
      padding: 15,
    },
    list_container: {
      margin: '3%',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

  const ListItem = (text, onPress, caretVisible = true) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <Text style={styles.list_item}>{text}</Text>
      {caretVisible && caret}
    </TouchableOpacity>
  );

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
            <MinimalSectionHeader title={'Account'} />
            <View style={styles.list_container}>
              {ListItem('Edit Profile', () =>
                navigation.navigate('Edit Profile', {
                  initialFirstName: user ? user.first_name : '',
                  initialLastName: user ? user.last_name : '',
                  //initialEmail: user.email,
                }),
              )}
              {ListItem('Change Password', () =>
                navigation.navigate('Change Password'),
              )}
              {ListItem('Sign Out', () => attemptSignOut(), false)}
            </View>
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
