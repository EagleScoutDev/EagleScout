import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Question from './Question';

function RadioButtons(props) {
  const styles = StyleSheet.create({
    circle: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: props.colors.text,
      alignItems: 'center',
      justifyContent: 'center',
      // marginRight: 10,
      marginRight: '6%',
    },
    selectedCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: props.colors.text,
      alignItems: 'center',
      justifyContent: 'center',
      // marginRight: 10,
      marginRight: '6%',
    },
    disabledSelectedCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: props.colors.text,
      alignItems: 'center',
      justifyContent: 'center',
      // marginRight: 10,
      marginRight: '6%',
      opacity: 0.6,
    },
  });

  const list = props.options.map((item, index) => {
    return (
      <View key={index}>
        <TouchableOpacity
          key={index}
          onPress={() => {
            props.onValueChange(item);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <View
            style={props.value === item ? styles.selectedCircle : styles.circle}
          />
          <Text style={{color: props.colors.text}}>{item}</Text>
        </TouchableOpacity>
      </View>
    );
  });

  const disabledList = props.options.map((item, index) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5,
        }}>
        <View
          style={
            props.value === item ? styles.disabledSelectedCircle : styles.circle
          }
        />
        <Text
          style={{
            color: props.colors.text,
          }}>
          {item}
        </Text>
      </View>
    );
  });
  return (
    <View>
      <Question title={props.title} required={props.required} />
      {props.disabled ? disabledList : list}
    </View>
  );
}

export default RadioButtons;
