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
    if (searchTerm.length < 1) {
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
          marginBottom: '0%',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '2%',
        }}>
        <Pressable
          onPress={() => {
            setFilterType(FilterType.TEAM_NUMBER);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '2%',
            backgroundColor:
              filterType === FilterType.TEAM_NUMBER
                ? colors.text
                : colors.background,
            borderRadius: 10,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color:
                filterType === FilterType.TEAM_NUMBER
                  ? colors.background
                  : colors.text,
              fontWeight:
                filterType === FilterType.TEAM_NUMBER ? 'bold' : 'normal',
            }}>
            Team
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // setFilterState(FilterState.MATCH);
            setFilterType(FilterType.MATCH_NUMBER);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '2%',
            backgroundColor:
              filterType === FilterType.MATCH_NUMBER
                ? colors.text
                : colors.background,
            borderRadius: 10,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color:
                filterType === FilterType.MATCH_NUMBER
                  ? colors.background
                  : colors.text,
              fontWeight:
                filterType === FilterType.MATCH_NUMBER ? 'bold' : 'normal',
            }}>
            Match
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            // setFilterState(FilterState.PERSON);
            setFilterType(FilterType.TEXT);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '2%',
            backgroundColor:
              filterType === FilterType.TEXT ? colors.text : colors.background,
            borderRadius: 10,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color:
                filterType === FilterType.TEXT
                  ? colors.background
                  : colors.text,
              fontWeight: filterType === FilterType.TEXT ? 'bold' : 'normal',
            }}>
            Text
          </Text>
        </Pressable>
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
