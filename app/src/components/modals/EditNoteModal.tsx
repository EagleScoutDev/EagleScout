import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {NoteStructureWithMatchNumber} from '../../database/Notes';
import Svg, {Path} from 'react-native-svg';
import {supabase} from '../../lib/supabase';

export const EditNoteModal = ({
  visible,
  note,
  onSave,
  onCancel,
}: {
  visible: boolean;
  note: NoteStructureWithMatchNumber;
  onSave: (note: NoteStructureWithMatchNumber) => void;
  onCancel: () => void;
}) => {
  const {colors} = useTheme();
  const [content, setContent] = useState<string>(note.content);

  const saveNote = async () => {
    await supabase.from('notes').update({content}).eq('id', note.id);
    // await supabase.from('notes_edits').insert({
    //   note_id: note.id,
    //   content: note.content,
    //   new_content: content,
    // });
    onSave({...note, content});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    backgroundCovering: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    input: {
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      height: '30%',
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.background,
    },
  });

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.backgroundCovering} />
      <View style={styles.container}>
        <View style={styles.modal}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{color: colors.text, fontWeight: 'bold', fontSize: 24}}>
              Edit Note
            </Text>
            <View
              style={{
                flex: 1,
              }}
            />
            <Pressable
              onPress={onCancel}
              style={{
                backgroundColor: colors.notification,
                padding: 10,
                borderRadius: 100,
                alignItems: 'center',
              }}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>
          <Text style={{color: colors.text, fontSize: 18}}>
            Match: {note.match_number}
          </Text>
          <Text style={{color: colors.text, fontSize: 18}}>
            Team: {note.team_number}
          </Text>
          <TextInput
            style={styles.input}
            multiline={true}
            value={content}
            onChange={e => setContent(e.nativeEvent.text)}
          />
          <Pressable style={styles.button} onPress={saveNote}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
