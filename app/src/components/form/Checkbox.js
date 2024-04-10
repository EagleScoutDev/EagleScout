import React, {View, Text} from 'react-native';
import Question from './Question';
import CheckBox from 'react-native-check-box';

function CheckboxFunction({
  title,
  options,
  disabled,
  value,
  onValueChange,
  colors,
}) {
  if (!value) return null;
  return (
    <View>
      <Question title={title} />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        {options.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <CheckBox
                onClick={() => {
                  if (disabled) return;
                  if (value.includes(item)) {
                    onValueChange(value.filter(i => i !== item));
                  } else {
                    onValueChange([...value, item]);
                  }
                }}
                isChecked={value.includes(item)}
                style={{
                  marginRight: '6%',
                }}
              />
              <Text style={{color: colors.text}}>{item}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default CheckboxFunction;
