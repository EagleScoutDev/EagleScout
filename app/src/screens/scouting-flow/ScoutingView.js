import {Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormSection from '../../components/form/FormSection';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import FormComponent from '../../components/form/FormComponent';
import MatchInformation from '../../components/form/MatchInformation';
import DBManager from '../../DBManager';
import FormHelper from '../../FormHelper';
import StandardButton from '../../components/StandardButton';
import Toast from 'react-native-toast-message';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB from '../../database/ScoutReports';

const defaultValues = {
  radio: '',
  checkbox: [],
  textbox: '',
  number: 0,
  slider: 0,
};

const DEBUG = false;

function ScoutingView({navigation, route}) {
  const {colors} = useTheme();
  const [match, setMatch] = useState();
  const [team, setTeam] = useState();
  const [competition, setCompetition] = useState();
  const [formStructure, setFormStructure] = useState();
  const [formId, setFormId] = useState();

  const [data, setData] = useState(null);
  const [arrayData, setArrayData] = useState();

  /**
   * Initializes fields of the report before submitting it.
   * @param dataToSubmit the object containing all report information
   * @param tempArray an array containing just the values
   */
  function initData(dataToSubmit, tempArray) {
    dataToSubmit.data = tempArray;
    dataToSubmit.matchNumber = match; //
    dataToSubmit.teamNumber = team;
    dataToSubmit.competitionId = competition.id;
    //dataToSubmit.form = formStructure;
    //dataToSubmit.form_id_arg = formId;
    //dataToSubmit.user_id = user.id;
    //dataToSubmit.competition = competition.id;
  }

  /**
   * initializes the form array with the correct value per question type
   * @param dbForm
   */
  const initForm = dbForm => {
    let tempArray = new Array(dbForm.length);
    for (let i = 0; i < dbForm.length; i++) {
      if (dbForm[i].type === 'heading') {
        tempArray[i] = null;
      } else {
        tempArray[i] = defaultValues[dbForm[i].type];
      }
    }
    setArrayData(tempArray);
  };

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
   * Loads the form structure from the database or from AsyncStorage.
   * @returns {Promise<void>}
   */
  const loadFormStructure = async () => {
    const dbCompetition = await CompetitionsDB.getCurrentCompetition();
    const dbForm = dbCompetition.form;
    const dbFormId = dbCompetition.formId;
    console.log('dbCompetition: ' + JSON.stringify(dbCompetition));
    if (dbForm !== null || dbCompetition !== null) {
      if (DEBUG) {
        console.log('Form found in database');
      }
      setFormStructure(dbForm);
      setFormId(dbFormId);
      setCompetition(dbCompetition);
      await AsyncStorage.setItem(
        FormHelper.LATEST_FORM,
        JSON.stringify(dbForm),
      );
      await AsyncStorage.setItem(
        FormHelper.COMPETITION,
        JSON.stringify(dbCompetition),
      );

      initForm(dbForm);

      // let tempArray = new Array(dbForm.length);
      // for (let i = 0; i < dbForm.length; i++) {
      //   if (dbForm[i].type === 'heading') {
      //     tempArray[i] = null;
      //   } else {
      //     tempArray[i] = defaultValues[dbForm[i].type];
      //   }
      // }
      // setArrayData(tempArray);
    } else {
      if (DEBUG) {
        console.warn('No internet connection, reading offline form');
      }

      const objectStoredForm = JSON.parse(
        await FormHelper.readAsyncStorage('2023form'),
      );
      const objectStoredCompetition = JSON.parse(
        await FormHelper.readAsyncStorage('2023competition'),
      );
      if (DEBUG) {
        console.info('stored form: ' + objectStoredForm);
      }

      if (objectStoredForm !== null && objectStoredCompetition !== null) {
        setFormStructure(objectStoredForm);
        setCompetition(objectStoredCompetition);
        initForm(dbForm);
      } else {
        if (DEBUG) {
          console.error(
            '[loadFormStructure] no internet connection and no stored form',
          );
        }
      }
    }
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (route.params != null) {
        const {team, match} = route.params;
        console.log('team: ', team);
        if (team != null) {
          setTeam(team.toString());
        } else {
          setTeam('');
        }
        if (match != null) {
          setMatch(match.toString());
        } else {
          setMatch('');
        }
        //navigation.setParams({team: undefined, params: undefined});
        navigation.setParams({team: undefined, match: undefined});
      }
    });
  }, [navigation, route.params]);

  useEffect(() => {
    loadFormStructure().then(r => {
      if (DEBUG) {
        console.log('loadFormStructure() finished');
      }
    });
  }, []);

  useEffect(() => {
    if (formStructure === undefined) {
      return;
    }

    // create a constant "a" that is a copy of the array data
    let a = [...formStructure];
    // console.log('formStructure: ', formStructure);
    // console.log('a: ', a);
    let dict: Object = {};
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
    if (DEBUG) {
      console.info('dict: ', dict);
    }
    setData(dict);
  }, [formStructure]);

  const styles = StyleSheet.create({
    textInput: {
      height: 40,
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
    <ScrollView>
      <Text
        style={{
          color: colors.text,
          textAlign: 'center',
          paddingBottom: 15,
          fontWeight: 'bold',
          fontSize: 30,
          marginTop: 20,
          // marginVertical: 20,
        }}>
        Scouting Report
      </Text>
      {competition !== undefined && (
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          {competition.name}
        </Text>
      )}
      <MatchInformation
        match={match}
        setMatch={setMatch}
        team={team}
        setTeam={setTeam}
      />

      {/*
       * The 'data' variable used here is a dictionary
       * Each key in the dictionary is a header
       * Each value is an array of questions
       */}
      {data &&
        Object.entries(data).map(([key, value], index) => {
          return (
            <FormSection colors={colors} title={key} key={key.length}>
              {value.map((item, vIndex) => {
                return (
                  <FormComponent
                    colors={colors}
                    item={item}
                    styles={styles}
                    uniqueKey={item.question}
                    arrayData={arrayData}
                    setArrayData={setArrayData}
                  />
                );
              })}
            </FormSection>
          );
        })}
      <StandardButton
        text={'Submit'}
        color={colors.primary}
        width={'85%'}
        onPress={async () => {
          let dataToSubmit = {};
          //   Idea: on submit, it will collapse every section, and literally
          // like a JUNIT test, display a green checkmark next to each one if passed, and a red X if failed
          // this will require an external variable to manage the state of each section
          if (match > 100 || !match) {
            Alert.alert(
              'Invalid Match Number',
              'Please enter a valid match number',
            );
            return;
          }

          if (!team) {
            Alert.alert(
              'Invalid Team Number',
              'Please enter a valid team number',
            );
            return;
          }

          // convert each item in an array to a key-value pair in a dictionary.
          let tempArray = [...arrayData];
          // get number of items in dictionary
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

          // ensuring each required question is filled out
          if (!checkRequiredFields(tempArray)) {
            return;
          }

          initData(dataToSubmit, tempArray);

          // make a request to google.com and get the response
          const googleResponse = await fetch('https://google.com').catch(
            () => {},
          );

          if (!googleResponse) {
            FormHelper.saveFormOffline({
              ...dataToSubmit,
              form: formStructure,
              formId: formId,
            }).then(() => {
              console.log('cbbbb');
              Toast.show({
                type: 'success',
                text1: 'Saved offline successfully!',
                visibilityTime: 3000,
              });
              setMatch('');
              setTeam('');
              setArrayData([]);
              initForm(formStructure);
            });
          } else {
            //dataToSubmit.timestamp = firestore.FieldValue.serverTimestamp();

            try {
              await ScoutReportsDB.createOnlineScoutReport(dataToSubmit);
              Toast.show({
                type: 'success',
                text1: 'Scouting report submitted!',
                visibilityTime: 3000,
              });
              setMatch('');
              setTeam('');
              setArrayData([]);
              initForm(formStructure);
            } catch (error) {
              console.error(error);
              Alert.alert(
                'Error',
                'There was an error submitting your scouting report.',
              );
            }
          }
        }}
      />
    </ScrollView>
  );
}

export default ScoutingView;
