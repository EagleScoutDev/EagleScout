import {View, Text, TouchableOpacity} from 'react-native';
import Question from './Question';

// TODO: this should set the value of which items are selected one level higher.
/**
 * A checkbox type, which allows for multiple items to be selected
 * @param key - unique key for rendering purposes
 * @param colors - the colors associated with the device's color scheme (light or dark)
 * @param title - the title of the checkbox
 * @param options - the options available in a checkbox
 * @param value - the indices of which items are selected, in an array
 * @param onValueChange - a method to update the checkbox's value in the parent
 * @param disabled - whether the checkbox can be interacted with or not
 * @returns {JSX.Element} renders the checkbox
 * @constructor
 */
function Checkbox({
  key,
  colors,
  title,
  options,
  value = [],
  onValueChange,
  disabled,
  required,
}) {
  return (
    <View key={key}>
      {/*<Text>checkbox!</Text>*/}
      {/*{title && (*/}
      {/*  <Text style={{color: colors.primary, fontWeight: 'bold'}}>{title}</Text>*/}
      {/*)}*/}
      <Question title={title} required={required} />
      {/*<Text>{selected}</Text>*/}
      {/*<Text>{JSON.stringify(value)}</Text>*/}
      {options.map((option, index) => {
        return (
          <TouchableOpacity
            disabled={disabled}
            key={index}
            onPress={() => {
              onValueChange(option);
            }}
            style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.text,
                padding: 10,
                marginRight: 10,
                // if the index is a key in the value dictionary, then it is selected
                backgroundColor: value.includes(options.indexOf(option))
                  ? 'lightgreen'
                  : 'transparent',
              }}
            />
            <Text
              style={{
                color: colors.text,
              }}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Checkbox;
