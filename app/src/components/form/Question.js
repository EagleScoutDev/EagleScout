import {Pressable, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

function Question({title, required = false, onReset}) {
  const {colors} = useTheme();
  if (title) {
    return (
      <Pressable onLongPress={onReset}>
        <Text
          style={{
            color: colors.text,
            textAlign: 'left',
            paddingBottom: 10,
            // paddingTop: 15,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          {title + (required ? '*' : '')}
        </Text>
      </Pressable>
    );
  }
}

export default Question;
