import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import UpcomingRoundsView from '../UpcomingRoundsView';
import Svg, {Path} from 'react-native-svg';

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
      marginHorizontal: '5%',
    },
    scout_button: {
      backgroundColor: colors.primary,
      padding: '5%',
      paddingRight: '0%',
      borderRadius: 25,
      justifyContent: 'center',
      position: 'absolute',
      bottom: '4%',
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
        <Text style={{paddingLeft: '5%', color: colors.text}}>
          Pit scouting is not yet available. Please check back later.
        </Text>
      </ScrollView>
      {/*<Pressable*/}
      {/*  style={styles.scout_button}*/}
      {/*  onPress={() => {*/}
      {/*    navigation.navigate('Scout Report');*/}
      {/*  }}>*/}
      {/*  <View style={{flexDirection: 'row'}}>*/}
      {/*    <Text style={styles.button_text}>Begin Scouting</Text>*/}
      {/*    <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">*/}
      {/*      <Path*/}
      {/*        fill="white"*/}
      {/*        d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"*/}
      {/*      />*/}
      {/*    </Svg>*/}
      {/*  </View>*/}
      {/*</Pressable>*/}
    </View>
  );
};

export default HomeMain;
