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

// TODO: add three lines to open drawer
createMaterialTopTabNavigator();
function ScoutingFlow({navigation, route, isScoutStylePreferenceScrolling}) {
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
  const [match, setMatch] = useState();
  const [team, setTeam] = useState();
  const [competition, setCompetition] = useState();
  const [formStructure, setFormStructure] = useState();
  const [formId, setFormId] = useState();

  const [data, setData] = useState(null);
  const [arrayData, setArrayData] = useState();
  const [isCompetitionHappening, setIsCompetitionHappening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confettiView, setConfettiView] = useState(null);

  // for the full-screen incrementer
  const [teleop_scored, setTeleop_scored] = useState({
    cones: [],
    cubes: [],
  });
  const [auto_scored, setAuto_scored] = useState({
    cones: [],
    cubes: [],
  });

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
        tempArray[i] === defaultValues[formStructure[i].type] &&
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
        } else {
          tempArray[i] = defaultValues[form[i].type];
        }
      }
      setArrayData(tempArray);
      if (!isScoutStylePreferenceScrolling) {
        setAuto_scored({
          cones: [],
          cubes: [],
        });
        setTeleop_scored({
          cones: [],
          cubes: [],
        });
      }
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

    if (comp != null) {
      setIsCompetitionHappening(true);
      setFormId(comp.formId);
      setFormStructure(comp.form);
      setCompetition(comp);
      initForm(comp.form);
    } else {
      setIsCompetitionHappening(false);
    }
  }, [initForm]);

  const startConfetti = () => {
    console.log('starting confetti');
    confettiView.startConfetti();
  };

  const submitForm = async () => {
    let dataToSubmit = {};
    if (match > 100 || !match) {
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

    // number of items in dictionary
    const numItems = Object.keys(formStructure).length;

    // converts each checkbox type into a format usable for the form
    // remember: each checkbox stores the data as an array of indices
    // but the database requires a dictionary, with the key representing the index (in terms of the dictionary)
    // and the value representing the index of the answer relative to the array of checkbox options
    for (let i = 0; i < numItems; i++) {
      if (formStructure[i].type === 'checkbox') {
        let tempDict = {};
        for (let j = 0; j < tempArray[i].length; j++) {
          tempDict[j] = tempArray[i][j];
        }
        tempArray[i] = tempDict;
      }
    }

    if (!checkRequiredFields(tempArray)) {
      setIsSubmitting(false);
      return;
    }

    initData(dataToSubmit, tempArray);

    // make a request to google.com and get the response
    const googleResponse = await fetch('https://google.com').catch(() => {});

    if (!googleResponse) {
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
    let currentHeading = a[0].text;
    // remove the first element of the array
    let ind = 0;
    while (a.length > 0) {
      let b = a.shift();
      // console.log('b: ' + b);
      if (b.type === 'heading') {
        currentHeading = b.text;
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
              colors={colors}
              competition={competition}
              data={data}
              arrayData={arrayData}
              setArrayData={setArrayData}
              submitForm={submitForm}
              isSubmitting={isSubmitting}
            />
          ) : (
            <Gamification
              teleop_scored={teleop_scored}
              setTeleop_scored={setTeleop_scored}
              auto_scored={auto_scored}
              setAuto_scored={setAuto_scored}
              match={match}
              setMatch={setMatch}
              team={team}
              setTeam={setTeam}
              colors={colors}
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
          <Text>There is no competition happening currently.</Text>

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
