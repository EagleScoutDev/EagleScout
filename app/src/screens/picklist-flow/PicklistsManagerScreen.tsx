import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Alert} from 'react-native';

import {useTheme} from '@react-navigation/native';
import PicklistsDB, {PicklistStructure} from '../../database/Picklists';
import ProfilesDB from '../../database/Profiles';
import {CaretRight} from '../../SVGIcons';
import Svg, {Path} from 'react-native-svg';
import CompetitionsDB from '../../database/Competitions';
import Competitions from '../../database/Competitions';

function PicklistsManagerScreen({navigation}) {
  const {colors} = useTheme();
  const [picklists, setPicklists] = useState<Array<PicklistStructure>>([]);
  const [users, setUsers] = useState<Map<string, string>>(new Map());
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredPicklistID, setHoveredPicklistID] = useState('');
  const [currentCompHappening, setCurrentCompHappening] = useState(false);
  const [currentCompID, setCurrentCompID] = useState<number>(-1);

  const getPicklists = (cmpId: any) => {
    // get picklists from database
    PicklistsDB.getPicklists(cmpId)
      .then(picklistsResponse => {
        const promises = picklistsResponse.map(picklist => {
          return ProfilesDB.getProfile(picklist.created_by);
        });

        Promise.all(promises).then(profiles => {
          const usersCopy = new Map();
          for (let i = 0; i < picklistsResponse.length; i++) {
            usersCopy.set(picklistsResponse[i].created_by, profiles[i].name);
          }
          setPicklists(picklistsResponse);
          setUsers(usersCopy);
        });

        if (cmpId != null) {
          let exists = false;
          for (let j = 0; j < picklistsResponse.length; j++) {
            if (picklistsResponse[j].id === cmpId) {
              exists = true;
              break;
            }
          }
          if (exists) {
            Alert.alert(
              'Unable to delete picklist',
              'Please make sure you have sufficient permissions to delete this picklist.',
            );
          }
        }
      })
      .catch(error => {
        console.error('Error getting picklists:', error);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (currentCompID !== -1) {
      getPicklists(currentCompID);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      CompetitionsDB.getCurrentCompetition().then(comp => {
        if (comp != null) {
          setCurrentCompID(comp.id);
          getPicklists(comp.id);
          setCurrentCompHappening(true);
        }
      });
    });
  }, [navigation]);

  // Render function using FlatList
  return (
    <View style={{flex: 1}}>
      {!currentCompHappening ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>There is no competition happening currently.</Text>
        </View>
      ) : (
        <>
          {picklists.length === 0 && (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginTop: '5%',
                color: colors.text,
              }}>
              No picklists found.{'\n'}Create one to get started!
            </Text>
          )}
          <FlatList
            data={picklists}
            onRefresh={() => onRefresh()}
            refreshing={refreshing}
            keyExtractor={item => item.name}
            // keyExtractor={item => item.teams.length} // Use a unique property of the picklist as key
            renderItem={({item}) => {
              return (
                <Pressable
                  onPressIn={() => {
                    setHoveredPicklistID(item.name);
                  }}
                  onPressOut={() => {
                    setHoveredPicklistID('');
                  }}
                  onPress={() => {
                    navigation.navigate('Picklist Creator', {
                      picklist_id: item.id,
                      currentCompID: currentCompID,
                    });
                  }}
                  onLongPress={() => {
                    Alert.alert(
                      'Delete Picklist',
                      'Are you sure you want to delete this picklist?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Delete',
                          onPress: () => {
                            PicklistsDB.deletePicklist(item.id).then(() => {
                              getPicklists(item.id);
                            });
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}
                  style={{
                    backgroundColor: colors.card,
                    padding: '5%',
                    borderRadius: 10,
                    marginTop: '5%',
                    marginHorizontal: '5%',
                    flexDirection: 'row',
                    // alignItems: 'center',
                    borderWidth: hoveredPicklistID === item.name ? 1.5 : 1,
                    borderColor:
                      hoveredPicklistID === item.name
                        ? colors.primary
                        : colors.border,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {item.name}
                    </Text>
                    {/*<Text>{item.teams.toString()}</Text>*/}
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'gray',
                      }}>
                      By {users.get(item.created_by) || 'Unknown'}
                    </Text>
                  </View>
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
                      right: '5%',
                      top: '80%',
                    }}>
                    <Path
                      fill-rule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </Svg>
                </Pressable>
              );
            }}
          />
          <Pressable
            style={{
              backgroundColor: 'blue',
              padding: '5%',
              borderRadius: 10,
              margin: '5%',
            }}
            onPress={() => {
              navigation.navigate('Picklist Creator', {
                picklist_id: -1,
                currentCompID: currentCompID,
              });
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Create Picklist
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default PicklistsManagerScreen;
