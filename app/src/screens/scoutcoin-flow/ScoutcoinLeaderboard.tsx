import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ProfilesDB from '../../database/Profiles';
import {SendScoutcoinModal} from './SendScoutcoinModal';
import React from 'react-native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import Svg, {Path} from 'react-native-svg';
import * as os from 'os';

interface LeaderboardUser {
  id: string;
  name: string;
  scoutcoins: number;
}

export const ScoutcoinLeaderboard = () => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(
    [],
  );
  const [filteredLeaderboardUsers, setFilteredLeaderboardUsers] = useState<
    {
      user: LeaderboardUser;
      place: number;
    }[]
  >([]);
  const [sendingScoutcoinUser, setSendingScoutcoinUser] =
    useState<LeaderboardUser | null>(null);
  const {colors} = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchingLeaderboard();
  }, []);

  useEffect(() => {
    fetchingLeaderboard();
  }, [sendingScoutcoinUser]);

  const fetchingLeaderboard = () => {
    ProfilesDB.getAllProfiles().then(profiles => {
      const leaderboardUsers = profiles
        .map(profile => ({
          id: profile.id,
          name: profile.name,
          scoutcoins: profile.scoutcoins,
        }))
        .sort((a, b) => b.scoutcoins - a.scoutcoins);
      setLeaderboardUsers(leaderboardUsers);
      setFilteredLeaderboardUsers(
        leaderboardUsers.map((user, index) => ({
          user,
          place: index + 1,
        })),
      );
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10,
    },
    item: {
      padding: 20,
      marginVertical: 4,
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filter: {
      margin: 20,
      padding: 6,
      // marginVertical: 8,
      // marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      alignItems: 'center',

      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterText: {
      padding: 10,
      backgroundColor: colors.card,
      color: colors.text,
      flex: 1,
    },
    mask: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  useEffect(() => {
    setFilteredLeaderboardUsers(
      leaderboardUsers
        .map((user, index) => ({
          user,
          place: index + 1,
        }))
        .filter(({user}) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <View style={styles.filter}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={'gray'}
          onChangeText={text => setSearchTerm(text)}
          style={styles.filterText}
          value={searchTerm}
        />
        {searchTerm.length > 0 && (
          <Pressable
            onPress={() => {
              setSearchTerm('');
            }}>
            <Svg width="16" height="16" fill="grey" viewBox="0 0 16 16">
              <Path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </Svg>
          </Pressable>
        )}
      </View>
      <FlatList
        data={filteredLeaderboardUsers}
        renderItem={({item}) => (
          <Pressable
            style={styles.item}
            onLongPress={async () => {
              let currentUser = await ProfilesDB.getCurrentUserProfile();
              if (item.user.id === currentUser.id) {
                Alert.alert('You cannot send Scoutcoin to yourself!');
                return;
              }

              if (currentUser.scoutcoins === 0) {
                Alert.alert('No ScoutCoin', 'Start scouting to earn some!');
                return;
              }

              setSendingScoutcoinUser(item.user);
            }}>
            <Text
              style={{color: colors.text, fontSize: 16, fontWeight: 'bold'}}>
              #{item.place}
            </Text>
            <Text style={{color: colors.text}}>{item.user.name}</Text>
            <Text style={{color: colors.text}}>{item.user.scoutcoins}</Text>
          </Pressable>
        )}
        keyExtractor={item => item.user.id}
      />
      {sendingScoutcoinUser && (
        <>
          <View style={styles.mask} />
          <SendScoutcoinModal
            targetUser={sendingScoutcoinUser}
            onClose={() => setSendingScoutcoinUser(null)}
          />
        </>
      )}
    </View>
  );
};
