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
// import Svg, {Path} from 'react-native-svg';
import TBAMatches, {TBAMatch} from '../../database/TBAMatches';
import {NoteInputModal} from './components/NoteInputModal';
import CompetitionsDB from '../../database/Competitions';
// import ScoutingCamera from '../../components/camera/ScoutingCamera';

const NoteScreen = () => {
  const {colors} = useTheme();
  const [matchNumber, setMatchNumber] = useState<string>('');

  const [matchNumberError, setMatchNumberError] = useState<boolean>(false);
  const [alliances, setAlliances] = useState<{
    red: number[];
    blue: number[];
  }>({red: [], blue: []});
  const [selectedAlliance, setSelectedAlliance] = useState<string>('');
  const [noteContents, setNoteContents] = useState<{
    [key: string]: string;
  }>({});

  const [matchesForCompetition, setMatchesForCompetition] = useState<
    TBAMatch[]
  >([]);
  const [compID, setCompID] = useState<number>(-1);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(result => {
      if (result == null) {
        setCompID(-1);
      } else {
        setCompID(result.id);
        TBAMatches.getMatchesForCompetition(result.id.toString()).then(
          matches => {
            setMatchesForCompetition(matches);
          },
        );
      }
    });
  }, []);

  useEffect(() => {
    if (
      compID === -1 ||
      matchNumber === '' ||
      matchesForCompetition.length === 0
    ) {
      return;
    }
    const teams = matchesForCompetition
      .filter(match => match.compLevel === 'qm')
      .filter(match => match.match === Number(matchNumber))
      .sort((a, b) => (a.alliance === 'red' ? -1 : 1))
      .map(match => match.team.replace('frc', ''))
      .map(match => Number(match));
    if (teams.length === 0) {
      setMatchNumberError(true);
      return;
    }
    setMatchNumberError(false);
    console.log(teams);
    setAlliances({
      red: teams.slice(0, 3),
      blue: teams.slice(3, 6),
    });
  }, [matchNumber, compID, matchesForCompetition]);

  const submitNote = async () => {
    setModalVisible(false);
    const promises = [];
    for (const team of Object.keys(noteContents)) {
      if (noteContents[team] === '') {
        continue;
      }
      promises.push(
        NotesDB.createNote(
          noteContents[team],
          Number(team),
          Number(matchNumber),
          compID,
        ),
      );
    }
    await Promise.all(promises);
    clearAllFields();
  };

  const selectAlliance = (alliance: 'red' | 'blue') => {
    setSelectedAlliance(alliance);
    const newNoteContents: {
      [key: string]: string;
    } = {};
    alliances[alliance].forEach(team => {
      newNoteContents[team] = '';
    });
    setNoteContents(newNoteContents);
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
        matchNumber === '' || selectedAlliance === '' || matchNumberError
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

  if (compID === -1) {
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
    <View style={{flexDirection: 'column', flex: 1}}>
      <View>
        <Text style={styles.title_text_input}>Create a Note</Text>
      </View>
      <View style={styles.number_container}>
        <Text style={styles.number_label}>Match Number</Text>
        <TextInput
          onChangeText={text => setMatchNumber(text)}
          value={matchNumber}
          placeholder={'###'}
          placeholderTextColor={'grey'}
          keyboardType={'number-pad'}
          style={[
            styles.number_field,
            matchNumberError && {borderColor: 'red'},
          ]}
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
              onPress={() => selectAlliance('red')}>
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
                  selectedAlliance === 'blue' ? colors.primary : colors.card,
                padding: '5%',
                borderRadius: 10,
                flex: 1,
              }}
              onPress={() => selectAlliance('blue')}>
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
      <TouchableOpacity
        style={styles.submit_button_styling}
        onPress={() => setModalVisible(true)}
        disabled={
          matchNumber === '' || selectedAlliance === '' || matchNumberError
        }>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>
          Next
        </Text>
      </TouchableOpacity>
      {modalVisible && (
        <NoteInputModal
          onSubmit={submitNote}
          selectedAlliance={selectedAlliance}
          noteContents={noteContents}
          setNoteContents={setNoteContents}
        />
      )}
    </View>
  );
};

export default NoteScreen;
