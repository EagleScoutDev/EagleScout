import {
  Alert,
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
import {EditNoteModal} from './modals/EditNoteModal';

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
  const [notesCopy, setNotesCopy] =
    useState<(NoteStructureWithMatchNumber | OfflineNote)[]>(notes);
  const [filteredNotes, setFilteredNotes] = useState<
    {
      note: NoteStructureWithMatchNumber | OfflineNote;
      index: number;
    }[]
  >(notes.map((note, i) => ({note, index: i})));
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.TEXT);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentNote, setCurrentNote] =
    useState<NoteStructureWithMatchNumber | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);

  useEffect(() => {
    const mapped = notesCopy.map((note, i) => ({
      note,
      index: i,
    }));
    if (searchTerm === '') {
      setFilteredNotes(mapped);
      return;
    }
    const filtered = mapped.filter(({note}) => {
      if (filterBy === FilterType.MATCH_NUMBER) {
        return (
          note.match_number?.toString().includes(searchTerm) ||
          note.team_number.toString().includes(searchTerm)
        );
      }
      return note.content.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredNotes(filtered);
  }, [searchTerm, filterBy, notesCopy]);

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
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2%',
        }}>
        <TextInput
          placeholder={'Search'}
          placeholderTextColor={colors.text}
          onChangeText={text => setSearchTerm(text)}
          style={{
            color: colors.text,
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
              fill={'gray'}
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
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
      {filteredNotes.length > 0 && (
        <FlatList
          data={filteredNotes}
          renderItem={({item: {note: item, index}}) => (
            <Pressable
              style={{
                backgroundColor: colors.card,
                padding: '5%',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
                margin: '5%',
              }}
              onLongPress={() => {
                if (!('id' in item)) {
                  Alert.alert('You cannot edit an offline note!');
                  return;
                }
                setCurrentNote(item);
                setCurrentNoteIndex(index);
                setEditModalVisible(true);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: colors.text, fontWeight: 'bold'}}>
                  Match {item.match_number} - Team {item.team_number}
                  {item.competition_name ? ` - ${item.competition_name}` : ''}
                  {item.scouter_name ? ` - By: ${item.scouter_name}` : ''}
                </Text>
              </View>
              <Text style={{color: colors.text}}>{item.content}</Text>
            </Pressable>
          )}
        />
      )}
      {filteredNotes.length === 0 && (
        <View
          style={{
            backgroundColor: colors.card,
            padding: '5%',
            borderRadius: 10,
            margin: '5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.text}}>
            No notes found for this match.
          </Text>
        </View>
      )}
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
      {editModalVisible && currentNote && (
        <EditNoteModal
          visible={editModalVisible}
          note={currentNote}
          onSave={note => {
            setEditModalVisible(false);
            setCurrentNote(null);
            setCurrentNoteIndex(-1);
            const newNotes = [...notesCopy];
            newNotes[currentNoteIndex] = note;
            setNotesCopy(newNotes);
          }}
          onCancel={() => {
            setEditModalVisible(false);
            setCurrentNote(null);
            setCurrentNoteIndex(-1);
          }}
        />
      )}
    </View>
  );
};
