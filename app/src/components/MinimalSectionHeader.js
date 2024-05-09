import React, {Text} from 'react-native';
import {isColorDark} from '../lib/ColorReadability';
import {useTheme} from '@react-navigation/native';

function MinimalSectionHeader(props) {
  const {colors} = useTheme();

  const getLighterColor = color => {
    const rgbValues = color.match(/\d+/g).map(Number);

    const components = {
      R: rgbValues[0],
      G: rgbValues[1],
      B: rgbValues[2],
    };

    const lighter = {
      R: components.R + 50,
      G: components.G + 50,
      B: components.B + 50,
    };

    return 'rgb(' + lighter.R + ', ' + lighter.G + ', ' + lighter.B + ')';
  };

  return (
    <Text
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: getLighterColor(colors.primary),
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
