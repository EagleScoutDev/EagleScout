import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';

export const MatchBetting = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [matchNumber, setMatchNumber] = useState<number>();

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
    </View>
  );
};
