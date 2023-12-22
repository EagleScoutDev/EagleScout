import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import UpcomingRoundsView from '../UpcomingRoundsView';

const HomeMain = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      marginTop: '10%',
      paddingHorizontal: '2%',
      flex: 1,
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: colors.text,
      padding: '3%',
      paddingLeft: '5%',
      marginTop: '5%',
    },
    heading_two: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      padding: '3%',
      paddingLeft: '5%',
      marginTop: '3%',
    },
    button_text: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    scout_button: {
      backgroundColor: colors.primary,
      padding: '5%',
      borderRadius: 25,
      justifyContent: 'center',
      position: 'absolute',
      bottom: '2%',
      right: '5%',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={false}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.heading_two}>Upcoming Rounds</Text>
        <UpcomingRoundsView navigation={navigation} />
        <Text style={styles.heading_two}>Pit Scouting</Text>
      </ScrollView>
      <Pressable
        style={styles.scout_button}
        onPress={() => {
          navigation.navigate('Scout Report');
        }}>
        <Text style={styles.button_text}>Begin Scouting</Text>
      </Pressable>
    </View>
  );
};

export default HomeMain;
