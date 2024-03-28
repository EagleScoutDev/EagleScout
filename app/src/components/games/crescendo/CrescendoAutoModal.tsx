import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {OrientationChooser} from '../OrientationChooser';
import {CrescendoField} from './CrescendoField';
import {AutoPath} from './AutoPath';

const CrescendoAutoModal = ({
  isActive,
  setIsActive,
  fieldOrientation,
  setFieldOrientation,
  selectedAlliance,
  setSelectedAlliance,
}: {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  fieldOrientation: string;
  setFieldOrientation: (orientation: string) => void;
  selectedAlliance: string;
  setSelectedAlliance: (alliance: string) => void;
}) => {
  const {colors} = useTheme();

  const [autoPath, setAutoPath] = React.useState<AutoPath>([]);
  const [history, setHistory] = React.useState<
    {
      action: string;
      noteId: number;
    }[]
  >([]);

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

  const InputButton = ({
    label,
    color = colors.primary,
  }: {
    label: string;
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
          addItemToRecord(label);
        }}>
        <Text style={styles.button_label}>{label}</Text>
        <Text style={styles.button_count}>{actionCount.get(label) ?? 0}</Text>
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
            gap: '5%',
          }}>
          <OrientationChooser
            selectedOrientation={fieldOrientation}
            setSelectedOrientation={setFieldOrientation}
            selectedAlliance={selectedAlliance}
            setSelectedAlliance={setSelectedAlliance}
          />
          <CrescendoField
            fieldOrientation={fieldOrientation}
            selectedAlliance={selectedAlliance}
            onNoteIntake={(note: number) => {
              setAutoPath(paths => [
                ...paths,
                {
                  noteId: note,
                  order: paths.length,
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
            }}>
            <Pressable
              style={{
                backgroundColor: '#D9D9D9',
                padding: '5%',
                margin: '5%',
                borderRadius: 10,
                width: '40%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {}}>
              <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <Path
                  d="M35 2.5C35.663 2.5 36.2989 2.76339 36.7678 3.23223C37.2366 3.70107 37.5 4.33696 37.5 5V35C37.5 35.663 37.2366 36.2989 36.7678 36.7678C36.2989 37.2366 35.663 37.5 35 37.5H5C4.33696 37.5 3.70107 37.2366 3.23223 36.7678C2.76339 36.2989 2.5 35.663 2.5 35V5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H35ZM5 0C3.67392 0 2.40215 0.526784 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5L0 35C0 36.3261 0.526784 37.5979 1.46447 38.5355C2.40215 39.4732 3.67392 40 5 40H35C36.3261 40 37.5979 39.4732 38.5355 38.5355C39.4732 37.5979 40 36.3261 40 35V5C40 3.67392 39.4732 2.40215 38.5355 1.46447C37.5979 0.526784 36.3261 0 35 0L5 0Z"
                  fill="black"
                />
                <Path
                  d="M11.615 11.615C11.7311 11.4986 11.8691 11.4062 12.0209 11.3432C12.1728 11.2802 12.3356 11.2478 12.5 11.2478C12.6644 11.2478 12.8272 11.2802 12.9791 11.3432C13.131 11.4062 13.2689 11.4986 13.385 11.615L20 18.2325L26.615 11.615C26.7312 11.4988 26.8692 11.4066 27.021 11.3437C27.1729 11.2808 27.3356 11.2484 27.5 11.2484C27.6644 11.2484 27.8271 11.2808 27.979 11.3437C28.1308 11.4066 28.2688 11.4988 28.385 11.615C28.5012 11.7312 28.5934 11.8692 28.6563 12.021C28.7192 12.1729 28.7516 12.3356 28.7516 12.5C28.7516 12.6644 28.7192 12.8271 28.6563 12.979C28.5934 13.1308 28.5012 13.2688 28.385 13.385L21.7675 20L28.385 26.615C28.5012 26.7312 28.5934 26.8692 28.6563 27.021C28.7192 27.1729 28.7516 27.3356 28.7516 27.5C28.7516 27.6644 28.7192 27.8271 28.6563 27.979C28.5934 28.1308 28.5012 28.2688 28.385 28.385C28.2688 28.5012 28.1308 28.5934 27.979 28.6563C27.8271 28.7192 27.6644 28.7516 27.5 28.7516C27.3356 28.7516 27.1729 28.7192 27.021 28.6563C26.8692 28.5934 26.7312 28.5012 26.615 28.385L20 21.7675L13.385 28.385C13.2688 28.5012 13.1308 28.5934 12.979 28.6563C12.8271 28.7192 12.6644 28.7516 12.5 28.7516C12.3356 28.7516 12.1729 28.7192 12.021 28.6563C11.8692 28.5934 11.7312 28.5012 11.615 28.385C11.4988 28.2688 11.4066 28.1308 11.3437 27.979C11.2808 27.8271 11.2484 27.6644 11.2484 27.5C11.2484 27.3356 11.2808 27.1729 11.3437 27.021C11.4066 26.8692 11.4988 26.7312 11.615 26.615L18.2325 20L11.615 13.385C11.4986 13.2689 11.4062 13.131 11.3432 12.9791C11.2802 12.8272 11.2478 12.6644 11.2478 12.5C11.2478 12.3356 11.2802 12.1728 11.3432 12.0209C11.4062 11.8691 11.4986 11.7311 11.615 11.615Z"
                  fill="black"
                />
              </Svg>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: colors.primary,
                padding: '5%',
                margin: '5%',
                borderRadius: 10,
                width: '40%',
                justifyContent: 'center',
                alignItems: 'center',
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
                          noteId: lastAction.noteId,
                          order: paths.length,
                          state: 'success',
                        },
                      ]);
                      break;
                  }
                }
                setHistory(history);
              }}>
              <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <Path
                  d="M11.6667 31.6667V28.3333H23.5C25.25 28.3333 26.7711 27.7778 28.0634 26.6667C29.3556 25.5556 30.0011 24.1667 30 22.5C30 20.8333 29.3545 19.4444 28.0634 18.3333C26.7722 17.2222 25.2511 16.6667 23.5 16.6667H13L17.3334 21L15 23.3333L6.66669 15L15 6.66667L17.3334 9.00001L13 13.3333H23.5C26.1945 13.3333 28.5072 14.2083 30.4384 15.9583C32.3695 17.7083 33.3345 19.8889 33.3334 22.5C33.3334 25.1111 32.3684 27.2917 30.4384 29.0417C28.5084 30.7917 26.1956 31.6667 23.5 31.6667H11.6667Z"
                  fill="black"
                />
              </Svg>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CrescendoAutoModal;
