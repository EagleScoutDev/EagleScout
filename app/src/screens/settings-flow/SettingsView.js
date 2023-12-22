import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Pressable,
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
import SettingsPopup from './SettingsPopup';

const Stack = createStackNavigator();
const VERSION = '3.0.1';

function SettingsView({onSignOut, setTheme, setScoutingStyle}) {
  const {colors} = useTheme();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [settingsPopupActive, setSettingsPopupActive] = useState(false);

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

  const styles = StyleSheet.create({
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
  });

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
          <View
            style={{
              marginTop: '10%',
              paddingHorizontal: '2%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-evenly',
                padding: '3%',
                paddingLeft: '5%',
                marginTop: '5%',
              }}>
              <Text style={styles.title}>Profile</Text>
              <Pressable onPress={() => setSettingsPopupActive(true)}>
                <Svg width={32} height={32} viewBox="0 0 16 16">
                  <Path
                    fill={colors.primary}
                    d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
                  />
                </Svg>
              </Pressable>
            </View>

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
            {/*<ThemePicker colors={colors} setTheme={setTheme} />*/}
            {/*<ScoutingStylePicker*/}
            {/*  colors={colors}*/}
            {/*  setScoutingStyle={setScoutingStyle}*/}
            {/*/>*/}
            {/*<MinimalSectionHeader title={'Dev Tools'} />*/}
            {/*<StandardButton*/}
            {/*  color={'black'}*/}
            {/*  onPress={() => {*/}
            {/*    navigation.navigate('Debug Offline');*/}
            {/*  }}*/}
            {/*  text={'View Device Storage'}*/}
            {/*/>*/}
            {/*<View style={{marginVertical: '10%'}} />*/}
            {/*<View*/}
            {/*  style={{*/}
            {/*    // position: 'absolute',*/}
            {/*    marginBottom: '5%',*/}
            {/*    alignSelf: 'center',*/}
            {/*    bottom: 0,*/}
            {/*  }}>*/}
            {/*  <Text style={{color: 'gray'}}>v{VERSION}</Text>*/}
            {/*</View>*/}
            <SettingsPopup
              visible={settingsPopupActive}
              setVisible={setSettingsPopupActive}
            />
          </View>
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
