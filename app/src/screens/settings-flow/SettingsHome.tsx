import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  Settings,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import InternetStatus from '../../lib/InternetStatus';
import UserProfileBox from '../../components/UserProfileBox';
import ListItemContainer from '../../components/ListItemContainer';
import ListItem from '../../components/ListItem';
import SettingsPopup from './SettingsPopup';
import React, {useEffect, useState} from 'react';
import PicklistsDB from '../../database/Picklists';
import {useNavigation, useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoredUser} from '../../lib/StoredUser';
import Competitions from '../../database/Competitions';
import {ThemeOptions} from '../../themes/ThemeOptions';

const VERSION = '7.3 (OTA 7)';

interface SettingsHomeProps {
  onSignOut: () => void;
  setTheme: (arg0: ThemeOptions) => void;
  setScoutingStyle: (arg0: string) => void;
  // setOled: (arg0: boolean) => void;
}

const SettingsHome = ({
  onSignOut,
  setScoutingStyle,
  setTheme,
}: // setOled,
SettingsHomeProps) => {
  const {colors} = useTheme();
  const [settingsPopupActive, setSettingsPopupActive] = useState(false);

  const [internetStatus, setInternetStatus] = useState(
    InternetStatus.NOT_ATTEMPTED,
  );

  const [user, setUser] = useState<StoredUser | null>(null);
  const navigation = useNavigation();

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    if (foundUser != null) {
      let foundUserObject: StoredUser = JSON.parse(foundUser);
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
    Competitions.getCurrentCompetition()
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
    <SafeAreaView
      style={{
        paddingHorizontal: '2%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-evenly',
          padding: '3%',
          paddingLeft: '5%',
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

      <UserProfileBox user={user} />

      <ListItemContainer title={'Account'}>
        <ListItem
          text={'Edit Profile'}
          onPress={() => {
            navigation.navigate('Edit Profile', {
              initialFirstName: user ? user.first_name : '',
              initialLastName: user ? user.last_name : '',
              initialEmoji: user ? user.emoji : '🙂',
              //initialEmail: user.email,
            });
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
          icon={() => (
            <Svg width="16" height="16" fill={'gray'} viewBox="0 0 16 16">
              <Path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
            </Svg>
          )}
        />
        <ListItem
          text={'Change Password'}
          onPress={() => {
            navigation.navigate('Change Password');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
          icon={() => (
            <Svg width="16" height="16" fill="gray" viewBox="0 0 16 16">
              <Path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1" />
            </Svg>
          )}
        />
        <ListItem
          text={'Request Account Deletion'}
          onPress={() => {
            navigation.navigate('Request Account Deletion');
          }}
          caretVisible={true}
          disabled={internetStatus !== InternetStatus.CONNECTED}
          icon={() => (
            <Svg width="16" height="16" fill="red" viewBox="0 0 16 16">
              <Path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
            </Svg>
          )}
        />
        <ListItem
          text={'Contact Support'}
          onPress={() => {
            // open a link to google.com
            Linking.openURL('https://forms.gle/vbLEhyouNgUShhDp9').then(r => {
              console.log('Opened support link');
            });
          }}
          caretVisible={false}
          disabled={false}
          icon={() => (
            <Svg width="16" height="16" fill={'gray'} viewBox="0 0 16 16">
              <Path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <Path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
            </Svg>
          )}
        />
        <ListItem
          text={'Sign Out'}
          onPress={() => attemptSignOut()}
          caretVisible={false}
          disabled={false}
          icon={() => (
            <Svg width="16" height="16" fill={colors.text} viewBox="0 0 16 16">
              <Path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
              <Path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
            </Svg>
          )}
        />
      </ListItemContainer>
      <ListItemContainer title={''}>
        <ListItem
          text={'View Your Reports'}
          onPress={() => {
            navigation.navigate('Reports');
          }}
          caretVisible={true}
          icon={() => (
            <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <Path
                fill-rule="evenodd"
                d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"
              />
              <Path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
              <Path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
            </Svg>
          )}
        />
        <ListItem
          text={'View Your Notes'}
          onPress={() => {
            navigation.navigate('Notes');
          }}
          caretVisible={true}
          icon={() => (
            <Svg width="16" height="16" fill="purple" viewBox="0 0 16 16">
              <Path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293z" />
            </Svg>
          )}
        />
      </ListItemContainer>
      <SettingsPopup
        visible={settingsPopupActive}
        setVisible={setSettingsPopupActive}
        // setOled={setOled}
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
    </SafeAreaView>
  );
};

export default SettingsHome;
