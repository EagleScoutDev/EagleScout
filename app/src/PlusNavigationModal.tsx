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
    },
    title_text: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle_text: {
      color: 'grey',
      fontSize: 14,
    },
    grouping: {
      flexDirection: 'row',
      backgroundColor: colors.background,
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
      // paddingHorizontal: '4%',
      padding: '6%',
      marginRight: '4%',
      flex: 1,
      aspectRatio: 1,
      alignSelf: 'center',
    },
    text_container: {
      flexDirection: 'column',
      flex: 6,
    },
  });

  return (
    <>
      <View
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
            navigation.goBack();
          }}>
          <View style={styles.icon_box}>
            <Svg
              width="100%"
              height="100%"
              fill="currentColor"
              viewBox="0 0 16 16">
              <Path
                fill={'grey'}
                d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"
              />
              <Path
                fill="grey"
                d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"
              />
              <Path
                fill="grey"
                d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"
              />
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
            navigation.goBack();
          }}>
          <View style={styles.icon_box}>
            <Svg width="100%" height="100%" viewBox="0 0 16 16">
              <Path
                fill={'grey'}
                d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293z"
              />
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
      </View>
    </>
  );
};

export default PlusNavigationModal;
