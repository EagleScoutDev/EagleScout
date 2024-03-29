import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {
  CrescendoActionType,
  CrescendoActions,
  getActionForLink,
} from './CrescendoActions';

const CrescendoTeleopModal = forwardRef(
  (
    {
      startRelativeTime,
      setStartRelativeTime,
      timeline,
      setTimeline,
      isActive,
      setIsActive,
      onLabelPress,
      onLabelUndo,
    }: {
      startRelativeTime: number;
      setStartRelativeTime: (firstTime: number) => void;
      timeline: Map<number, string>;
      setTimeline: (record: Map<number, string>) => void;
      isActive: boolean;
      setIsActive: (active: boolean) => void;
      onLabelPress: (label: string) => void;
      onLabelUndo: (label: string) => void;
    },
    ref,
  ) => {
    const {colors} = useTheme();

    // used for displaying to the user how many times each action was pressed
    const [actionCount, setActionCount] = useState<
      Map<CrescendoActionType, number>
    >(new Map());

    // used for undo button
    const [timestampHistory, setTimestampHistory] = useState<number[]>([]);

    useImperativeHandle(ref, () => ({
      // when user changes a number on the non-gamified form, call this function to update the action count on the gamified ui
      changeActionCount: (label: CrescendoActionType, change: number) => {
        console.log('Changing action count for ' + label + ' by ' + change);
        console.log('Old action count: ' + actionCount.get(label));
        console.log(actionCount);
        setActionCount(prevActionCount => {
          let newActionCount = new Map(prevActionCount);
          newActionCount.set(label, (newActionCount.get(label) ?? 0) + change);
          return newActionCount;
        });
      },
    }));

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

    const addItemToRecord = (action: CrescendoActionType) => {
      let relative_time = new Date().getTime() - startRelativeTime;
      if (startRelativeTime === -1) {
        setStartRelativeTime(new Date().getTime());
        relative_time = 0;
      }
      const label = CrescendoActions[action].link_name;
      console.log('Added item to record: ' + label);

      let newRecord = new Map(timeline);
      newRecord.set(relative_time, label);
      setTimeline(newRecord);

      let newActionCount = new Map(actionCount);
      newActionCount.set(action, (newActionCount.get(action) ?? 0) + 1);
      setActionCount(newActionCount);

      onLabelPress(label);

      // storing the last action in case of undo
      setTimestampHistory([...timestampHistory, relative_time]);
    };

    const undoLastAction = () => {
      console.log('Undoing last action');
      let lastTimestamp = timestampHistory.pop();
      if (lastTimestamp === undefined) {
        return;
      }
      let lastAction = timeline.get(lastTimestamp);
      if (lastAction === undefined) {
        return;
      }

      let newActionCount = new Map(actionCount);
      newActionCount.set(lastAction, (newActionCount.get(lastAction) ?? 0) - 1);
      setActionCount(newActionCount);

      let newRecord = new Map(timeline);
      newRecord.delete(lastTimestamp);
      setTimeline(newRecord);

      onLabelUndo(lastAction);

      // if no more actions, reset firstTime
      if (newRecord.size === 0) {
        setStartRelativeTime(-1);
      }
    };

    const InputButton = ({
      action,
      color = colors.primary,
    }: {
      action: CrescendoActionType;
      color?: string;
    }) => {
      return (
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: color,
            },
          ]}
          onPress={() => {
            addItemToRecord(action);
          }}>
          <Text style={styles.button_label}>
            {CrescendoActions[action].name}
          </Text>
          <Text style={styles.button_count}>
            {actionCount.get(action) ?? 0}
          </Text>
        </Pressable>
      );
    };

    return (
      <Modal
        visible={isActive}
        transparent={false}
        animationType={'slide'}
        presentationStyle={'formSheet'}>
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
              backgroundColor: colors.border,
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
            <Text
              style={{color: colors.text, fontSize: 20, fontWeight: 'bold'}}>
              Undo
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              // print out the record
              console.log('Record: ');
              timeline.forEach((value, key) => {
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
              <InputButton action={CrescendoActionType.PickupSource} />
              <InputButton action={CrescendoActionType.PickupGround} />
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
              <InputButton action={CrescendoActionType.ScoreSpeaker} />
              <InputButton action={CrescendoActionType.ScoreAmp} />
              <InputButton
                action={CrescendoActionType.MissSpeaker}
                color={'red'}
              />
              <InputButton action={CrescendoActionType.MissAmp} color={'red'} />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

export default CrescendoTeleopModal;
