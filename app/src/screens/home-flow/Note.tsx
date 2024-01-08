import {useTheme} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useEffect, useState} from 'react';
import NotesDB from '../../database/Notes';
import CompetitionsDB, {
  CompetitionReturnData,
} from '../../database/Competitions';

const NoteScreen = () => {
  const {colors} = useTheme();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [teamNumber, setTeamNumber] = useState<string>('');
  const [matchNumber, setMatchNumber] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const [compID, setCompID] = useState<number>('');

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(result => {
      if (result == null) {
        setCompID(-1);
      } else {
        setCompID(result.id);
      }
    });
  }, []);

  const submitNote = () => {
    // console.log(
    //   'submitting note' +
    //     '\nTitle: ' +
    //     title +
    //     '\nContent: ' +
    //     content +
    //     '\nTeam Number: ' +
    //     teamNumber +
    //     '\nMatch Number: ' +
    //     matchNumber,
    // );
    NotesDB.createNote(
      title,
      content,
      Number(teamNumber),
      Number(matchNumber),
      compID,
    ).then((result: any) => {
      console.log(result);
      clearAllFields();
    });
  };

  const clearAllFields = () => {
    setTitle('');
    setContent('');
    setTeamNumber('');
    setMatchNumber('');
  };

  const styles = StyleSheet.create({
    number_label: {
      color: colors.text,
      fontWeight: 'bold',
    },
    number_field: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    number_container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    content_container: {
      height: '50%',
      borderColor: 'gray',
      borderWidth: 1,
      width: '95%',
      alignSelf: 'center',
      borderRadius: 10,
      backgroundColor: colors.card,
      padding: 10,
    },
    content_text_input: {
      width: '100%',
      borderRadius: 10,
      backgroundColor: colors.card,
      padding: 10,
      color: colors.text,
      flexWrap: 'wrap',
    },
    submit_button_styling: {
      backgroundColor:
        title === '' ||
        content === '' ||
        teamNumber === '' ||
        matchNumber === ''
          ? 'grey'
          : colors.primary,
      padding: '5%',
      margin: '2%',
      borderRadius: 10,
      bottom: '5%',
      position: 'absolute',
      left: 0,
      right: 0,
    },
    title_text_input: {
      color: colors.text,
      fontSize: 30,
      fontWeight: 'bold',
      paddingHorizontal: '5%',
      paddingTop: '5%',
    },
  });

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <TextInput
        onChangeText={text => setTitle(text)}
        value={title}
        placeholder={'Title'}
        placeholderTextColor={'grey'}
        style={styles.title_text_input}
      />
      <View style={styles.number_container}>
        <Text style={styles.number_label}>Team Number</Text>
        <TextInput
          onChangeText={text => setTeamNumber(text)}
          value={teamNumber}
          placeholder={'###'}
          placeholderTextColor={'grey'}
          keyboardType={'number-pad'}
          style={styles.number_field}
        />
      </View>
      <View style={styles.number_container}>
        <Text style={styles.number_label}>Match Number</Text>
        <TextInput
          onChangeText={text => setMatchNumber(text)}
          value={matchNumber}
          placeholder={'###'}
          placeholderTextColor={'grey'}
          keyboardType={'number-pad'}
          style={styles.number_field}
        />
      </View>
      <View style={styles.content_container}>
        <TextInput
          multiline={true}
          style={styles.content_text_input}
          onChangeText={text => setContent(text)}
          value={content}
          placeholder={'Start writing...'}
          placeholderTextColor={'grey'}
        />
      </View>
      {/*<TouchableOpacity onPress={() => {}}>*/}
      {/*  <Text style={{color: colors.primary, fontWeight: 'bold'}}>*/}
      {/*    Add Image*/}
      {/*  </Text>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity
        style={styles.submit_button_styling}
        onPress={submitNote}
        disabled={
          title === '' ||
          content === '' ||
          teamNumber === '' ||
          matchNumber === ''
        }>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoteScreen;
