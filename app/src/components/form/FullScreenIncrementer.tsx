import React, {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../MinimalSectionHeader';
import StandardButton from '../StandardButton';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

function LargeIncrementer({
  color,
  title,
  onHighPress,
  onMidPress,
  onLowPress,
  low = 0,
  mid = 0,
  high = 0,
  textColor,
}) {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View style={{marginBottom: '20%'}}>
        <MinimalSectionHeader title={title} />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
          width: '80%',
        }}>
        <TouchableOpacity
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactHeavy', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onHighPress();
          }}
          style={{
            backgroundColor: color,
            flex: 1,
            borderTopStartRadius: 25,
            borderTopEndRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: textColor, fontSize: 20, fontWeight: 'bold'}}>
            High
          </Text>
          <Text style={{color: textColor}}>({high})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onMidPress();
          }}
          style={{
            backgroundColor: color,
            flex: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: textColor, fontSize: 20, fontWeight: 'bold'}}>
            Mid
          </Text>
          <Text style={{color: textColor}}>({mid})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onLowPress();
          }}
          style={{
            backgroundColor: color,
            flex: 1,
            borderBottomStartRadius: 25,
            borderBottomEndRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: textColor, fontSize: 20, fontWeight: 'bold'}}>
            Low
          </Text>
          <Text style={{color: textColor}}>({low})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FullScreenIncrementer({setVisible, cones, cubes, setScored}) {
  const {colors} = useTheme();
  const [cone, setCone] = useState(cones);
  const [cube, setCube] = useState(cubes);
  const [deleteMode, setDeleteMode] = useState(false);

  // time to implement a queue
  const [undoQueue, setUndoQueue] = useState([]);

  const styles = StyleSheet.create({
    level_label: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 20,
    },
    level_container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: '20%',
      paddingTop: '10%',
    },
    single_incrementer: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    modal_container: {
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      marginTop: '10%',
      height: '100%',
    },
    button_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
    },
    incrementer_container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: '60%',
      paddingBottom: '20%',
    },
    delete_mode: {
      flexDirection: 'row',
      alignItems: 'center',
      // add spacing between each item
      justifyContent: 'space-between',
      // add spacing around the outside
      marginHorizontal: '5%',
      backgroundColor: colors.card,
      padding: 10,
      borderRadius: 10,
      width: '60%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

  /**
   * Undoes the latest action (if it is adding an object)
   */
  function handleUndo() {
    if (undoQueue.length === 0) {
      return;
    }

    const latestAction = undoQueue.pop();
    const pieceType = latestAction.type;
    const level = latestAction.level;

    if (pieceType === 'cone') {
      const index = cone.indexOf(level);
      if (index > -1) {
        cone.splice(index, 1);
      }
      setCone([...cone]);
    } else if (pieceType === 'cube') {
      const index = cube.indexOf(level);
      if (index > -1) {
        cube.splice(index, 1);
      }
      setCube([...cube]);
    }
  }

  function handlePress(level, type) {
    if (type === 'cone') {
      if (deleteMode) {
        // remove a 'high' item from the list
        const index = cone.indexOf(level);
        if (index > -1) {
          cone.splice(index, 1);
        }
        setCone([...cone]);
      } else {
        setCone([...cone, level]);
        setUndoQueue([...undoQueue, {type: 'cone', level: level}]);
      }
    } else if (type === 'cube') {
      if (deleteMode) {
        // remove a 'high' item from the list
        const index = cube.indexOf(level);
        if (index > -1) {
          cube.splice(index, 1);
        }
        setCube([...cube]);
      } else {
        setCube([...cube, level]);
        setUndoQueue([...undoQueue, {type: 'cube', level: level}]);
      }
    }
  }

  return (
    <View style={styles.modal_container}>
      <View style={styles.button_container}>
        <StandardButton
          text={cube !== cubes || cone !== cones ? 'Cancel' : 'Close'}
          width={'40%'}
          color={'red'}
          onPress={() => {
            setVisible(false);
          }}
        />
        {(cube !== cubes || cone !== cones) && (
          <StandardButton
            text={'Save'}
            color={colors.primary}
            width={'40%'}
            onPress={() => {
              // call setScored, which contains a dictionary
              // the dictionary has two keys, cone and cube
              // each key has an array filled with the values
              setScored({cones: cone, cubes: cube});
              setVisible(false);
            }}
          />
        )}
      </View>

      <StandardButton text={'Undo'} onPress={handleUndo} color={'blue'} />
      {/*  this will be the view containing the delete mode switch */}
      <View style={styles.delete_mode}>
        <Text
          style={{
            color: deleteMode ? 'red' : colors.text,
            // color: colors.text,
            fontWeight: 'bold',
          }}>
          Delete Mode
        </Text>
        <Switch
          value={deleteMode}
          onValueChange={() => {
            setDeleteMode(!deleteMode);
            ReactNativeHapticFeedback.trigger('soft', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
          }}
          trackColor={{false: '', true: 'red'}}
        />
      </View>
      {/*  this will be the view containing the two columns side by side*/}
      {/*<Text style={{color: colors.text}}>cone: {cone.toString()}</Text>*/}
      {/*<Text style={{color: colors.text}}>cube: {cube.toString()}</Text>*/}
      <View style={styles.level_container}>
        <Text style={styles.level_label}>
          Low:{' '}
          {cone.filter(c => c === 'low').length +
            cube.filter(c => c === 'low').length}
        </Text>
        <Text style={styles.level_label}>
          Mid:{' '}
          {cone.filter(c => c === 'mid').length +
            cube.filter(c => c === 'mid').length}
        </Text>
        <Text style={styles.level_label}>
          High:{' '}
          {cone.filter(c => c === 'high').length +
            cube.filter(c => c === 'high').length}
        </Text>
      </View>
      <View style={styles.incrementer_container}>
        <View style={styles.single_incrementer}>
          <LargeIncrementer
            color={'purple'}
            textColor={'white'}
            title={'Cube'}
            onHighPress={() => handlePress('high', 'cube')}
            onMidPress={() => handlePress('mid', 'cube')}
            onLowPress={() => handlePress('low', 'cube')}
            high={cube.filter(item => item === 'high').length}
            mid={cube.filter(item => item === 'mid').length}
            low={cube.filter(item => item === 'low').length}
          />
        </View>
        <View style={styles.single_incrementer}>
          <LargeIncrementer
            color={'gold'}
            textColor={'black'}
            title={'Cone'}
            onHighPress={() => handlePress('high', 'cone')}
            onMidPress={() => handlePress('mid', 'cone')}
            onLowPress={() => handlePress('low', 'cone')}
            high={cone.filter(item => item === 'high').length}
            mid={cone.filter(item => item === 'mid').length}
            low={cone.filter(item => item === 'low').length}
          />
        </View>
      </View>
    </View>
  );
}

export default FullScreenIncrementer;
