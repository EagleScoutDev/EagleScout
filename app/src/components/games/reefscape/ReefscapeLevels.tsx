import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const ReefscapeLevels = ({
  onSubmit,
  piece,
  position,
}: {
  onSubmit: (level: number) => void;
  piece: number;
  position: number;
}) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      padding: 10,
      width: 180,
      height: 100,
    },
  });
  const Button = ({
    level,
    onPress,
    text,
  }: {
    level: number;
    onPress: (level: number) => void;
    text: string;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(level);
          ReactNativeHapticFeedback.trigger('impactLight');
        }}>
        <View style={styles.button}>
          <Text style={{color: colors.text}}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: colors.text, fontSize: 24, fontWeight: 'bold'}}>
        Select Scoring Position
      </Text>
      <Button text={'Level 4'} onPress={onSubmit} level={4} />
      <Button text={'Level 3'} onPress={onSubmit} level={3} />
      <Button text={'Level 2'} onPress={onSubmit} level={2} />
      <Button text={'Level 1'} onPress={onSubmit} level={1} />
      <Button text={'Dropped'} onPress={onSubmit} level={0} />
    </View>
  );
};
