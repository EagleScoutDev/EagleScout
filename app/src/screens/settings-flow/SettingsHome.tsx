import {Alert, Pressable, Settings, StyleSheet, Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import InternetStatus from '../../lib/InternetStatus';
import UserCard from '../../components/UserCard';
import ListItemContainer from '../../components/ListItemContainer';
import ListItem from '../../components/ListItem';
import SettingsPopup from './SettingsPopup';
import React, {useEffect, useState} from 'react';
import PicklistsDB from '../../database/Picklists';
import {useNavigation, useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VERSION = '3.0.1';

interface User {
  team_id: number;
  scouter: boolean;
  admin: boolean;
  first_name: string;
  last_name: string;
}

interface SettingsHomeProps {
  onSignOut: () => void;
  setTheme: (arg0: string) => void;
  setScoutingStyle: (arg0: string) => void;
}

const SettingsHome = ({
  onSignOut,
  setScoutingStyle,
  setTheme,
}: SettingsHomeProps) => {
  const {colors} = useTheme();
  const [settingsPopupActive, setSettingsPopupActive] = useState(false);

  const [internetStatus, setInternetStatus] = useState(
    InternetStatus.NOT_ATTEMPTED,
  );

  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    if (foundUser != null) {
      let foundUserObject: User = JSON.parse(foundUser);
      setUser(foundUserObject);
    }
  };

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

  useEffect(() => {
    getUser();
  }, []);

  const styles = StyleSheet.create({
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
  });

  const testConnection = () => {
    // attempt connection to picklist table
    setInternetStatus(InternetStatus.ATTEMPTING_TO_CONNECT);
    PicklistsDB.getPicklists()
      .then(() => {
        setInternetStatus(InternetStatus.CONNECTED);
      })
      .catch(() => {
        setInternetStatus(InternetStatus.FAILED);
      });
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
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
              fill={'gray'}
              d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
            />
          </Svg>
        </Pressable>
      </View>
      {internetStatus === InternetStatus.FAILED && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginHorizontal: '4%',
            marginBottom: '4%',
          }}>
          <Text style={{flex: 1, color: 'grey'}}>
            Some features may be disabled until you regain an internet
            connection.
          </Text>
          <Pressable onPress={testConnection}>
            <Text
              style={{
                flex: 1,
                color: colors.primary,
                fontWeight: 'bold',
              }}>
              Try again?
            </Text>
          </Pressable>
        </View>
      )}

      <UserCard
        name={user ? user.first_name + ' ' + user.last_name : 'No user'}
        email={''}
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
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Change Password'}
          onPress={() => {
            navigation.navigate('Change Password');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Request Account Deletion'}
          onPress={() => {}}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
        />
        <ListItem
          text={'Sign Out'}
          onPress={() => attemptSignOut()}
          caretVisible={false}
          disabled={false}
        />
      </ListItemContainer>
      <SettingsPopup
        visible={settingsPopupActive}
        setVisible={setSettingsPopupActive}
        setScoutingStyle={setScoutingStyle}
        setTheme={setTheme}
        navigation={navigation}
      />
      <Text
        style={{
          color: 'gray',
          textAlign: 'center',
        }}>
        v{VERSION}
      </Text>
    </View>
  );
};

export default SettingsHome;
