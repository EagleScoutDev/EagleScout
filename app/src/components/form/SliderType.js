import {View, Text} from 'react-native';
import Slider from '@react-native-community/slider';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Question from './Question';

function SliderType({
  low,
  high,
  step,
  question,
  value,
  onValueChange,
  disabled = false,
}) {
  const {colors} = useTheme();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <View
      style={{
        flexDirection: 'column',
        marginVertical: 10,
      }}>
      <Question title={`${question} (${low} - ${high})`} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{color: colors.text}}>Value: {localValue}</Text>
        <Slider
          disabled={disabled}
          style={{width: 200, height: 40}}
          value={localValue}
          maximumValue={Number.parseInt(high)}
          minimumValue={Number.parseInt(low)}
          step={step ? Number.parseInt(step) : 1}
          // This setup allows user to see live slider value update, but only on release does it update the state
          // This minimizes the number of rewrites of the array required.
          onValueChange={setLocalValue}
          onSlidingComplete={onValueChange}
        />
      </View>
    </View>
  );
}

export default SliderType;
