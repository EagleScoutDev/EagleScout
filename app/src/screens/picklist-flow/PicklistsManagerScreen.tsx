import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import {useTheme} from '@react-navigation/native';
import PicklistsDB, {PicklistStructure} from '../../database/Picklists';
import ProfilesDB from '../../database/Profiles';
import {CaretRight} from '../../SVGIcons';
import Svg, {Path} from 'react-native-svg';

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
          // console.log('picklist ' + i + ' info: ' + picklistsResponse[i].id);
          // console.log(
          //   'picklist ' + i + ' creator: ' + picklistsResponse[i].created_by,
          // );
          //
          ProfilesDB.getProfile(picklistsResponse[i].created_by).then(
            profile => {
              // console.log('picklist ' + i + ' creator name: ' + profile.name);
              users.set(picklistsResponse[i].created_by, profile.name);
            },
          );
        }
      })
      .catch(error => {
        console.error('Error getting picklists:', error);
      });
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
                marginHorizontal: '5%',
                flexDirection: 'row',
                // alignItems: 'center',
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
    </View>
  );
}

export default PicklistsManagerScreen;