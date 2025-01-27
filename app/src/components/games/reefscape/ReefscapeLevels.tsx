import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ReefscapeActionType} from './ReefscapeActions';

export const ReefscapeLevels = ({
  onSubmit,
}: {
  onSubmit: (level: ReefscapeActionType) => void;
}) => {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      padding: 10,
      margin: 10,
      width: 160,
      height: 80,
    },
  });
  const Button = ({
    level,
    onPress,
    text,
  }: {
    level: ReefscapeActionType;
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
      <Button
        text={'Level 4'}
        onPress={onSubmit}
        level={ReefscapeActionType.ScoreCoralL4}
      />
      <Button
        text={'Level 3'}
        onPress={onSubmit}
        level={ReefscapeActionType.ScoreCoralL3}
      />
      <Button
        text={'Level 2'}
        onPress={onSubmit}
        level={ReefscapeActionType.ScoreCoralL2}
      />
      <Button
        text={'Level 1'}
        onPress={onSubmit}
        level={ReefscapeActionType.ScoreCoralL1}
      />
      <Button
        text={'Dropped'}
        onPress={onSubmit}
        level={ReefscapeActionType.MissCoral}
      />
    </View>
  );
};
