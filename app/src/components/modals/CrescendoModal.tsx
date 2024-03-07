import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';

const CrescendoModal = ({isActive, setIsActive}) => {
  const {colors} = useTheme();

  // used to calculate relative time
  const [firstTime, setFirstTime] = React.useState<number>(-1);

  // used to store the record of timestamps to actions
  const [record, setRecord] = React.useState<Map<number, string>>(new Map());

  // used for displaying to the user how many times each action was pressed
  const [actionCount, setActionCount] = React.useState<Map<string, number>>(
    new Map(),
  );

  // used for undo button
  const [timestampHistory, setTimestampHistory] = React.useState<number[]>([]);

  useEffect(() => {
    let tempActionCount = new Map<string, number>();

    tempActionCount.set('Source', 0);
    tempActionCount.set('Floor', 0);
    tempActionCount.set('Speaker', 0);
    tempActionCount.set('Amp', 0);
    tempActionCount.set('Missed', 0);

    setActionCount(tempActionCount);
  }, []);

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      padding: '5%',
      borderRadius: 10,
      margin: '5%',
      width: '90%',
      // height: '20%',
      justifyContent: 'center',
      flex: 1,
    },
    button_label: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    button_count: {
      color: 'white',
      textAlign: 'center',
    },
    category_label: {
      color: 'gray',
      fontWeight: '700',
    },
  });

  const addItemToRecord = (label: string) => {
    if (firstTime === -1) {
      setFirstTime(new Date().getTime());
    }
    console.log('Added item to record: ' + label);

    let relative_time = new Date().getTime() - firstTime;

    let newRecord = new Map(record);
    newRecord.set(relative_time, label);
    setRecord(newRecord);

    let newActionCount = new Map(actionCount);
    newActionCount.set(label, (newActionCount.get(label) ?? 0) + 1);
    setActionCount(newActionCount);

    // storing the last action in case of undo
    setTimestampHistory([...timestampHistory, relative_time]);
  };

  const undoLastAction = () => {
    console.log('Undoing last action');
    let lastTimestamp = timestampHistory.pop();
    if (lastTimestamp === undefined) {
      return;
    }
    let lastAction = record.get(lastTimestamp);
    if (lastAction === undefined) {
      return;
    }

    let newActionCount = new Map(actionCount);
    newActionCount.set(lastAction, (newActionCount.get(lastAction) ?? 0) - 1);
    setActionCount(newActionCount);

    let newRecord = new Map(record);
    newRecord.delete(lastTimestamp);
    setRecord(newRecord);

    // if no more actions, reset firstTime
    if (newRecord.size === 0) {
      setFirstTime(-1);
    }
  };

  const InputButton = ({label, color = colors.primary}) => {
    return (
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: color,
          },
        ]}
        onPress={() => {
          addItemToRecord(label);
        }}>
        <Text style={styles.button_label}>{label}</Text>
        <Text style={styles.button_count}>{actionCount.get(label) ?? 0}</Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={true} transparent={false} presentationStyle={'formSheet'}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.card,
        }}>
        <Pressable
          style={{alignSelf: 'flex-end', marginRight: '5%', marginTop: '5%'}}
          onPress={() => setIsActive(false)}>
          <Text style={{color: colors.text}}>Close</Text>
        </Pressable>
        <Text
          style={{
            color: colors.text,
            flex: 0.4,
            fontSize: 40,
            fontWeight: 'bold',
          }}>
          TELEOP
        </Text>
        <Pressable
          onPress={() => {
            undoLastAction();
          }}
          style={{
            flexDirection: 'row',
            width: '40%',
            backgroundColor: 'lightgray',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingHorizontal: '2%',
            paddingVertical: '8%',
            borderRadius: 10,
            position: 'absolute',
            top: '16%',
          }}>
          <Svg width="28" height="28" fill={colors.text} viewBox="0 0 16 16">
            <Path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
            />
            <Path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </Svg>
          <Text style={{color: colors.text, fontSize: 20, fontWeight: 'bold'}}>
            Undo
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // print out the record
            console.log('Record: ');
            record.forEach((value, key) => {
              console.log(key + ' ' + value);
            });
          }}>
          <Text style={{color: colors.text}}>Print Record</Text>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            marginBottom: '5%',
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              // backgroundColor: 'green',
              height: '100%',
            }}>
            <Text style={styles.category_label}>INPUT</Text>
            <InputButton label={'Source'} />
            <InputButton label={'Floor'} />
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              height: '100%',
              // backgroundColor: 'green',
            }}>
            <Text style={styles.category_label}>SCORING</Text>
            <InputButton label={'Speaker'} />
            <InputButton label={'Amp'} />
            <InputButton label={'Missed'} color={'red'} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CrescendoModal;
