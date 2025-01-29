import {useTheme} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NotesDB from '../../database/Notes';
// import Svg, {Path} from 'react-native-svg';
import {NoteInputModal} from './components/NoteInputModal';
import CompetitionsDB from '../../database/Competitions';
import FormHelper from '../../FormHelper';
import Toast from 'react-native-toast-message';
import Confetti from 'react-native-confetti/confettiView';
import {useHeaderHeight} from '@react-navigation/elements';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';
import StandardButton from '../../components/StandardButton';
// import ScoutingCamera from '../../components/camera/ScoutingCamera';

const NoteScreen = () => {
  const {colors} = useTheme();
  const height = useHeaderHeight();
  const [matchNumber, setMatchNumber] = useState<string>('');

  const [alliances, setAlliances] = useState<{
    red: number[];
    blue: number[];
  }>({red: [], blue: []});
  const [selectedAlliance, setSelectedAlliance] = useState<'red' | 'blue' | ''>(
    '',
  );
  const [noteContents, setNoteContents] = useState<{
    [key: string]: string;
  }>({});

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confettiView, setConfettiView] = useState<any>(null);
  const [matchNumberValid, setMatchNumberValid] = useState<boolean>(false);

  const {competitionId, getTeamsForMatch} = useCurrentCompetitionMatches();

  useEffect(() => {
    if (matchNumber === '') {
      return;
    }
    const teams = getTeamsForMatch(Number(matchNumber));
    if (teams.length === 6) {
      setAlliances({
        red: teams.slice(0, 3),
        blue: teams.slice(3, 6),
      });
      setMatchNumberValid(true);
    } else {
      setMatchNumberValid(false);
    }
  }, [matchNumber]);

  useEffect(() => {
    if (selectedAlliance === '') {
      return;
    }
    const newNoteContents: {
      [key: string]: string;
    } = {};
    alliances[selectedAlliance].forEach(team => {
      newNoteContents[team] = '';
    });
    setNoteContents(newNoteContents);
  }, [alliances, selectedAlliance]);

  const startConfetti = () => {
    console.log('starting confetti');
    confettiView.startConfetti();
  };

  const submitNote = async () => {
    setIsLoading(true);
    const promises = [];
    const internetResponse = await CompetitionsDB.getCurrentCompetition()
      .then(() => true)
      .catch(() => false);
    for (const team of Object.keys(noteContents)) {
      if (noteContents[team] === '') {
        continue;
      }
      if (internetResponse) {
        promises.push(
          NotesDB.createNote(
            noteContents[team],
            Number(team),
            Number(matchNumber),
            competitionId,
          ),
        );
      } else {
        promises.push(
          FormHelper.saveNoteOffline({
            content: noteContents[team],
            team_number: Number(team),
            match_number: Number(matchNumber),
            comp_id: competitionId,
            created_at: new Date(),
          }),
        );
      }
    }
    await Promise.all(promises);
    if (promises.length > 0) {
      if (internetResponse) {
        Toast.show({
          type: 'success',
          text1: 'Note submitted!',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Note saved offline successfully!',
          visibilityTime: 3000,
        });
      }
      startConfetti();
    }
    clearAllFields();
    setIsLoading(false);
    setModalVisible(false);
  };

  const clearAllFields = () => {
    setMatchNumber('');
    setNoteContents({});
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: '3%',
      width: '90%',
      paddingHorizontal: '8%',
    },
    submit_button_styling: {
      backgroundColor:
        matchNumber === '' || selectedAlliance === '' ? 'grey' : colors.primary,
      borderRadius: 10,
      marginHorizontal: '5%',
      marginBottom: '10%',
      paddingVertical: '0%',
    },
    title_text_input: {
      color: colors.text,
      fontSize: 30,
      fontWeight: 'bold',
      paddingHorizontal: '5%',
      paddingTop: '5%',
    },
  });

  if (competitionId === -1) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5%',
        }}>
        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.text}}>
          A competition must be running to submit notes!
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          zIndex: 100,
          // allow touch through
          pointerEvents: 'none',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <Confetti ref={setConfettiView} timeout={10} duration={3000} />
      </View>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={'padding'}
        keyboardVerticalOffset={height}>
        <Text style={styles.title_text_input}>Create a Note</Text>
        <View style={styles.number_container}>
          <Text style={styles.number_label}>Match Number</Text>
          <TextInput
            onChangeText={text => setMatchNumber(text)}
            value={matchNumber}
            placeholder={'###'}
            placeholderTextColor={'grey'}
            keyboardType={'number-pad'}
            style={[styles.number_field]}
          />
        </View>
        {matchNumber !== '' && (
          <View>
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center',
                marginVertical: '2%',
              }}>
              Select Alliance
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: '2%',
                justifyContent: 'space-between',
                marginRight: '5%',
                marginLeft: '5%',
                gap: 10,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selectedAlliance === 'red'
                      ? colors.notification
                      : colors.card,
                  padding: '5%',
                  borderRadius: 10,
                  flex: 1,
                }}
                onPress={() => setSelectedAlliance('red')}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Red
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selectedAlliance === 'blue' ? 'blue' : colors.card,
                  padding: '5%',
                  borderRadius: 10,
                  flex: 1,
                }}
                onPress={() => setSelectedAlliance('blue')}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Blue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{flex: 1}} />
        <View style={styles.submit_button_styling}>
          <StandardButton
            text={'Next'}
            onPress={() => {
              if (matchNumberValid) {
                setModalVisible(true);
              } else {
                Alert.alert(
                  'Match number invalid',
                  'Match number invalid. Please check if the match number you entered is correct.',
                );
              }
            }}
            disabled={matchNumber === '' || selectedAlliance === ''}
          />
        </View>
      </KeyboardAvoidingView>
      {modalVisible && (
        <NoteInputModal
          onSubmit={submitNote}
          isLoading={isLoading}
          selectedAlliance={selectedAlliance}
          noteContents={noteContents}
          setNoteContents={setNoteContents}
        />
      )}
    </>
  );
};

export default NoteScreen;
