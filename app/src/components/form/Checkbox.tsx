import React, {View} from 'react-native';
import Question from './Question';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

function CheckboxFunction({
  title,
  options,
  disabled,
  value,
  onValueChange,
  colors,
}) {
  if (!value) {
    return null;
  }
  return (
    <View>
      <Question
        title={title}
        onReset={() => {
          onValueChange([]);
        }}
      />
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
              <BouncyCheckbox
                onPress={checked => {
                  if (disabled) {
                    return;
                  }
                  if (!checked) {
                    onValueChange(value.filter(i => i !== item));
                  } else {
                    onValueChange([...value, item]);
                  }
                }}
                isChecked={value.includes(item)}
                style={{
                  marginRight: '6%',
                }}
                textStyle={{
                  color: colors.text,
                  textDecorationLine: 'none',
                }}
                iconStyle={{
                  borderRadius: 3,
                }}
                fillColor={colors.text}
                innerIconStyle={{borderRadius: 3}}
                text={item}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default CheckboxFunction;
