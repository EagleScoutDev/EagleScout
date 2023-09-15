import React, {Text, TouchableOpacity, StyleSheet} from 'react-native';

function StandardButton({color, onPress, width = '80%', text}) {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: color,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      width: width,
      alignSelf: 'center',
    },
    button_text: {
      fontSize: 20,
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
    },
  });
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress()}>
      <Text style={styles.button_text}>{text}</Text>
    </TouchableOpacity>
  );
}

export default StandardButton;
