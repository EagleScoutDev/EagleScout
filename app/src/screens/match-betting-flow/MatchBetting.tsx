import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import UserAttributesDB from '../../database/UserAttributes';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import CompetitionsDB from '../../database/Competitions';

export const MatchBetting = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [matchNumber, setMatchNumber] = useState<number>();
  const [orgId, setOrgId] = useState<number>(-1);
  const [competitionActive, setCompetitionActive] = useState<boolean>(false);

  useEffect(() => {
    UserAttributesDB.getCurrentUserAttribute().then(userAttribute => {
      if (userAttribute) {
        setOrgId(userAttribute.organization_id);
      }
    });
    CompetitionsDB.getCurrentCompetition().then(competition => {
      if (competition) {
        setCompetitionActive(true);
      }
    });
  }, []);

  const styles = StyleSheet.create({
    textInput: {
      borderColor: 'gray',
      borderBottomWidth: 2,
      padding: 10,
      color: colors.text,
      fontFamily: 'monospace',
      minWidth: '40%',
      maxWidth: '60%',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 10,
      marginTop: 15,
      width: '80%',
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
  });

  if (orgId === -1) {
    return null;
  }

  if (orgId !== 1) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 30,
          }}>
          Bet on a match!
        </Text>
        <Text style={{color: colors.text, fontSize: 15, fontWeight: 'bold'}}>
          Betting is coming soon...
        </Text>
      </View>
    );
  }

  if (!competitionActive) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 30,
          }}>
          Bet on a match!
        </Text>
        <Text style={{color: colors.text, fontSize: 15, fontWeight: 'bold'}}>
          No active competition
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
      }}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 30,
          }}>
          Bet on a match!
        </Text>
        <View
          style={{
            flexDirection: 'column',
            gap: 20,
            height: '50%',
            width: '80%',
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 30,
            marginBottom: 30,
          }}>
          <Text style={{color: colors.text, fontSize: 15, fontWeight: 'bold'}}>
            Match number:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="###"
            placeholderTextColor={colors.text}
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={text => setMatchNumber(Number(text))}
          />
        </View>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (!matchNumber) {
              return;
            }
            navigation.navigate('BettingScreen', {matchNumber});
          }}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </TouchableWithoutFeedback>
    </View>
  );
};
