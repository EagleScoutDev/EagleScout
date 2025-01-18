import {StyleSheet, TextInput, View} from 'react-native';
import RadioButtons from './RadioButtons';
import React from 'react';
import Stepper from './Stepper';
import Checkbox from './Checkbox';
import SliderType from './SliderType';
import Question from './Question';
import {useTheme} from '@react-navigation/native';

/**
 * A component that renders the appropriate data input type based on a string passed in.
 * @param item -
 * @param arrayData - an array containing the raw data per question
 * @param setArrayData - a function to update the above array
 * @returns {JSX.Element|null} the JSX component
 * @constructor
 */
function FormComponent({item, arrayData, setArrayData}) {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      padding: 10,
      color: colors.text,
    },
  });

  if (!arrayData) {
    return null;
  }

  if (item.type === 'radio') {
    return (
      <View>
        <RadioButtons
          disabled={false}
          title={item.question}
          required={item.required}
          options={item.options}
          value={item.options[arrayData[item.indice]]}
          colors={colors}
          onReset={() => {
            let a = [...arrayData];
            a[item.indice] = null;
            setArrayData(a);
          }}
          onValueChange={value => {
            let a = [...arrayData];
            a[item.indice] = item.options.indexOf(value);
            setArrayData(a);
          }}
        />
      </View>
    );
  } else if (item.type === 'textbox') {
    return (
      <View>
        <Question
          title={item.question}
          required={item.required}
          onReset={() => {
            let a = [...arrayData];
            a[item.indice] = '';
            setArrayData(a);
          }}
        />
        <TextInput
          placeholder={'Type here'}
          placeholderTextColor={colors.primary}
          style={styles.textInput}
          value={arrayData[item.indice]}
          onChangeText={text => {
            let a = [...arrayData];
            a[item.indice] = text;
            setArrayData(a);
          }}
          multiline={true}
        />
      </View>
    );
  } else if (item.type === 'number') {
    if (item.slider === true) {
      return (
        <SliderType
          low={item.low}
          high={item.high}
          step={item.step}
          question={item.question}
          onValueChange={newValue => {
            let a = [...arrayData];
            a[item.indice] = newValue;
            console.log(a);
            setArrayData(a);
          }}
          value={arrayData[item.indice]}
        />
      );
    } else {
      return (
        <Stepper
          title={item.question + (item.required ? '*' : '')}
          value={arrayData[item.indice]}
          onValueChange={newValue => {
            let a = [...arrayData];
            a[item.indice] = newValue;
            setArrayData(a);
          }}
        />
      );
    }
  } else if (item.type === 'checkboxes') {
    return (
      <Checkbox
        title={item.question}
        options={item.options}
        value={arrayData[item.indice]}
        disabled={false}
        onValueChange={value => {
          setArrayData(prev => {
            const newData = [...prev];
            newData[item.indice] = value;
            return newData;
          });
        }}
        colors={colors}
      />
    );
  }
}

export default FormComponent;
