import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import Question from './Question';

function Stepper(props) {
  let changeValue = type => {
    if (type === 'increment') {
      props.onValueChange(
        props.value === '' ? 0 : Number.parseInt(props.value, 10) + 1,
      );
    } else {
      if (props.value > 0) {
        props.onValueChange(props.value - 1);
      }
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: props.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: 10,
      width: 100,
      height: 75,
    },
    background: {
      flexDirection: 'column',
      paddingVertical: '5%',
      backgroundColor: props.colors.card,
      elevation: 5,
      borderRadius: 10,
    },
    question: {
      textAlign: 'left',
      paddingBottom: 15,
      color: props.colors.primary,
      fontWeight: 'bold',
    },
    number: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      width: 80,
      color: props.colors.text,
    },
    stepper_value: {
      color: 'white',
      fontSize: 20,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  });

  return (
    <View style={styles.background}>
      <Question title={props.title} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            changeValue('minus');
          }}>
          <View style={styles.button}>
            <Text style={styles.stepper_value}>-</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.number}>{props.value}</Text>
        <TouchableOpacity onPress={() => changeValue('increment')}>
          <View style={styles.button}>
            <Text style={styles.stepper_value}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Stepper;
