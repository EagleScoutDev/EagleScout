import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ProfilesDB from '../../database/Profiles';
import {SendScoutcoinModal} from './SendScoutcoinModal';

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

  useEffect(() => {
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
  }, []);

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
      marginVertical: 8,
      marginHorizontal: 16,
      // make it card-like
      backgroundColor: colors.card,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      // display
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filter: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    filterText: {
      padding: 10,
      backgroundColor: colors.card,
      borderRadius: 5,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scoutcoin Leaderboard</Text>
      <View style={styles.filter}>
        <TextInput
          placeholder="Search"
          onChangeText={text => {
            setFilteredLeaderboardUsers(
              leaderboardUsers
                .map((user, index) => ({
                  user,
                  place: index + 1,
                }))
                .filter(({user}) =>
                  user.name.toLowerCase().includes(text.toLowerCase()),
                ),
            );
          }}
          style={styles.filterText}
        />
      </View>
      <FlatList
        data={filteredLeaderboardUsers}
        renderItem={({item}) => (
          <Pressable
            style={styles.item}
            onLongPress={async () => {
              if (
                item.user.id === (await ProfilesDB.getCurrentUserProfile()).id
              ) {
                Alert.alert('You cannot send Scoutcoin to yourself!');
                return;
              }
              setSendingScoutcoinUser(item.user);
            }}>
            <Text>{item.place}</Text>
            <Text>{item.user.name}</Text>
            <Text>{item.user.scoutcoins}</Text>
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
