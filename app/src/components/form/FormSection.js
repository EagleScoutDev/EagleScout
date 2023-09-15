import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// create a react component that shows the children in a row

// this function is a template for other functions to use
// it contains space for the title of the section, and for the data input
function FormSection({children, title, colors, disabled = false}) {
  const [visible, setVisible] = useState(true);
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      minWidth: '85%',
      maxWidth: '85%',
      paddingTop: '5%',
      paddingBottom: '3%',
      paddingHorizontal: '5%',
      backgroundColor: colors.card,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 10,
      borderColor: colors.border,
      borderWidth: 3,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    external_area: {
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: '3%',
    },
  });

  return (
    <View style={styles.external_area}>
      <View style={styles.container}>
        {/*TODO: Display a little green checkmark (like a JUNIT test passing) if all required questions in the section are filled out*/}
        {title !== '' && (
          <Text
            style={styles.title}
            disabled={disabled}
            onPress={() => {
              if (!disabled) {
                setVisible(!visible);
              }
            }}>
            {title.toLowerCase()}
          </Text>
        )}
        {visible && children}
      </View>
    </View>
  );
}

export default FormSection;
