import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {CaretRight} from '../../SVGIcons';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import AddCompetitionModal from '../../components/modals/AddCompetitionModal';
import PicklistsDB from '../../database/Picklists';
import ListItem from '../../components/ListItem';
import ListItemContainer from '../../components/ListItemContainer';
import InternetStatus from '../../lib/InternetStatus';
import {StoredUser} from '../../lib/StoredUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Path} from 'react-native-svg';
import {useColorScheme} from 'react-native';
import Competitions from '../../database/Competitions';

const DataHome = ({navigation}) => {
  const {colors} = useTheme();
  const [addCompetitionModalVisible, setAddCompetitionModalVisible] =
    useState(false);

  const [internetStatus, setInternetStatus] = useState<InternetStatus>(
    InternetStatus.NOT_ATTEMPTED,
  );
  const [user, setUser] = useState<StoredUser | null>(null);

  const colorScheme = useColorScheme();

  const getProperColor = (lightColor: string, darkColor: string) => {
    return colorScheme === 'light' ? lightColor : darkColor;
  };

  const getUser = async () => {
    let foundUser = await AsyncStorage.getItem('user');
    if (foundUser != null) {
      let foundUserObject: StoredUser = JSON.parse(foundUser);
      setUser(foundUserObject);
    }
  };

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
    getUser();
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      alignItems: 'center',
      borderRadius: 10,
      // construct padding from debugPadding
      padding: '2%',
    },
    nav_link: {
      backgroundColor: colors.card,
      padding: '4%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nav_link_text: {
      color: colors.text,
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      padding: '3%',
      paddingLeft: '5%',
    },
  });

  return (
    <SafeAreaView
      style={{
        marginTop: '0%',
        paddingHorizontal: '2%',
      }}>
      <Text style={styles.title}>Data</Text>
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
            <Text style={{flex: 1, color: colors.primary, fontWeight: 'bold'}}>
              Try again?
            </Text>
          </Pressable>
        </View>
      )}
      <ScrollView>
        <ListItemContainer title={'Data Analysis'}>
          <ListItem
            text={'Picklist'}
            onPress={() => {
              navigation.navigate('Picklist');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={colors.text}
                viewBox="0 0 16 16">
                <Path
                  fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </Svg>
            )}
          />
          <ListItem
            text={'Team Rank'}
            onPress={() => {
              navigation.navigate('Team Rank');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg width="16" height="16" fill="fuchsia" viewBox="0 0 16 16">
                <Path
                  fill-rule="evenodd"
                  d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
                />
              </Svg>
            )}
          />
          <ListItem
            text={'Weighted Team Rank'}
            onPress={() => {
              navigation.navigate('Weighted Team Rank');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={getProperColor(colors.text, 'orange')}
                viewBox="0 0 16 16">
                <Path
                  fill-rule="evenodd"
                  d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
                />
              </Svg>
            )}
          />
          <ListItem
            text={'Match Predictor'}
            onPress={() => {
              navigation.navigate('Match Predictor');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={colors.text}
                viewBox="0 0 16 16">
                <Path d="M2 14.5a.5.5 0 0 0 .5.5h11a.5.5 0 1 0 0-1h-1v-1a4.5 4.5 0 0 0-2.557-4.06c-.29-.139-.443-.377-.443-.59v-.7c0-.213.154-.451.443-.59A4.5 4.5 0 0 0 12.5 3V2h1a.5.5 0 0 0 0-1h-11a.5.5 0 0 0 0 1h1v1a4.5 4.5 0 0 0 2.557 4.06c.29.139.443.377.443.59v.7c0 .213-.154.451-.443.59A4.5 4.5 0 0 0 3.5 13v1h-1a.5.5 0 0 0-.5.5m2.5-.5v-1a3.5 3.5 0 0 1 1.989-3.158c.533-.256 1.011-.79 1.011-1.491v-.702s.18.101.5.101.5-.1.5-.1v.7c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13v1z" />
              </Svg>
            )}
          />
          <ListItem
            text={'Export to CSV'}
            onPress={() => {
              navigation.navigate('Export to CSV');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={colors.text}
                viewBox="0 0 16 16">
                <Path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                <Path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
              </Svg>
            )}
          />
        </ListItemContainer>
        <View style={{height: 20}} />
        <ListItemContainer title={'Scoutcoin'}>
          <ListItem
            text={'Leaderboard'}
            onPress={() => {
              navigation.navigate('ScoutCoin Leaderboard');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={'black'}
                viewBox="0 0 268.14 357.2">
                <Path d="m137.54,0c9.23,2.85,16.31,9.17,23.58,15.04,7.13,5.75,14.97,8.56,24.16,8.06,6.14-.33,12.32-.33,18.47-.15,10.2.29,16.76,5.04,20.21,14.71,2.14,6.01,3.96,12.13,5.68,18.28,2.27,8.07,6.75,14.38,13.79,19,5.24,3.44,10.4,7.04,15.38,10.84,8.48,6.47,11.01,14.09,8.01,24.29-1.8,6.12-3.91,12.15-6.11,18.14-2.88,7.86-2.83,15.6-.06,23.5,2.52,7.21,4.94,14.49,6.86,21.88,1.9,7.32-.67,13.69-6.27,18.47-4.85,4.13-10.02,7.97-15.43,11.32-8.89,5.51-14.44,13.08-16.97,23.24-1.53,6.17-4.02,12.1-5.82,18.21-.4,1.37,0,3.18.54,4.59,8.77,22.62,17.63,45.2,26.46,67.79,3.01,7.72-.2,12.22-8.41,11.38-10.98-1.13-21.94-2.47-32.87-3.98-3.67-.51-6.15.15-8.63,3.24-6.97,8.71-14.37,17.08-21.63,25.56-4.94,5.77-10.91,4.81-13.68-2.26-8.69-22.15-17.41-44.29-25.87-66.52-1.48-3.89-3.24-5.91-7.92-4.31-2.12,5.39-4.42,11.2-6.7,17.03-6.98,17.83-13.94,35.67-20.93,53.5-2.95,7.53-8.74,8.51-14,2.35-7.26-8.48-14.6-16.89-21.64-25.55-2.28-2.81-4.55-3.53-8.03-3.05-11.16,1.55-22.36,2.86-33.56,4.04-7.65.81-11.05-3.84-8.24-11.06,8.85-22.71,17.72-45.41,26.65-68.09.86-2.2.78-3.99-.05-6.26-2.27-6.2-4.25-12.53-6.01-18.9-2.31-8.35-6.96-14.77-14.23-19.49-5.16-3.35-10.18-6.93-15.09-10.64-8.25-6.23-11.01-14.41-7.9-24.34,1.87-5.98,3.83-11.94,6-17.81,2.95-7.97,2.94-15.81.1-23.82-2.48-6.99-4.81-14.05-6.7-21.21-2.28-8.68,1.31-15.53,8.04-20.77,5.12-3.99,10.48-7.72,15.92-11.28,7.04-4.62,11.42-10.96,13.82-18.98,2.19-7.32,4.51-14.64,7.4-21.7,3.23-7.88,10.02-11.02,18.13-11.28,6.73-.22,13.48-.13,20.22.11,8.16.29,15.32-2.11,21.62-7.25,1.8-1.47,3.71-2.8,5.51-4.27,5.86-4.77,11.9-9.22,19.21-11.57h6.98Zm-60.22,36.99c-3.86,0-8.28-.03-12.7,0-3.37.03-5.82,1.58-6.92,4.81-1.57,4.61-3.33,9.19-4.42,13.92-3.37,14.63-11.47,25.64-24.26,33.42-4.15,2.53-8.02,5.55-11.91,8.48-2.54,1.91-3.6,4.47-2.51,7.68,1.6,4.72,2.89,9.56,4.78,14.17,5.67,13.84,5.58,27.54-.11,41.35-1.85,4.49-3.09,9.23-4.66,13.84-1.1,3.21-.04,5.78,2.49,7.69,3.98,3.01,7.94,6.1,12.2,8.68,12.61,7.64,20.47,18.55,23.91,32.86,1.19,4.94,3.02,9.74,4.67,14.57.96,2.81,3.03,4.38,6.03,4.4,5.46.04,10.93.24,16.36-.09,14.31-.88,26.78,3.31,37.58,12.72,2.8,2.44,5.84,4.6,8.83,6.82,6,4.46,8.7,4.48,14.64.11,2.81-2.07,5.69-4.07,8.29-6.37,11.29-10.03,24.38-14.43,39.46-13.27,4.96.38,9.98.14,14.97.12,3.15-.01,5.32-1.62,6.31-4.55,1.64-4.83,3.4-9.64,4.61-14.58,3.48-14.15,11.26-25,23.73-32.61,4.25-2.59,8.23-5.65,12.22-8.65,2.65-1.98,3.76-4.62,2.59-7.97-1.64-4.71-2.97-9.53-4.84-14.14-5.52-13.6-5.56-27.09-.04-40.7,1.87-4.61,3.2-9.44,4.83-14.15,1.15-3.33.13-6-2.56-7.99-4.29-3.18-8.57-6.4-13.08-9.25-11.44-7.22-18.97-17.18-22.35-30.34-1.35-5.27-3.15-10.44-4.82-15.62-1.18-3.65-3.77-5.42-7.62-5.36-5.23.07-10.47,0-15.69.21-10.82.43-21.11-1.16-30.16-7.61-4.07-2.9-8-5.99-11.96-9.03-10.85-8.32-11.45-8.25-22.45.06-5.64,4.26-11.29,8.62-17.39,12.14-8.48,4.88-18.03,4.81-28.06,4.26Zm16.5,299.6c8.08-20.68,15.95-40.74,23.68-60.86.33-.87-.33-2.65-1.11-3.32-3.08-2.65-6.52-4.87-9.58-7.53-7.17-6.25-15.55-8.34-24.85-8.07-8.2.23-16.41.05-25.15.05-7.12,18.23-14.52,37.15-22.13,56.62,10.02-1.21,19.36-2.19,28.66-3.51,4.65-.66,8.23.17,11.35,4.07,6.01,7.51,12.43,14.7,19.14,22.55Zm80.47,0c5.8-6.78,11.55-12.87,16.53-19.53,4.36-5.82,9.18-8.97,16.57-6.69,1.31.4,2.76.36,4.14.52,7.12.83,14.25,1.65,21.91,2.54-7.63-19.47-15.05-38.41-22.48-57.38-1.76.32-3.12.77-4.48.78-7.54.07-15.1-.29-22.62.16-4.9.3-10.28.68-14.45,2.9-6.59,3.51-12.39,8.54-18.4,13.08-.56.43-.68,2.11-.36,2.95,7.74,20.01,15.56,39.99,23.64,60.66Z" />
                <Path d="m225.9,139.96c-.07,50.62-41.38,91.87-91.94,91.79-50.69-.07-92.2-41.66-91.76-91.92.44-50.95,41.61-91.93,92.09-91.67,50.57.26,91.68,41.46,91.61,91.8Zm-91.88-77.73c-42.78.04-77.52,34.82-77.62,77.69-.09,42.91,34.93,77.9,77.83,77.75,42.85-.14,77.65-35.08,77.46-77.78-.18-42.91-34.99-77.71-77.68-77.67Z" />
                <Path d="m98.43,181.4c1.39-8.21,2.76-16.93,4.41-25.6.41-2.16-.17-3.41-1.65-4.81-5.74-5.44-11.33-11.03-17.04-16.5-2.61-2.5-4.35-5.27-3.01-8.95,1.29-3.53,4.38-4.43,7.78-4.88,8.06-1.08,16.11-2.22,24.13-3.57,1.17-.2,2.52-1.49,3.11-2.63,3.68-7.12,7.21-14.31,10.69-21.52,1.51-3.13,3.5-5.64,7.24-5.62,3.73.01,5.71,2.49,7.22,5.64,3.47,7.22,6.99,14.42,10.73,21.5.66,1.25,2.38,2.47,3.79,2.71,8.01,1.37,16.08,2.43,24.12,3.6,3.15.46,5.9,1.59,7.05,4.86,1.19,3.38-.1,6.07-2.56,8.44-5.95,5.72-11.91,11.44-17.7,17.32-.92.94-1.51,2.83-1.31,4.14,1.17,7.92,2.6,15.81,3.97,23.71.58,3.35.61,6.55-2.43,8.86-3.04,2.3-6.05,1.53-9.12-.12-6.96-3.73-14.03-7.26-20.94-11.08-2.11-1.17-3.7-1.07-5.76.05-7.34,4-14.73,7.92-22.21,11.65-5.39,2.69-10.63-.77-10.5-7.19Zm16.4-11.79c3.8-1.98,7.21-3.29,10.08-5.35,6.32-4.53,12.24-4.4,18.52.07,2.83,2.01,6.18,3.27,9.89,5.18-.62-3.64-1.16-6.47-1.58-9.32-1.93-13.01-3.69-10.6,6.59-20.49,2.18-2.1,4.33-4.24,6.93-6.79-5.94-.87-10.96-1.79-16.02-2.3-3.9-.39-6.38-2.23-8-5.73-2.17-4.69-4.55-9.28-7.18-14.59-2.67,5.38-5.1,10.07-7.34,14.85-1.52,3.25-3.86,4.99-7.45,5.42-5.24.62-10.45,1.52-15.53,2.28,3.84,4.09,7.5,8.08,11.28,11.96,2.28,2.34,3.25,4.87,2.6,8.19-1.05,5.3-1.8,10.66-2.79,16.62Z" />
              </Svg>
            )}
          />
          <ListItem
            text={'Ledger'}
            onPress={() => {
              navigation.navigate('ScoutCoin Ledger');
            }}
            caretVisible={true}
            disabled={internetStatus !== InternetStatus.CONNECTED}
            icon={() => (
              <Svg
                width="16"
                height="16"
                fill={colors.text}
                viewBox="0 0 16 16">
                <Path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
                <Path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
              </Svg>
            )}
          />
        </ListItemContainer>

        <View style={{height: 20}} />
        {user?.admin && (
          <>
            <ListItemContainer title={'Administrative'}>
              <ListItem
                text={'Manage Competitions'}
                onPress={() => {
                  navigation.navigate('Manage Competitions');
                }}
                caretVisible={true}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg
                    width="16"
                    height="16"
                    fill={getProperColor('goldenrod', 'gold')}
                    viewBox="0 0 16 16">
                    <Path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935" />
                  </Svg>
                )}
              />
              <ListItem
                text={'Create Competition'}
                onPress={() => {
                  setAddCompetitionModalVisible(true);
                }}
                caretVisible={false}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg
                    width="16"
                    height="16"
                    fill={colors.text}
                    viewBox="0 0 16 16">
                    <Path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                  </Svg>
                )}
              />
              <ListItem
                text={'Manage Users'}
                onPress={() => {
                  navigation.navigate('Manage Users');
                }}
                caretVisible={true}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16">
                    <Path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  </Svg>
                )}
              />
              <ListItem
                text={'Manage Forms'}
                onPress={() => {
                  navigation.navigate('Manage Forms');
                }}
                caretVisible={true}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg
                    width="16"
                    height="16"
                    fill={getProperColor('green', 'aquamarine')}
                    viewBox="0 0 16 16">
                    <Path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                    <Path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                    <Path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                  </Svg>
                )}
              />
              <ListItem
                text={'Manage Scout Assignments'}
                onPress={() => {
                  navigation.navigate('Manage Scout Assignments');
                }}
                caretVisible={true}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg
                    width="16"
                    height="16"
                    fill="orangered"
                    viewBox="0 0 16 16">
                    <Path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                    <Path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                  </Svg>
                )}
              />
              <ListItem
                text={'Manage Match Bets'}
                onPress={() => {
                  navigation.navigate('Manage Match Bets');
                }}
                caretVisible={true}
                disabled={internetStatus !== InternetStatus.CONNECTED}
                icon={() => (
                  <Svg width="16" height="16" fill="green" viewBox="0 0 16 16">
                    <Path d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0" />
                    <Path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                    <Path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                    <Path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                  </Svg>
                )}
              />
            </ListItemContainer>
            <AddCompetitionModal
              visible={addCompetitionModalVisible}
              setVisible={setAddCompetitionModalVisible}
              onRefresh={() => {}}
            />
          </>
        )}
        <View style={{height: 80}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataHome;
