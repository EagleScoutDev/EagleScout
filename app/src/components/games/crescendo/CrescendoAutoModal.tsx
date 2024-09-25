import {Modal, Pressable, Text, View} from 'react-native';
import React, {useState, useMemo} from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {CrescendoField} from './CrescendoField';
import {AutoPath} from './AutoPath';
import {
  CrescendoActionType,
  CrescendoActions,
  CrescendoActionIcon,
} from './CrescendoActions';

interface HistoryAction {
  action: string;
  noteId: number;
}

interface LinkItemMap {
  [key: string]: {
    value: number;
    index: number;
  };
}

const MAX_HEIGHT = -300;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({
  positiveAction,
  negativeAction,
  color,
  flex,
  setHistory,
  setAutoPath,
  setArrayData,
  linkItemMap,
}: {
  positiveAction: CrescendoActionType;
  negativeAction: CrescendoActionType;
  color: string;
  flex?: number;
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>;
  setAutoPath: React.Dispatch<React.SetStateAction<AutoPath>>;
  setArrayData: React.Dispatch<React.SetStateAction<any[]>>;
  linkItemMap: LinkItemMap;
}) => {
  const colorAsRgb = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };
  const doAction = (action: CrescendoActionType, change: number) => {
    setHistory(history => [
      ...history,
      {
        action: CrescendoActions[action].link_name,
        noteId: positiveAction,
      },
    ]);
    setArrayData(prevArrayData => {
      const linkItem = linkItemMap[CrescendoActions[action].link_name];
      if (linkItem) {
        const {index} = linkItem;
        const newArrayData = [...prevArrayData];
        newArrayData[index] = prevArrayData[index] + change;
        return newArrayData;
      } else {
        return prevArrayData;
      }
    });
    setAutoPath(paths => [
      ...paths,
      {
        type: action,
        order: paths.at(-1)?.order ?? 0,
      },
    ]);
  };
  const runActionOnJs = (action: CrescendoActionType, change: number) => {
    'worklet';
    runOnJS(doAction)(action, change);
  };

  const triggerHapticWorklet = () => {
    'worklet';
    runOnJS(() => {
      ReactNativeHapticFeedback.trigger('impactLight');
    })();
  };

  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY < 0 && e.translationY > MAX_HEIGHT) {
        position.value = e.translationY;
      }
      if (e.translationY === MAX_HEIGHT) {
        triggerHapticWorklet();
      }
    })
    .onEnd(e => {
      if (e.translationY < -100) {
        runActionOnJs(negativeAction, 1);
      }
      position.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: position.value}],
    backgroundColor: `rgb(${
      colorAsRgb.r + (position.value / MAX_HEIGHT) * (255 - colorAsRgb.r)
    }, ${colorAsRgb.g + (position.value / MAX_HEIGHT) * (87 - colorAsRgb.g)}, ${
      colorAsRgb.b + (position.value / MAX_HEIGHT) * (87 - colorAsRgb.b)
    })`,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedPressable
        style={[
          {
            backgroundColor: color,
            paddingHorizontal: '5%',
            marginVertical: '5%',
            paddingVertical: '10%',
            borderRadius: 10,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            flex,
          },
          animatedStyle,
        ]}
        onPress={() => {
          doAction(positiveAction, 1);
        }}>
        <CrescendoActionIcon action={positiveAction} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              paddingTop: '5%',
            }}>
            In:{' '}
            {linkItemMap[CrescendoActions[positiveAction].link_name]?.value ??
              0}
          </Text>
          <Text
            style={{
              color: 'black',
              paddingTop: '5%',
              opacity: 0.8,
            }}>
            Missed:{' '}
            {linkItemMap[CrescendoActions[negativeAction].link_name]?.value ??
              0}
          </Text>
        </View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

const CrescendoAutoModal = ({
  isActive,
  setIsActive,
  fieldOrientation,
  selectedAlliance,
  autoPath,
  setAutoPath,
  arrayData,
  setArrayData,
  form,
}: {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  fieldOrientation: string;
  setFieldOrientation: React.Dispatch<React.SetStateAction<string>>;
  selectedAlliance: string;
  setSelectedAlliance: React.Dispatch<React.SetStateAction<string>>;
  autoPath: AutoPath;
  setAutoPath: React.Dispatch<React.SetStateAction<AutoPath>>;
  arrayData: any[];
  setArrayData: React.Dispatch<React.SetStateAction<any[]>>;
  form: any;
}) => {
  const {colors} = useTheme();

  const [history, setHistory] = useState<HistoryAction[]>([]);

  // for each linked item, map the link name to the item within the arrayData and the index
  const linkItemMap = useMemo<LinkItemMap>(
    () =>
      form &&
      arrayData &&
      form.reduce((acc: any, item: any) => {
        if (item.link_to) {
          acc[item.link_to] = {
            value: arrayData[item.indice],
            index: item.indice,
          };
        }
        return acc;
      }, {}),
    [form, arrayData],
  );

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
            fontSize: 40,
            fontWeight: 'bold',
          }}>
          AUTO
        </Text>
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: '5%',
            flex: 1,
            marginBottom: '5%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Pressable
            style={{
              flexDirection: 'row',
              width: '40%',
              backgroundColor: colors.border,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingHorizontal: '2%',
              paddingVertical: '5%',
              marginBottom: '5%',
              borderRadius: 10,
            }}
            onPress={() => {
              const lastAction = history.pop();
              if (lastAction) {
                switch (lastAction.action) {
                  case 'intake':
                    setAutoPath(paths =>
                      paths.filter(path => path.noteId !== lastAction.noteId),
                    );
                    break;
                  case 'miss':
                    setAutoPath(paths =>
                      paths.map(path =>
                        path.noteId === lastAction.noteId
                          ? {...path, state: 'success'}
                          : path,
                      ),
                    );
                    break;
                  case 'reset':
                    setAutoPath(paths => [
                      ...paths,
                      {
                        type: CrescendoActionType.PickupGround,
                        noteId: lastAction.noteId,
                        order: paths.length,
                        state: 'success',
                      },
                    ]);
                    break;
                  case CrescendoActions[CrescendoActionType.ScoreAmp].link_name:
                  case CrescendoActions[CrescendoActionType.ScoreSpeaker]
                    .link_name:
                  case CrescendoActions[CrescendoActionType.MissAmp].link_name:
                  case CrescendoActions[CrescendoActionType.MissSpeaker]
                    .link_name:
                    setArrayData(prevArrayData => {
                      const {index} = linkItemMap[lastAction.action];
                      const newArrayData = [...prevArrayData];
                      newArrayData[index] = prevArrayData[index] - 1;
                      return newArrayData;
                    });
                    break;
                }
              }
              setHistory(history);
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
          <CrescendoField
            fieldOrientation={fieldOrientation}
            selectedAlliance={selectedAlliance}
            onNoteIntake={(note: number) => {
              setAutoPath(paths => [
                ...paths,
                {
                  type: CrescendoActionType.PickupGround,
                  noteId: note,
                  order: paths.at(-1) ? paths.at(-1)!.order + 1 : 0,
                  state: 'success',
                },
              ]);
              setHistory(history => [
                ...history,
                {action: 'intake', noteId: note},
              ]);
            }}
            onNoteMissed={(note: number) => {
              setAutoPath(paths =>
                paths.map(path =>
                  path.noteId === note ? {...path, state: 'missed'} : path,
                ),
              );
              setHistory(history => [
                ...history,
                {action: 'miss', noteId: note},
              ]);
            }}
            onNoteReset={(note: number) => {
              setAutoPath(paths => paths.filter(path => path.noteId !== note));
              setHistory(history => [
                ...history,
                {action: 'reset', noteId: note},
              ]);
            }}
            autoPath={autoPath}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
            }}>
            {/*<ActionButton*/}
            {/*  positiveAction={CrescendoActionType.ScoreAmp}*/}
            {/*  negativeAction={CrescendoActionType.MissAmp}*/}
            {/*  color="#86DF89"*/}
            {/*  flex={0.25}*/}
            {/*  setHistory={setHistory}*/}
            {/*  setAutoPath={setAutoPath}*/}
            {/*  setArrayData={setArrayData}*/}
            {/*  linkItemMap={linkItemMap}*/}
            {/*/>*/}
            <ActionButton
              positiveAction={CrescendoActionType.ScoreSpeaker}
              negativeAction={CrescendoActionType.MissSpeaker}
              color="#B098F3"
              flex={1}
              setHistory={setHistory}
              setAutoPath={setAutoPath}
              setArrayData={setArrayData}
              linkItemMap={linkItemMap}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CrescendoAutoModal;
