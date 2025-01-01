import {Easing, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {StoredUser} from '../lib/StoredUser';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient'; // or 'expo-linear-gradient'
import GradientShimmer from 'react-native-gradient-shimmer';
import ProfilesDB from '../database/Profiles';
import {ScoutcoinIcon} from '../SVGIcons';

interface UserProfileBoxProps {
  user: StoredUser | null;
}

function UserProfileBox({user}: UserProfileBoxProps) {
  const {colors} = useTheme();
  const [numScoutCoins, setNumScoutCoins] = React.useState<number>(0);

  useEffect(() => {
    ProfilesDB.getCurrentUserProfile().then(profile => {
      setNumScoutCoins(profile.scoutcoins);
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: '5%',
      margin: '3%',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 10,
      borderColor: colors.border,
      borderWidth: 1,
    },
    role_text: {
      color: colors.text,
    },
    name_text: {
      fontSize: 20,
      color: colors.text,
    },
  });

  if (user === null) {
    return (
      <View style={styles.container}>
        <Text style={{color: colors.text}}>No user found.</Text>
      </View>
    );
  }

  const getRoleName = (scouter: boolean, admin: boolean): String => {
    if (admin) {
      return 'Admin';
    }

    if (scouter) {
      return 'Scouter';
    } else {
      return 'Rejected';
    }
  };

  return (
    <View style={styles.container}>
      <GradientShimmer
        LinearGradientComponent={LinearGradient}
        backgroundColor={colors.primary}
        highlightColor={colors.card}
        animating={true}
        duration={4000}
        easing={Easing.linear}
        highlightWidth={150}
        height={50}
        width={50}
        style={{
          borderRadius: user.admin ? 10 : 100,
          marginRight: '5%',
        }}
      />
      <View style={{flex: 1}}>
        <Text style={styles.name_text}>
          {user.first_name} {user.last_name} {user.emoji}
        </Text>
        <Text style={styles.role_text}>
          {getRoleName(user.scouter, user.admin)}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ScoutcoinIcon width="16" height="16" fill={colors.text} />
        <Text
          selectable={true}
          style={{color: colors.text, paddingLeft: 8, fontSize: 16}}>
          {numScoutCoins}
        </Text>
      </View>
    </View>
  );
}

export default UserProfileBox;
