import React, {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

function StandardButton({
  color,
  onPress,
  width = '80%',
  text,
  isLoading = false,
}) {
  const baseButtonStyle = {
    backgroundColor: color,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: width,
    alignSelf: 'center',
  };
  const styles = StyleSheet.create({
    button: baseButtonStyle,
    button_loading: {
      ...baseButtonStyle,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      backgroundColor: 'gray',
    },
    button_text: {
      fontSize: 20,
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
    },
  });
  return (
    <TouchableOpacity
      style={isLoading ? styles.button_loading : styles.button}
      onPress={onPress}
      disabled={isLoading}>
      {isLoading && <ActivityIndicator size="small" color="#ffffff" />}
      <Text style={styles.button_text}>{text}</Text>
    </TouchableOpacity>
  );
}

export default StandardButton;
