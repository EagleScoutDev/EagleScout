import {Modal, Pressable, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ReefscapeField} from './ReefscapeField';
import {AutoPath} from './AutoPath';
import {
  ReefscapeActionIcon,
  ReefscapeActions,
  ReefscapeActionType,
} from './ReefscapeActions';
import {ReefscapeLevels} from './ReefscapeLevels';

interface HistoryAction {
  action: string;
  pieceID: number;
}

interface LinkItemMap {
  [key: string]: {
    value: number;
    index: number;
  };
}

const ActionButton = ({
  positiveAction,
  negativeAction,
  goodLabel,
  badLabel,
  flex,
  setHistory,
  setAutoPath,
  setArrayData,
  linkItemMap,
}: {
  positiveAction: ReefscapeActionType;
  negativeAction: ReefscapeActionType;
  goodLabel: string;
  badLabel: string;
  flex: number;
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>;
  setAutoPath: React.Dispatch<React.SetStateAction<AutoPath>>;
  setArrayData: React.Dispatch<React.SetStateAction<any[]>>;
  linkItemMap: LinkItemMap;
}) => {
  const {colors} = useTheme();
  const doAction = (action: ReefscapeActionType, change: number) => {
    setHistory(history => [
      ...history,
      {
        action: ReefscapeActions[action].link_name,
        pieceID: positiveAction,
      },
    ]);
    setArrayData(prevArrayData => {
      const linkItem = linkItemMap[ReefscapeActions[action].link_name];
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
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  return (
    <>
      <Pressable
        style={{
          backgroundColor: colors.notification,
          paddingHorizontal: '5%',
          marginVertical: '5%',
          paddingVertical: '10%',
          borderRadius: 10,
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          flex: flex / 2,
        }}
        onPress={() => {
          doAction(negativeAction, 1);
        }}>
        <ReefscapeActionIcon action={negativeAction} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: colors.text,
              paddingTop: '5%',
              fontWeight: 'bold',
            }}>
            {badLabel}
          </Text>
          <Text
            style={{
              color: colors.text,
              paddingTop: '5%',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 38,
            }}>
            {linkItemMap[ReefscapeActions[negativeAction].link_name]?.value ??
              0}
          </Text>
        </View>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: '5%',
          marginVertical: '5%',
          paddingVertical: '10%',
          borderRadius: 10,
          width: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          flex: flex / 2,
        }}
        onPress={() => {
          doAction(positiveAction, 1);
        }}>
        <ReefscapeActionIcon action={positiveAction} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: colors.text,
              paddingTop: '5%',
              fontWeight: 'bold',
            }}>
            {goodLabel}
          </Text>
          <Text
            style={{
              color: colors.text,
              paddingTop: '5%',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 38,
            }}>
            {linkItemMap[ReefscapeActions[positiveAction].link_name]?.value ??
              0}
          </Text>
        </View>
      </Pressable>
    </>
  );
};

const ReefscapeAutoModal = ({
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
  const [levelChooserActive, setLevelChooserActive] = useState(false);
  const [chosenReefPosition, setChosenReefPosition] = useState<number>(-1);

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
              ReactNativeHapticFeedback.trigger('impactLight');
              if (lastAction) {
                switch (lastAction.action) {
                  case 'score':
                  case 'intake':
                    setAutoPath(paths =>
                      paths.filter(path => path.nodeId !== lastAction.pieceID),
                    );
                    break;
                  case 'miss':
                    setAutoPath(paths =>
                      paths.map(path =>
                        path.nodeId === lastAction.pieceID
                          ? {...path, state: 'success'}
                          : path,
                      ),
                    );
                    break;
                  case 'reset':
                    setAutoPath(paths => [
                      ...paths,
                      {
                        type: ReefscapeActionType.PickupGround,
                        nodeId: lastAction.pieceID,
                        order: paths.length,
                        state: 'success',
                      },
                    ]);
                    break;
                  case ReefscapeActions[ReefscapeActionType.ScoreProcessor]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.MissProcessor]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.MissCoral]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.ScoreCoralL1]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.ScoreCoralL2]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.ScoreCoralL3]
                    .link_name:
                  case ReefscapeActions[ReefscapeActionType.ScoreCoralL4]
                    .link_name:
                    setArrayData(prevArrayData => {
                      const {index} = linkItemMap[lastAction.action];
                      const newArrayData = [...prevArrayData];
                      newArrayData[index] = prevArrayData[index] - 1;
                      return newArrayData;
                    });
                    setAutoPath(paths => paths.slice(0, -1));
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
          {levelChooserActive ? (
            <ReefscapeLevels
              onSubmit={(level: ReefscapeActionType) => {
                setAutoPath(paths => [
                  ...paths,
                  {
                    type: level,
                    nodeId: chosenReefPosition,
                    order: paths.at(-1) ? paths.at(-1)!.order + 1 : 0,
                    state: 'success',
                  },
                ]);
                setHistory(history => [
                  ...history,
                  {
                    action: ReefscapeActions[level].link_name,
                    pieceID: chosenReefPosition,
                  },
                ]);
                setArrayData(prevArrayData => {
                  const linkItem =
                    linkItemMap[ReefscapeActions[level].link_name];
                  if (linkItem) {
                    const {index} = linkItem;
                    const newArrayData = [...prevArrayData];
                    newArrayData[index] = prevArrayData[index] + 1;
                    return newArrayData;
                  } else {
                    return prevArrayData;
                  }
                });
                setLevelChooserActive(false);
              }}
            />
          ) : (
            <>
              <ReefscapeField
                fieldOrientation={fieldOrientation}
                selectedAlliance={selectedAlliance}
                setLevelChooserActive={setLevelChooserActive}
                setChosenReefPosition={setChosenReefPosition}
                onPieceIntake={(piece: number) => {
                  setAutoPath(paths => [
                    ...paths,
                    {
                      type: ReefscapeActionType.PickupGround,
                      nodeId: piece,
                      order: paths.at(-1) ? paths.at(-1)!.order + 1 : 0,
                      state: 'success',
                    },
                  ]);
                  setHistory(history => [
                    ...history,
                    {action: 'intake', pieceID: piece},
                  ]);
                }}
                onPieceMissed={(piece: number) => {
                  setAutoPath(paths =>
                    paths.map(path =>
                      path.nodeId === piece ? {...path, state: 'missed'} : path,
                    ),
                  );
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  setHistory(history => [
                    ...history,
                    {action: 'miss', pieceID: piece},
                  ]);
                }}
                onPieceReset={(piece: number) => {
                  setAutoPath(paths =>
                    paths.filter(path => path.nodeId !== piece),
                  );
                  setHistory(history => [
                    ...history,
                    {action: 'reset', pieceID: piece},
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
                <ActionButton
                  positiveAction={ReefscapeActionType.ScoreProcessor}
                  negativeAction={ReefscapeActionType.MissProcessor}
                  goodLabel={'Scored Processor'}
                  badLabel={'Missed Processor'}
                  flex={1}
                  setHistory={setHistory}
                  setAutoPath={setAutoPath}
                  setArrayData={setArrayData}
                  linkItemMap={linkItemMap}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ReefscapeAutoModal;
