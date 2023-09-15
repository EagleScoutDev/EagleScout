import {Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

function Question({title, required = false}) {
  const {colors} = useTheme();
  if (title) {
    return (
      <Text
        style={{
          color: colors.primary,
          textAlign: 'left',
          paddingBottom: 15,
          fontWeight: 'bold',
        }}>
        {title + (required ? '*' : '')}
      </Text>
    );
  }
}

export default Question;
