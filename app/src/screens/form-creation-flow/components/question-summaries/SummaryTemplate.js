import React, {TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {TrashCan} from '../../../../SVGIcons';
import {StyleSheet} from 'react-native';

const SummaryTemplate = ({children, onDelete}) => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 10,
      marginLeft: '5%',
      marginRight: '5%',
      marginTop: 5,
      marginBottom: 5,
      gap: 5,
    },
    trashCanContainer: {
      position: 'absolute',
      height: 30,
      width: 30,
      top: 5,
      right: 5,
    },
    childrenContainer: {
      marginRight: 30,
    },
  });

  return (
    <View style={styles.mainContainer}>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.trashCanContainer}>
          <TrashCan />
        </TouchableOpacity>
      )}
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

export default SummaryTemplate;
