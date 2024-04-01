import {Alert, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import FormHelper from '../../FormHelper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Toast from 'react-native-toast-message';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB from '../../database/ScoutReports';
import Gamification from './Gamification';
import ScoutingView from './ScoutingView';
import Confetti from 'react-native-confetti';
import {useCurrentCompetitionMatches} from '../../lib/useCurrentCompetitionMatches';

// TODO: add three lines to open drawer
createMaterialTopTabNavigator();

function ScoutingFlow({navigation, route, resetTimer}) {
  const defaultValues = useMemo(() => {
    return {
      radio: '',
      checkbox: [],
      textbox: '',
      number: 0,
      slider: 0,
    };
  }, []);

  const {colors} = useTheme();
  const [match, setMatch] = useState('');
  const [team, setTeam] = useState('');
  const [competition, setCompetition] = useState();
  const [formStructure, setFormStructure] = useState();
  const [formId, setFormId] = useState();

  const [data, setData] = useState(null);
  const [arrayData, setArrayData] = useState();
  const [isCompetitionHappening, setIsCompetitionHappening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confettiView, setConfettiView] = useState(null);
  const [isScoutStylePreferenceScrolling, setIsScoutStylePreferenceScrolling] =
    useState(false);
  const [scoutStylePreference, setScoutStylePreference] = useState('Paginated');

  const {competitionId, matches, getTeamsForMatch} =
    useCurrentCompetitionMatches();
  const [teamsForMatch, setTeamsForMatch] = useState([]);
  useEffect(() => {
    if (!match || match > 400) {
      return;
    }
    const teams = getTeamsForMatch(Number(match));
    if (teams.length > 0) {
      setTeamsForMatch(teams);
    }
  }, [match, competitionId, matches]);

  useEffect(() => {
    FormHelper.readAsyncStorage(FormHelper.SCOUTING_STYLE).then(value => {
      if (value != null) {
        setScoutStylePreference(value);
      }
    });
  }, []);

  useEffect(() => {
    if (scoutStylePreference === 'Scrolling') {
      setIsScoutStylePreferenceScrolling(true);
    } else {
      setIsScoutStylePreferenceScrolling(false);
    }
  }, [scoutStylePreference]);

  /**
   * Initializes fields of the report before submitting it.
   * @param dataToSubmit the object containing all report information
   * @param tempArray an array containing just the values
   */
  function initData(dataToSubmit, tempArray) {
    dataToSubmit.data = tempArray;
    dataToSubmit.matchNumber = match;
    dataToSubmit.teamNumber = team;
    dataToSubmit.competitionId = competition.id;
    dataToSubmit.competitionName = competition.name;
  }

  /**
   * Checks if all questions marked as required were filled out
   * @param tempArray
   * @returns {boolean} true if all are filled out, false if there are some left unanswered.
   */
  function checkRequiredFields(tempArray) {
    for (let i = 0; i < formStructure.length; i++) {
      if (
        formStructure[i].required &&
        (tempArray[i] === '' || tempArray[i] == null) &&
        formStructure[i].type !== 'number'
      ) {
        Alert.alert(
          'Required Question: ' + formStructure[i].question + ' not filled out',
          'Please fill out all questions denoted with an asterisk',
        );
        return false;
      }
    }
    return true;
  }

  /**
   * initializes the form array with the correct value per question type
   * @param dbForm
   */
  const initForm = useCallback(
    form => {
      let tempArray = new Array(form.length);
      for (let i = 0; i < form.length; i++) {
        if (form[i].type === 'heading') {
          tempArray[i] = null;
        } else if (form[i].type === 'radio') {
          tempArray[i] = form[i].defaultIndex;
        } else if (form[i].type === 'checkbox') {
          tempArray[i] = form[i].checkedByDefault;
        } else {
          tempArray[i] = defaultValues[form[i].type];
        }
      }
      setArrayData(tempArray);
    },
    [defaultValues, isScoutStylePreferenceScrolling],
  );

  /**
   * Loads the form structure from the database or from AsyncStorage.
   * @returns {Promise<void>}
   */
  const loadFormStructure = useCallback(async () => {
    let dbRequestWorked;
    let dbCompetition;
    try {
      dbCompetition = await CompetitionsDB.getCurrentCompetition();
      dbRequestWorked = true;
    } catch (e) {
      dbRequestWorked = false;
    }

    let comp;
    if (dbRequestWorked) {
      if (dbCompetition != null) {
        comp = dbCompetition;
        await AsyncStorage.setItem(
          FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
          JSON.stringify(dbCompetition),
        );
      }
    } else {
      const storedComp = await FormHelper.readAsyncStorage(
        FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
      );
      if (storedComp != null) {
        comp = JSON.parse(storedComp);
      }
    }
    setIsOffline(!dbRequestWorked);
    console.log('LOADINGCOMPS');

    if (comp != null) {
      setIsCompetitionHappening(true);
      setFormId(comp.formId);
      setFormStructure(comp.form);
      setCompetition(comp);
      initForm(comp.form);
    } else {
      setIsCompetitionHappening(false);
    }
  }, []);

  const startConfetti = () => {
    console.log('starting confetti');
    confettiView.startConfetti();
  };

  const submitForm = async () => {
    let dataToSubmit = {};
    if (match > 400 || !match) {
      Alert.alert('Invalid Match Number', 'Please enter a valid match number');
      if (!isScoutStylePreferenceScrolling) {
        navigation.navigate('Match');
      }
      return;
    }

    if (!team) {
      Alert.alert('Invalid Team Number', 'Please enter a valid team number');
      if (!isScoutStylePreferenceScrolling) {
        navigation.navigate('Match');
      }
      return;
    }
    setIsSubmitting(true);

    // array containing the raw values of the form
    let tempArray = [...arrayData];

    if (!checkRequiredFields(tempArray)) {
      setIsSubmitting(false);
      return;
    }

    initData(dataToSubmit, tempArray);

    const internetResponse = await CompetitionsDB.getCurrentCompetition()
      .then(() => true)
      .catch(() => false);

    if (!internetResponse) {
      FormHelper.saveFormOffline({
        ...dataToSubmit,
        form: formStructure,
        formId: formId,
      }).then(() => {
        Toast.show({
          type: 'success',
          text1: 'Saved offline successfully!',
          visibilityTime: 3000,
        });
        const matchCopy = match;
        const teamCopy = team;
        (async () => {
          const data = await AsyncStorage.getItem('scout-assignments');
          if (data != null) {
            const assignments = JSON.parse(data);
            const newAssignments = assignments.filter(assignment => {
              console.log(assignment.matchNumber);
              console.log(assignment.team.substring(3));
              console.log(matchCopy);
              console.log(teamCopy);
              if (
                assignment.matchNumber === parseInt(matchCopy, 10) &&
                assignment.team == null
              ) {
                return false;
              } else if (
                assignment.matchNumber === parseInt(matchCopy, 10) &&
                assignment.team.substring(3) === teamCopy
              ) {
                return false;
              } else {
                return true;
              }
            });
            await AsyncStorage.setItem(
              'scout-assignments',
              JSON.stringify(newAssignments),
            );
          }
        })();
        setMatch('');
        setTeam('');
        initForm(formStructure);
        if (!isScoutStylePreferenceScrolling) {
          startConfetti();
          navigation.navigate('Match');
        }
      });
    } else {
      console.log(dataToSubmit);

      try {
        await ScoutReportsDB.createOnlineScoutReport(dataToSubmit);
        Toast.show({
          type: 'success',
          text1: 'Scouting report submitted!',
          visibilityTime: 3000,
        });
        setMatch('');
        setTeam('');
        resetTimer();
        initForm(formStructure);
        if (!isScoutStylePreferenceScrolling) {
          startConfetti();
          navigation.navigate('Match');
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Error',
          'There was an error submitting your scouting report.',
        );
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (route.params != null) {
        const {team: paramsTeam, match: paramsMatch} = route.params;
        console.log('team: ', paramsTeam);
        paramsTeam != null ? setTeam(paramsTeam.toString()) : setTeam('');
        paramsMatch != null ? setMatch(paramsMatch.toString()) : setMatch('');
        //navigation.setParams({team: undefined, params: undefined});
        navigation.setParams({team: undefined, match: undefined});
      }
    });
  }, [navigation, route.params]);

  useEffect(() => {
    loadFormStructure().catch(console.error);
  }, [loadFormStructure]);

  useEffect(() => {
    if (formStructure == null) {
      return;
    }

    // create a constant "a" that is a copy of the array data
    let a = [...formStructure];
    // console.log('formStructure: ', formStructure);
    // console.log('a: ', a);
    let dict = {};
    let currentHeading = a[0].title;
    // remove the first element of the array
    let ind = 0;
    while (a.length > 0) {
      let b = a.shift();
      // console.log('b: ' + b);
      if (b.type === 'heading') {
        currentHeading = b.title;
        dict[currentHeading] = [];
      } else {
        if (dict[currentHeading]) {
          b.indice = ind;
          dict[currentHeading].push(b);
        } else {
          dict[currentHeading] = [];
        }
      }
      ind++;
    }
    setData(dict);
    //console.log('dict: ', dict);
  }, [formStructure]);

  const styles = StyleSheet.create({
    textInput: {
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      padding: 10,
      color: colors.text,
    },
    badInput: {
      height: 40,
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
      color: 'red',
    },
    subtitle: {
      textAlign: 'left',
      paddingBottom: 15,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <>
      {isCompetitionHappening ? (
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
          {isScoutStylePreferenceScrolling ? (
            <ScoutingView
              match={match}
              setMatch={setMatch}
              team={team}
              setTeam={setTeam}
              teamsForMatch={teamsForMatch}
              colors={colors}
              styles={styles}
              competition={competition}
              data={data}
              arrayData={arrayData}
              setArrayData={setArrayData}
              submitForm={submitForm}
              isSubmitting={isSubmitting}
            />
          ) : (
            <Gamification
              match={match}
              setMatch={setMatch}
              team={team}
              setTeam={setTeam}
              teamsForMatch={teamsForMatch}
              colors={colors}
              styles={styles}
              navigation={navigation}
              competition={competition}
              data={data}
              arrayData={arrayData}
              setArrayData={setArrayData}
              submitForm={submitForm}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: colors.text}}>
            There is no competition happening currently.
          </Text>

          {isOffline && (
            <Text>
              To check for competitions, please connect to the internet.
            </Text>
          )}
        </View>
      )}
    </>
  );
}

export default ScoutingFlow;
