import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// create a react component that shows the children in a row

// this function is a template for other functions to use
// it contains space for the title of the section, and for the data input
function FormSection({children, title, colors, disabled = false}) {
  const [visible, setVisible] = useState(true);
  const styles = StyleSheet.create({
    container: {
      // flexDirection: 'column',
      // minWidth: '85%',
      // maxWidth: '85%',
      paddingTop: '5%',
      paddingBottom: '3%',
      // minWidth: '95%',
      width: '100%',
      paddingHorizontal: '5%',
      // backgroundColor: colors.card,
      // borderRadius: 10,
      borderColor: colors.border,
      borderTopWidth: 2,
      borderBottomWidth: 2,

      // flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    external_area: {
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      // marginVertical: '3%',
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
            {title}
          </Text>
        )}
        {visible && children}
      </View>
    </View>
  );
}

export default FormSection;
