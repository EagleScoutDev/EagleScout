import {Easing, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {StoredUser} from '../lib/StoredUser';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient'; // or 'expo-linear-gradient'
import GradientShimmer from 'react-native-gradient-shimmer';
import Svg, {Path} from 'react-native-svg';
import ProfilesDB from '../database/Profiles';

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
        <Svg width="16" height="16" fill={colors.text} viewBox="0 0 16 16">
          <Path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z" />
          <Path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <Path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
        </Svg>
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
