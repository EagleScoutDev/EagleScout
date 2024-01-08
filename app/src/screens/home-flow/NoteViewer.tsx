import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import NotesDB, {NoteStructure} from '../../database/Notes';

interface SortOptionProps {
  onPress: () => void;
  title: string;
  isActive: boolean;
}

function SortOption({onPress, title, isActive}: SortOptionProps) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        backgroundColor: isActive ? 'blue' : colors.card,
        padding: '3%',
        paddingHorizontal: '5%',
        borderRadius: 10,
        margin: '1%',
        borderWidth: 1,
        borderColor: isActive ? 'blue' : colors.border,
      }}>
      <Text
        style={{
          color: isActive ? 'white' : colors.text,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const NoteViewer = () => {
  const {colors} = useTheme();
  const [notes, setNotes] = useState<NoteStructure[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filteredNotes, setFilteredNotes] = useState<NoteStructure[]>([]);

  enum FilterType {
    TEAM_NUMBER,
    MATCH_NUMBER,
    TEXT,
  }

  const [filterType, setFilterType] = useState<FilterType>(FilterType.TEXT);

  const fetchLatestNotes = () => {
    setFetching(true);
    NotesDB.getAllNotes().then(result => {
      console.log('note fetch results: ' + JSON.stringify(result));
      setNotes(result);
      setFilteredNotes(result);
      setFetching(false);
    });
  };

  useEffect(() => {
    fetchLatestNotes();
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredNotes(notes);
    }

    if (filterType === FilterType.TEAM_NUMBER) {
      setFilteredNotes(
        notes.filter(note => {
          return note.team_number === Number(searchTerm);
        }),
      );
    } else if (filterType === FilterType.MATCH_NUMBER) {
      setFilteredNotes(
        notes.filter(note => {
          return note.match_id === Number(searchTerm);
        }),
      );
    } else if (filterType === FilterType.TEXT) {
      const loweredSearchTerm = searchTerm.toLowerCase();
      setFilteredNotes(
        notes.filter(note => {
          return (
            note.title.toLowerCase().includes(loweredSearchTerm) ||
            note.content.toLowerCase().includes(loweredSearchTerm)
          );
        }),
      );
    }
  }, [searchTerm]);

  return (
    <View style={{flex: 1}}>
      <TextInput
        placeholder={'Search'}
        placeholderTextColor={'grey'}
        onChangeText={text => setSearchTerm(text)}
        style={{
          backgroundColor: colors.card,
          padding: '5%',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          margin: '2%',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <SortOption
          onPress={() => setFilterType(FilterType.TEXT)}
          title={'Text'}
          isActive={filterType === FilterType.TEXT}
        />
        <SortOption
          onPress={() => setFilterType(FilterType.TEAM_NUMBER)}
          title={'Team Number'}
          isActive={filterType === FilterType.TEAM_NUMBER}
        />
        <SortOption
          onPress={() => setFilterType(FilterType.MATCH_NUMBER)}
          title={'Match Number'}
          isActive={filterType === FilterType.MATCH_NUMBER}
        />
      </View>
      <FlatList
        data={filteredNotes}
        onRefresh={() => fetchLatestNotes()}
        refreshing={fetching}
        renderItem={({item}) => (
          <Pressable
            style={{
              backgroundColor: colors.card,
              padding: '5%',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              margin: '2%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: colors.text, fontWeight: 'bold'}}>
                {item.title} - Team {item.team_number} - matchid{item.match_id}
              </Text>
            </View>
            <Text style={{color: colors.text}}>{item.content}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default NoteViewer;
