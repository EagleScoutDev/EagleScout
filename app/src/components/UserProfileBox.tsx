import {Easing, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {StoredUser} from '../lib/StoredUser';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient'; // or 'expo-linear-gradient'
import GradientShimmer from 'react-native-gradient-shimmer';

interface UserProfileBoxProps {
  user: StoredUser | null;
}

function UserProfileBox({user}: UserProfileBoxProps) {
  const {colors} = useTheme();

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

  // from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  const stringToColour = (str: string) => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, '0');
    }
    return colour;
  };

  return (
    <View style={styles.container}>
      <GradientShimmer
        LinearGradientComponent={LinearGradient}
        backgroundColor={stringToColour(
          user.first_name ? user.first_name.charAt(0) : 'b',
        )}
        highlightColor={stringToColour(
          user.last_name ? user.last_name.charAt(0) : 'b',
        )}
        animating={true}
        duration={4000}
        easing={Easing.linear}
        highlightWidth={150}
        height={50}
        width={50}
        style={{
          borderRadius: 100,
          marginRight: '5%',
        }}
      />
      <View>
        <Text style={styles.name_text}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.role_text}>
          {getRoleName(user.scouter, user.admin)}
        </Text>
      </View>
    </View>
  );
}

export default UserProfileBox;
