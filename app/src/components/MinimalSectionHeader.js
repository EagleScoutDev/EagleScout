import React, {Text} from 'react-native';
import {isColorDark} from '../lib/ColorReadability';
import {useTheme} from '@react-navigation/native';

function MinimalSectionHeader(props) {
  const {colors} = useTheme();
  return (
    <Text
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: isColorDark(colors.background) ? 'gray' : 'lightgray',
        fontWeight: 'bold',
        fontSize: 12,
        paddingLeft: '2%',
        paddingTop: '2%',
      }}>
      {props.title.toUpperCase()}
    </Text>
  );
}

export default MinimalSectionHeader;
