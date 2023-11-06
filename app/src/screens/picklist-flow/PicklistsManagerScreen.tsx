import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import {useTheme} from '@react-navigation/native';
import PicklistsDB, {PicklistStructure} from '../../database/Picklists';
import ProfilesDB from '../../database/Profiles';

function PicklistsManagerScreen({navigation}) {
  const {colors} = useTheme();
  const [picklists, setPicklists] = useState<Array<PicklistStructure>>([]);
  const [users, setUsers] = useState<Map<string, string>>(new Map());
  const [refreshing, setRefreshing] = useState(false);

  const getPicklists = () => {
    // get picklists from database
    PicklistsDB.getPicklists()
      .then(picklistsResponse => {
        setPicklists(picklistsResponse);

        for (let i = 0; i < picklistsResponse.length; i++) {
          console.log('picklist ' + i + ' info: ' + picklistsResponse[i].id);
        }
      })
      .catch(error => {
        console.error('Error getting picklists:', error);
      });
    // PicklistsDB.getPicklists()
    //   .then(picklistsResponse => {
    //     // Create an array of promises to get all user names
    //     const userPromises = picklistsResponse.map(picklist => {
    //       console.log('picklist creator: ' + picklist.created_by);
    //       // Return a promise to get the user name from the user ID
    //       ProfilesDB.getProfile(picklist.created_by);
    //     });
    //
    //     // Resolve all promises to fetch user names
    //     Promise.all(userPromises)
    //       .then(profiles => {
    //         // Create a new Map for user IDs and names
    //         const newUsersMap = new Map();
    //         profiles.forEach(profile => {
    //           // Assume each profile contains a 'name' field and an 'id' field
    //           if (profile == null) {
    //             newUsersMap.set(profile.id, 'Unknown');
    //           }
    //           newUsersMap.set(profile.id, profile.name);
    //         });
    //         setUsers(newUsersMap); // Update the users state with new data
    //         setPicklists(picklistsResponse); // Update the picklists state
    //       })
    //       .catch(error => {
    //         console.error('Error getting user names:', error);
    //       });
    //   })
    //   .catch(error => {
    //     console.error('Error getting picklists:', error);
    //   });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getPicklists();
    setRefreshing(false);
  };

  useEffect(() => {
    getPicklists();
  }, []);

  // Render function using FlatList
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={picklists}
        onRefresh={() => onRefresh()}
        refreshing={refreshing}
        keyExtractor={item => item.name}
        // keyExtractor={item => item.teams.length} // Use a unique property of the picklist as key
        renderItem={({item}) => {
          const userName = users.get(item.created_by) || 'Unknown';
          return (
            <Pressable
              onPress={() => {
                navigation.navigate('Picklist Creator', {
                  picklist_id: item.id,
                });
              }}
              style={{
                backgroundColor: colors.card,
                padding: '5%',
                borderRadius: 10,
                marginTop: '5%',
              }}>
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
                By {userName}
              </Text>
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
          navigation.navigate('Picklist Creator');
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
    </View>
  );
}

export default PicklistsManagerScreen;
