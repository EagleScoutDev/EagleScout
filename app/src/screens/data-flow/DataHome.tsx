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
      <View>
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
            </ListItemContainer>
            <AddCompetitionModal
              visible={addCompetitionModalVisible}
              setVisible={setAddCompetitionModalVisible}
              onRefresh={() => {}}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DataHome;
