import {TextInput, View} from 'react-native';
import RadioButtons from './RadioButtons';
import React from 'react';
import Stepper from './Stepper';
import Checkbox from './Checkbox';
import SliderType from './SliderType';
import Question from './Question';

// TODO: Experiment with not passing in styles and just using the styles from the parent component
/**
 * A component that renders the appropriate data input type based on a string passed in.
 * @param item -
 * @param styles - styling passed in by the parent
 * @param colors - the color scheme associated with the device scheme (light or dark)
 * @param arrayData - an array containing the raw data per question
 * @param setArrayData - a function to update the above array
 * @returns {JSX.Element|null} the JSX component
 * @constructor
 */
function FormComponent({item, styles, colors, arrayData, setArrayData}) {
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
          placeholderTextColor={'gray'}
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
  } else if (item.type === 'checkbox') {
    return (
      <Checkbox
        colors={colors}
        title={item.question}
        required={item.required}
        options={item.options}
        value={arrayData[item.indice]}
        onValueChange={value => {
          const itemIndex = item.options.indexOf(value);
          let tempArray = [...arrayData[item.indice]];

          if (tempArray.includes(itemIndex)) {
            tempArray = tempArray.filter(b => b !== itemIndex);
          } else {
            tempArray.push(itemIndex);
          }

          let a = [...arrayData];
          a[item.indice] = tempArray;
          setArrayData(a);
        }}
      />
    );
  }
}

export default FormComponent;
