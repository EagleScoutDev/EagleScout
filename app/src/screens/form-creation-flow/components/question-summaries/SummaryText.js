import React, {StyleSheet, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

const SummaryText = ({children, bold = false}) => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.text,
      fontSize: 18,
      fontWeight: bold ? '600' : '400',
    },
  });

  return <Text style={styles.text}>{children}</Text>;
};

export default SummaryText;
