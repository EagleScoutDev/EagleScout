import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FullScreenIncrementer from '../../components/form/FullScreenIncrementer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormSection from '../../components/form/FormSection';
import React, {useEffect, useState} from 'react';
import FormComponent from '../../components/form/FormComponent';
import StandardButton from '../../components/StandardButton';
import MatchInformation from '../../components/form/MatchInformation';
import DBManager from '../../DBManager';
import FormHelper from '../../FormHelper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Toast from 'react-native-toast-message';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB from '../../database/ScoutReports';

// TODO: add three lines to open drawer
const Tab = createMaterialTopTabNavigator();

function Gamification({navigation, route}) {
  const defaultValues = {
    radio: '',
    checkbox: [],
    textbox: '',
    number: 0,
    slider: 0,
  };

  const {colors} = useTheme();
  const [match, setMatch] = useState();
  const [team, setTeam] = useState();
  const [competition, setCompetition] = useState();
  const [formStructure, setFormStructure] = useState();
  const [formId, setFormId] = useState();

  const [data, setData] = useState(null);
  const [arrayData, setArrayData] = useState();
  const DEBUG = false;
  const [modalVisible, setModalVisible] = useState(false);

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
  async function initData(dataToSubmit, tempArray) {
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
    setAuto_scored({
      cones: [],
      cubes: [],
    });
    setTeleop_scored({
      cones: [],
      cubes: [],
    });
  };
  /**
   * Loads the form structure from the database or from AsyncStorage.
   * @returns {Promise<void>}
   */
  const loadFormStructure = async () => {
    const dbCompetition = await CompetitionsDB.getCurrentCompetition();
    const dbForm = await dbCompetition.form;
    const dbFormId = await dbCompetition.formId;
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
        initForm(objectStoredForm);
        // let tempArray = new Array(objectStoredForm.length);
        // for (let i = 0; i < objectStoredForm.length; i++) {
        //   if (objectStoredForm[i].type === 'heading') {
        //     tempArray[i] = null;
        //   } else {
        //     tempArray[i] = defaultValues[objectStoredForm[i].type];
        //   }
        // }
        // setArrayData(tempArray);
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
    loadFormStructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('modalVisible: ', modalVisible);
    // set arraydata to a copy of the arraydata, and
    // set the index of 10 in the array to the cube count
    if (arrayData === undefined || arrayData.length === 0) {
      console.log('arrayData is undefined or empty');
      return;
    }
    console.log('auto_scored: ', JSON.stringify(auto_scored));
    console.log('teleop_scored: ', JSON.stringify(teleop_scored));

    setArrayData(b => {
      let a = [...b];
      console.log(arrayData);
      a[2] =
        auto_scored.cones.filter(c => c === 'low').length +
        auto_scored.cubes.filter(c => c === 'low').length;
      a[3] =
        auto_scored.cones.filter(c => c === 'mid').length +
        auto_scored.cubes.filter(c => c === 'mid').length;
      a[4] =
        auto_scored.cones.filter(c => c === 'high').length +
        auto_scored.cubes.filter(c => c === 'high').length;

      a[7] =
        teleop_scored.cones.filter(c => c === 'low').length +
        teleop_scored.cubes.filter(c => c === 'low').length;
      a[8] =
        teleop_scored.cones.filter(c => c === 'mid').length +
        teleop_scored.cubes.filter(c => c === 'mid').length;
      a[9] =
        teleop_scored.cones.filter(c => c === 'high').length +
        teleop_scored.cubes.filter(c => c === 'high').length;
      // a[AUTO_SCORED_INDEX] =
      //   auto_scored.cones.length + auto_scored.cubes.length;
      // a[TELEOP_SCORED_INDEX] =
      //   teleop_scored.cones.length + teleop_scored.cubes.length;
      return a;
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

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
    setData(dict);
    console.log('dict: ', dict);
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
    <Tab.Navigator
      // change the position to be on the bottom
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.background,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        // make the distance between each tab smaller
        tabBarGap: 0,
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}>
      <Tab.Screen
        name={'Match'}
        options={{
          headerTintColor: colors.text,
          tabBarLabelStyle: {
            fontSize: 7.5,
            fontWeight: 'bold',
          },

          tabBarStyle: {
            backgroundColor: colors.background,
          },
        }}
        children={() => (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: '100%',
                }}>
                {competition !== undefined && (
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      fontSize: 20,
                      textAlign: 'center',
                      margin: '5%',
                    }}>
                    {competition.name}
                  </Text>
                )}
                <MatchInformation
                  match={match}
                  setMatch={setMatch}
                  team={team}
                  setTeam={setTeam}
                  disabled={true}
                />
              </View>
              <View style={{width: '100%', marginBottom: '5%'}}>
                <StandardButton
                  text={'Next'}
                  onPress={() => navigation.navigate(Object.keys(data)[0])}
                  color={colors.primary}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />

      {data &&
        Object.entries(data).map(([key, value], index) => {
          return (
            <Tab.Screen
              key={key}
              name={key}
              options={{
                // change font color in header
                headerTintColor: colors.text,
                tabBarLabelStyle: {
                  fontSize: 7.5,
                  fontWeight: 'bold',
                },

                tabBarStyle: {
                  backgroundColor: colors.background,
                },
              }}
              children={() => (
                // <KeyboardAvoidingView behavior={'height'}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {auto_scored !== undefined && teleop_scored !== undefined && (
                    <Modal
                      visible={modalVisible}
                      transparent={true}
                      animationType={'slide'}>
                      <FullScreenIncrementer
                        setVisible={setModalVisible}
                        cones={
                          index === 0 ? auto_scored.cones : teleop_scored.cones
                        }
                        cubes={
                          index === 0 ? auto_scored.cubes : teleop_scored.cubes
                        }
                        setScored={
                          index === 0 ? setAuto_scored : setTeleop_scored
                        }
                      />
                    </Modal>
                  )}
                  {/*if the index is 1 or 2, add a button to activate a modal*/}
                  {(index === 0 || index === 1) && (
                    <View style={{width: '100%'}}>
                      <StandardButton
                        text={'Show Modal'}
                        width={'85%'}
                        onPress={() => {
                          console.log('show modal visible pressed');
                          console.log(
                            'autoscored: ',
                            JSON.stringify(auto_scored),
                          );
                          console.log(
                            'teleopscored: ',
                            JSON.stringify(teleop_scored),
                          );
                          setModalVisible(true);
                        }}
                        color={'green'}
                      />
                    </View>
                  )}
                  <FormSection colors={colors} title={''} key={key.length}>
                    {value.map((item, vIndex) => {
                      return (
                        <FormComponent
                          key={item.question}
                          colors={colors}
                          item={item}
                          styles={styles}
                          arrayData={arrayData}
                          setArrayData={setArrayData}
                        />
                      );
                    })}
                  </FormSection>
                  {/*if the index is not the last one, add a button that navigates users to the next tab*/}
                  {index !== Object.keys(data).length - 1 && (
                    <View style={{width: '100%', marginBottom: '5%'}}>
                      <StandardButton
                        text={'Next'}
                        width={'85%'}
                        onPress={() =>
                          navigation.navigate(Object.keys(data)[index + 1])
                        }
                        color={colors.primary}
                      />
                    </View>
                  )}
                  {/*  if the index is the last one, show a touchable opacity*/}
                  {index === Object.keys(data).length - 1 && (
                    <View style={{width: '100%', marginBottom: '50%'}}>
                      <StandardButton
                        text={'Submit'}
                        width={'85%'}
                        color={colors.primary}
                        onPress={async () => {
                          let dataToSubmit = {};
                          if (match > 100 || !match) {
                            Alert.alert(
                              'Invalid Match Number',
                              'Please enter a valid match number',
                            );
                            navigation.navigate('Match');
                            return;
                          }

                          if (!team) {
                            Alert.alert(
                              'Invalid Team Number',
                              'Please enter a valid team number',
                            );
                            navigation.navigate('Match');
                            return;
                          }

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
                            return;
                          }

                          await initData(dataToSubmit, tempArray);

                          // make a request to google.com and get the response
                          const googleResponse = await fetch(
                            'https://google.com',
                          ).catch(() => {});

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
                              navigation.navigate('Match');
                            });

                            return;
                          } else {
                            console.log(dataToSubmit);

                            try {
                              await ScoutReportsDB.createOnlineScoutReport(
                                dataToSubmit,
                              );
                              Toast.show({
                                type: 'success',
                                text1: 'Scouting report submitted!',
                                visibilityTime: 3000,
                              });
                              setMatch('');
                              setTeam('');
                              initForm(formStructure);
                              navigation.navigate('Match');
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
                    </View>
                  )}
                </ScrollView>
                // </KeyboardAvoidingView>
              )}
            />
          );
        })}
    </Tab.Navigator>
  );
}

export default Gamification;
