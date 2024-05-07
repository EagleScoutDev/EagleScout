import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Alert,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ProfilesDB from '../../database/Profiles';
import {SendScoutcoinModal} from './SendScoutcoinModal';
import React from 'react-native';
import Svg, {Path} from 'react-native-svg';
import GradientShimmer from 'react-native-gradient-shimmer';
import LinearGradient from 'react-native-linear-gradient';

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
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    fetchingLeaderboard();
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchingLeaderboard();
    getCurrentUser();
  }, [sendingScoutcoinUser]);

  const getCurrentUser = () => {
    ProfilesDB.getCurrentUserProfile().then(profile => {
      setCurrentUser(profile);
    });
  };

  const verifyThenSend = async (item: LeaderboardUser) => {
    if (item.id === currentUser?.id) {
      Alert.alert('You cannot send Scoutcoin to yourself!');
      return;
    }

    if (currentUser?.scoutcoins === 0) {
      Alert.alert('No ScoutCoin', 'Start scouting to earn some!');
      return;
    }

    setSendingScoutcoinUser(item);
  };

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
      borderRadius: 5,
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
          <LinearGradient
            colors={
              item.user.id === currentUser?.id
                ? ['rgb(52,120,247)', 'rgb(32, 90, 255)']
                : [colors.card, colors.card]
            }
            style={styles.item}>
            <Pressable
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onLongPress={async () => {
                await verifyThenSend(item.user);
              }}>
              <Text
                style={{
                  color:
                    item.user.id === currentUser?.id ? 'white' : colors.text,
                  fontSize: 16,
                  fontWeight: 'bold',
                  flex: 0.25,
                }}>
                #{item.place}
              </Text>
              <Text
                style={{
                  color:
                    item.user.id === currentUser?.id ? 'white' : colors.text,
                  flex: 1,
                }}>
                {item.user.name}
              </Text>
              <Text
                style={{
                  color:
                    item.user.id === currentUser?.id ? 'white' : colors.text,
                  flex: 0.3,
                }}>
                {item.user.scoutcoins}
              </Text>
              {item.user.id !== currentUser?.id && (
                <Pressable
                  // style={{flex: 0.3}}
                  onPress={async () => {
                    await verifyThenSend(item.user);
                  }}>
                  <Svg
                    width="16"
                    height="16"
                    fill={
                      currentUser?.scoutcoins === 0 ||
                      item.user.id === currentUser?.id
                        ? 'grey'
                        : colors.primary
                    }
                    viewBox="0 0 16 16">
                    <Path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372zm-2.54 1.183L5.93 9.363 1.591 6.602z" />
                    <Path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5" />
                  </Svg>
                </Pressable>
              )}
            </Pressable>
          </LinearGradient>
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
