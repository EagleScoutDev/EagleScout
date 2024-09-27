import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {isTablet} from 'react-native-device-info';

const PlusNavigationModal = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: colors.background,
      paddingBottom: '10%',
      flexDirection: isTablet() ? 'row' : 'column',
    },
    title_text: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle_text: {
      color: colors.text,
      opacity: 0.6,
      fontSize: 14,
    },
    grouping: {
      flexDirection: isTablet() ? 'column' : 'row',
      backgroundColor: colors.background,
      justifyContent: isTablet() ? 'space-between' : 'flex-start',
      borderBottomWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: '5%',
      margin: '1%',
      flex: 1,
    },
    icon_box: {
      backgroundColor: colors.card,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: isTablet() ? '0%' : '4%',
      padding: isTablet() ? '4%' : '6%',
      marginRight: isTablet() ? '0%' : '4%',
      flex: 1,
      aspectRatio: 1,
      alignSelf: isTablet() ? 'auto' : 'center',
      marginBottom: isTablet() ? 30 : '0%',
    },
    text_container: {
      flexDirection: 'column',
      flex: 6,
    },
  });

  return (
    <>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          backgroundColor: 'grey',
          // make the blue part semi-transparent
          minHeight: '100%',
          maxHeight: '100%',
          opacity: 0.4,
          // z stack so it is in the back
          zIndex: -1,
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.grouping}
          onPress={() => {
            navigation.navigate('Home', {screen: 'Scout Report'});
          }}>
          <View style={styles.icon_box}>
            <Svg
              width="100%"
              height="100%"
              fill={colors.text}
              viewBox="0 0 16 16">
              <Path d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5" />
              <Path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
              <Path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
            </Svg>
          </View>
          <View style={styles.text_container}>
            <Text style={styles.title_text}>New Report</Text>
            <Text style={styles.subtitle_text}>
              Scouting reports are used to collect data on a robot for a single
              match.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.grouping}
          onPress={() => {
            navigation.navigate('Home', {screen: 'Note'});
          }}>
          <View style={styles.icon_box}>
            <Svg
              fill={colors.text}
              width="100%"
              height="100%"
              viewBox="0 0 16 16">
              <Path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293z" />
            </Svg>
          </View>
          <View style={styles.text_container}>
            <Text style={styles.title_text}>New Note</Text>
            <Text style={styles.subtitle_text}>
              Notes are singular observations on robot performance. They are not
              as comprehensive as scout reports.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.grouping}
          onPress={() => {
            navigation.navigate('MatchBetting');
          }}>
          <View style={styles.icon_box}>
            <Svg
              fill={colors.text}
              width="100%"
              height="100%"
              viewBox="0 0 16 16">
              <Path d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0" />
              <Path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
              <Path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
              <Path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
            </Svg>
          </View>
          <View style={styles.text_container}>
            <Text style={styles.title_text}>Match Bet</Text>
            <Text style={styles.subtitle_text}>Bet on a match</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PlusNavigationModal;
