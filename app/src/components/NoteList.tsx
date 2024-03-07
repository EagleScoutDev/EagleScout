import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {NoteStructureWithMatchNumber, OfflineNote} from '../database/Notes';
import Svg, {Path} from 'react-native-svg';

export enum FilterType {
  // todo: allow note list to accept and display team #
  // to do this, accept param for display=['team_number', 'match_number']
  // TEAM_NUMBER,
  MATCH_NUMBER,
  TEXT,
}

export const NoteList = ({
  notes,
  onClose,
}: {
  notes: (NoteStructureWithMatchNumber | OfflineNote)[];
  onClose?: () => void;
}) => {
  const {colors} = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredNotes, setFilteredNotes] =
    useState<(NoteStructureWithMatchNumber | OfflineNote)[]>(notes);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.TEXT);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredNotes(notes);
      return;
    }
    const filtered = notes.filter(note => {
      if (filterBy === FilterType.MATCH_NUMBER) {
        return (
          note.match_number?.toString().includes(searchTerm) ||
          note.team_number.toString().includes(searchTerm)
        );
      }
      return note.content.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredNotes(filtered);
  }, [searchTerm]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: colors.background,
      paddingBottom: '10%',
      paddingHorizontal: '5%',
      paddingVertical: '5%',
      height: '50%',
    },
    filterOption: {
      backgroundColor: colors.card,
      padding: '3%',
      paddingHorizontal: '5%',
      borderRadius: 10,
      margin: '1%',
      borderWidth: 2,
      borderColor: colors.border,
    },
  });

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2%',
        }}>
        <TextInput
          placeholder={'Search'}
          placeholderTextColor={'grey'}
          onChangeText={text => setSearchTerm(text)}
          style={{
            backgroundColor: colors.card,
            paddingHorizontal: '5%',
            paddingVertical: '2%',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            marginLeft: '5%',
            marginRight: '2%',
            flex: 1,
          }}
        />
        <Pressable
          onPress={() => {
            setFilterModalVisible(true);
          }}
          style={{
            padding: '2%',
            marginRight: '2%',
          }}>
          <Svg fill="currentColor" viewBox="0 0 16 16" width="20" height="20">
            <Path
              fill="gray"
              d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
            />
          </Svg>
        </Pressable>
        {onClose && (
          <Pressable
            onPress={onClose}
            style={{
              padding: '2%',
              marginRight: '2%',
            }}>
            <Svg fill="currentColor" viewBox="0 0 16 16" width="20" height="20">
              <Path
                fill="gray"
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
              />
            </Svg>
          </Pressable>
        )}
      </View>
      <FlatList
        data={filteredNotes}
        renderItem={({item}) => (
          <Pressable
            style={{
              backgroundColor: colors.card,
              padding: '5%',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              margin: '5%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: colors.text, fontWeight: 'bold'}}>
                Match {item.match_number} - Team {item.team_number}
                {item.competition_name ? ` - ${item.competition_name}` : ''}
              </Text>
            </View>
            <Text style={{color: colors.text}}>{item.content}</Text>
          </Pressable>
        )}
      />
      {filterModalVisible && (
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'fade'}
          transparent={true}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
            }}
            onTouchEnd={() => setFilterModalVisible(false)}
          />
          <View style={styles.container}>
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 24,
                marginBottom: '5%',
              }}>
              Filter By
            </Text>
            <Pressable
              onPress={() => {
                setFilterBy(FilterType.MATCH_NUMBER);
                setFilterModalVisible(false);
              }}
              style={{
                ...styles.filterOption,
                borderColor:
                  filterBy === FilterType.MATCH_NUMBER
                    ? colors.primary
                    : colors.background,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                }}>
                Match/Team
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFilterBy(FilterType.TEXT);
                setFilterModalVisible(false);
              }}
              style={{
                ...styles.filterOption,
                borderColor:
                  filterBy === FilterType.TEXT
                    ? colors.primary
                    : colors.background,
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                }}>
                Text
              </Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
};
