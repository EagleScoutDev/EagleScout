import {useTheme} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {useEffect, useState} from 'react';
import NotesDB from '../../database/Notes';
import CompetitionsDB, {
  CompetitionReturnData,
} from '../../database/Competitions';
// import Svg, {Path} from 'react-native-svg';
import {TBA} from '../../lib/TBAUtils';
import TBAMatches from '../../database/TBAMatches';
// import ScoutingCamera from '../../components/camera/ScoutingCamera';

const TextboxModal = ({
  onSubmit,
  content,
  setContent,
  images,
  setImages,
  cameraVisible,
  setCameraVisible,
}: {
  content: string;
  setContent: (content: string) => void;
  onSubmit: () => void;
  images: string[];
  setImages: (images: string[]) => void;
  cameraVisible: boolean;
  setCameraVisible: (cameraVisible: boolean) => void;
}) => {
  const [localContent, setLocalContent] = useState<string>(content);
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      padding: '3%',
      paddingHorizontal: '5%',
      borderRadius: 10,
      margin: '1%',
    },
  });
  return (
    <Modal visible={true} animationType={'slide'}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1, height: '100%'}}
          behavior={'padding'}>
          <View
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              height: '100%',
              width: '100%',
              // backgroundColor: 'red',
            }}>
            <View
              style={{
                flex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                padding: '5%',
                zIndex: 1,
              }}>
              <TextInput
                multiline={true}
                style={{flex: 1}}
                onChangeText={text => setLocalContent(text)}
                value={localContent}
                placeholder={'Start writing...'}
                placeholderTextColor={'grey'}
              />
            </View>
            <View
              style={{
                display: 'flex',
                alignSelf: 'flex-end',
                height: '100%',
                zIndex: 2,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setContent(localContent);
                  onSubmit();
                }}
                style={{
                  ...styles.button,
                  marginRight: '5%',
                  alignSelf: 'flex-end',
                  width: 'auto',
                }}>
                <Text style={{color: colors.background}}>Save</Text>
              </TouchableOpacity>
              <View style={{flex: 1}} />
              {/*<TouchableOpacity*/}
              {/*  style={{*/}
              {/*    ...styles.button,*/}
              {/*    marginRight: '5%',*/}
              {/*  }}*/}
              {/*  onPress={() => {*/}
              {/*    setCameraVisible(true);*/}
              {/*  }}>*/}
              {/*  <Svg*/}
              {/*    fill={colors.background}*/}
              {/*    width={30}*/}
              {/*    height={30}*/}
              {/*    viewBox="0 0 16 16">*/}
              {/*    <Path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />*/}
              {/*    <Path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z" />*/}
              {/*  </Svg>*/}
              {/*</TouchableOpacity>*/}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const NoteScreen = () => {
  const {colors} = useTheme();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [teamNumber, setTeamNumber] = useState<string>('');
  const [matchNumber, setMatchNumber] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const [availableTeams, setAvailableTeams] = useState<number[]>([]);

  const [currentCompetition, setCurrentCompetition] =
    useState<CompetitionReturnData>();
  const [compID, setCompID] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(result => {
      if (result == null) {
        setCompID(-1);
      } else {
        setCurrentCompetition(result);
        setCompID(result.id);
      }
    });
  }, []);

  useEffect(() => {
    if (compID === -1) {
      return;
    }
  }, [matchNumber]);

  const submitNote = () => {
    console.log(
      'submitting note' +
        '\nTitle: ' +
        title +
        '\nContent: ' +
        content +
        '\nTeam Number: ' +
        teamNumber +
        '\nMatch Number: ' +
        matchNumber,
    );
    NotesDB.createNote(
      title,
      content,
      Number(teamNumber),
      Number(matchNumber),
      compID,
    ).then(() => {
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
      backgroundColor: colors.card,
      padding: '2%',
      borderRadius: 10,
    },
    number_container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginVertical: '1%',
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
      <View style={styles.content_container}>
        <TextInput
          multiline={true}
          style={styles.content_text_input}
          onChangeText={text => setContent(text)}
          value={content}
          placeholder={'Start writing...'}
          placeholderTextColor={'grey'}
          onFocus={() => {
            setModalVisible(true);
          }}
        />
      </View>
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
      {modalVisible && !cameraVisible && (
        <TextboxModal
          onSubmit={() => {
            setModalVisible(false);
          }}
          content={content}
          setContent={setContent}
          images={images}
          setImages={setImages}
          cameraVisible={cameraVisible}
          setCameraVisible={setCameraVisible}
        />
      )}
      {/*{cameraVisible && (*/}
      {/*  <Modal animationType="slide" visible={cameraVisible}>*/}
      {/*    <ScoutingCamera*/}
      {/*      onPhotoTaken={uri => {*/}
      {/*        setImages([...images, uri]);*/}
      {/*        setCameraVisible(false);*/}
      {/*      }}*/}
      {/*      onCancel={() => {*/}
      {/*        setCameraVisible(false);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Modal>*/}
      {/*)}*/}
    </View>
  );
};

export default NoteScreen;
