import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import Question from './Question';
import {useTheme} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

function Stepper(props) {
  const {colors} = useTheme();

  let changeValue = type => {
    if (type === 'increment') {
      props.onValueChange(
        props.value === '' ? 0 : Number.parseInt(props.value, 10) + 1,
      );
      ReactNativeHapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    } else {
      if (props.value > 0) {
        props.onValueChange(props.value - 1);
        ReactNativeHapticFeedback.trigger('impactSoft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      padding: 10,
      width: 100,
      height: 75,

      // borderWidth: 4,
      // borderColor: colors.border,
    },
    background: {
      flexDirection: 'column',
      // paddingVertical: '5%',
      // backgroundColor: colors.card,
      elevation: 5,
      borderRadius: 10,
    },
    number: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      width: 80,
      color: colors.text,
    },
    stepper_value: {
      color: 'white',
      fontSize: 30,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  });

  return (
    <View style={styles.background} key={props.index}>
      <Question
        title={props.title}
        onReset={() => {
          props.onValueChange(0);
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity
          disabled={props.value === 0}
          onPress={() => {
            changeValue('minus');
          }}>
          <View
            style={{
              ...styles.button,
              backgroundColor: props.value === 0 ? 'darkgray' : colors.primary,
            }}>
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
