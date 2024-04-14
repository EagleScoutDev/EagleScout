import React, {Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

const PercentageWinBar = ({
  bluePercentage,
  redPercentage,
}: {
  bluePercentage: number;
  redPercentage: number;
}) => {
  const {colors} = useTheme();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: '10%',
          justifyContent: 'center',
        }}>
        {redPercentage !== 100 && (
          <View
            style={{
              backgroundColor: 'blue',
              minWidth: `${bluePercentage}%`,
              height: 24,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              justifyContent: 'center',
              borderRadius: bluePercentage === 100 ? 10 : 0,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: bluePercentage > redPercentage ? 'bold' : 'normal',
              }}>
              {bluePercentage}%
            </Text>
          </View>
        )}
        {redPercentage !== 0 && (
          <View
            style={{
              backgroundColor: 'red',
              width: `${redPercentage}%`,
              height: 24,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
              justifyContent: 'center',
              borderRadius: redPercentage === 100 ? 10 : 0,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: redPercentage > bluePercentage ? 'bold' : 'normal',
              }}>
              {redPercentage}%
            </Text>
          </View>
        )}
      </View>
      {/*<Text*/}
      {/*  style={{*/}
      {/*    color: bluePercentage > redPercentage ? colors.primary : 'red',*/}
      {/*    textAlign: 'center',*/}
      {/*    marginTop: 10,*/}
      {/*    fontSize: 20,*/}
      {/*  }}>*/}
      {/*  {bluePercentage > redPercentage ? bluePercentage : redPercentage}%{' '}*/}
      {/*  likelihood of {bluePercentage > redPercentage ? 'Blue' : 'Red'} Alliance*/}
      {/*  win*/}
      {/*</Text>*/}
    </View>
  );
};

export default PercentageWinBar;
