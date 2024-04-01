import React, {View, Text} from 'react-native';
import Question from './Question';
import CheckBox from 'react-native-check-box';

function CheckboxFunction({
  title,
  doingReport,
  value,
  onValueChange,
  editingActive,
  colors,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {doingReport ? (
        <Question title={title} />
      ) : (
        <Text
          style={{
            color: editingActive ? colors.primary : colors.text,
            fontSize: 15,
            fontWeight: '600',
            paddingBottom: 5,
          }}>
          {title}
        </Text>
      )}
      <Text> </Text>
      <CheckBox
        onClick={() => {
          console.log(value);
          if (doingReport || editingActive) {
            onValueChange(!value);
          }
        }}
        isChecked={value}
      />
    </View>
  );
}

export default CheckboxFunction;
