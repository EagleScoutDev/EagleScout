import {View, Text} from 'react-native';
import Slider from '@react-native-community/slider';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Question from './Question';

function SliderLabel({text}) {
  const {colors} = useTheme();
  return (
    <Text
      style={{
        color: colors.text,
        fontSize: 12,
      }}>
      {text}
    </Text>
  );
}

function SliderType({
  low,
  high,
  step,
  question,
  value,
  onValueChange,
  disabled = false,
  minLabel,
  maxLabel,
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
      <Question
        title={`${question} (${low} - ${high})`}
        onReset={() => {
          setLocalValue(low);
          onValueChange(low);
        }}
      />
      <View>
        <Slider
          disabled={disabled}
          value={localValue}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          maximumValue={Number.parseInt(high, 10)}
          minimumValue={Number.parseInt(low, 10)}
          step={step ? Number.parseInt(step, 10) : 1}
          // This setup allows user to see live slider value update, but only on release does it update the state
          // This minimizes the number of rewrites of the array required.
          onValueChange={setLocalValue}
          onSlidingComplete={onValueChange}
        />
        {/*Label the min/max values and current value*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <SliderLabel text={minLabel ? minLabel : low} />
          <Text
            style={{
              color: colors.primary,
              fontSize: 13,
              alignSelf: 'center',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {localValue}
          </Text>
          <SliderLabel text={maxLabel ? maxLabel : high} />
        </View>
      </View>
    </View>
  );
}

export default SliderType;
