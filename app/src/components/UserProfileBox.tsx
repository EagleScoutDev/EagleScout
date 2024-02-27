import {StyleSheet, Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {useTheme} from '@react-navigation/native';
import {StoredUser} from '../lib/StoredUser';
import React from 'react';

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

  return (
    <View style={styles.container}>
      <View style={{marginRight: '5%'}}>
        <Svg width={25} height={25} viewBox="0 0 16 16">
          <Path fill="gray" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <Path
            fill="gray"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </Svg>
      </View>
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
