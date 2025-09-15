import React, {useEffect, useMemo, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import { ProfilesDB } from '../../database/Profiles';
import {SendScoutcoinModal} from './SendScoutcoinModal';
import Svg, {Path, SvgProps, Text as SvgText} from 'react-native-svg';
import {useProfile} from '../../lib/hooks/useProfile';
import { Coin } from '../../components/icons/icons.generated';

interface LeaderboardUser {
  id: string;
  name: string;
  emoji: string;
  scoutcoins: number;
}

const AwardIcon = ({place, props}: {place: number; props: SvgProps}) => {
  return (
    <Svg viewBox="0 0 16 16" {...props}>
      <Path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z" />
      <Path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
      <SvgText
        x="50%"
        y="50%"
        textAnchor="middle"
        fontSize="6"
        fill={props.fill}>
        {place}
      </SvgText>
    </Svg>
  );
};

const LeaderboardUserItem = ({
  place,
  user,
  setSendingScoutcoinUser,
}: {
  place: number;
  user: LeaderboardUser;
  setSendingScoutcoinUser: (user: LeaderboardUser) => void;
}) => {
  const {colors} = useTheme();
  const {profile} = useProfile();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
      paddingHorizontal: 30,
      width: '100%',
      alignItems: 'center',
      gap: 20,
    },
    place: {
      width: 20,
      textAlign: 'center',
      alignItems: 'center',
    },
    placeText: {
      color: colors.text,
    },
    emoji: {
      fontSize: 34,
    },
    innerContainer: {
      flexDirection: 'column',
    },
    name: {
      color: colors.text,
      fontWeight: 'bold',
    },
    coins: {
      color: colors.text,
    },
    coinContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={async () => {
        if (user.id === profile?.id) {
          Alert.alert('You cannot send Scoutcoin to yourself!');
          return;
        }
        setSendingScoutcoinUser(user);
      }}>
      <View style={styles.place}>
        {place > 3 ? (
          <Text style={styles.placeText}>{place}</Text>
        ) : (
          <AwardIcon
            props={{
              fill: colors.primary,
              width: 36,
              height: 36,
            }}
            place={place}
          />
        )}
      </View>
      <Text style={styles.emoji}>{user.emoji}</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.coinContainer}>
          <Text style={styles.coins}>{user.scoutcoins}</Text>
          <Coin size="12" fill={colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ScoutcoinLeaderboard = () => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
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

  useEffect(() => {
    ProfilesDB.getAllProfiles().then(profiles => {
      const leaderboardProfiles = profiles
        .map(profile => ({
          id: profile.id,
          name: profile.name,
          emoji: profile.emoji,
          scoutcoins: profile.scoutcoins,
        }))
        .sort((a, b) => b.scoutcoins - a.scoutcoins);
      setLeaderboardUsers(leaderboardProfiles);
      setFilteredLeaderboardUsers(
        leaderboardProfiles.map((user, index) => ({
          user,
          place: index + 1,
        })),
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filter}>
        <TextInput
          placeholder="Search people"
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
          selectionColor={theme.colors.text}
          cursorColor={theme.colors.text}
          placeholderTextColor={theme.colors.text}
        />
      </View>
      <FlatList
        data={filteredLeaderboardUsers}
        renderItem={({item}) => (
          <LeaderboardUserItem
            place={item.place}
            user={item.user}
            setSendingScoutcoinUser={setSendingScoutcoinUser}
          />
        )}
        keyExtractor={item => item.user.id}
      />
      {sendingScoutcoinUser && (
        <SendScoutcoinModal
          targetUser={sendingScoutcoinUser}
          onClose={() => setSendingScoutcoinUser(null)}
        />
      )}
    </View>
  );
};

const makeStyles = ({colors}: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    filter: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    filterText: {
      color: colors.text,
      padding: 10,
      backgroundColor: colors.card,
      borderRadius: 5,
    },
  });
