import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {useEffect, useState} from 'react';
import ReportList from '../components/ReportList';
import {useTheme} from '@react-navigation/native';
import NoInternet from '../components/NoInternet';
import AddCompetitionModal from '../components/modals/AddCompetitionModal';
import StandardButton from '../components/StandardButton';
import DatePicker from 'react-native-date-picker';
import DBManager from '../DBManager';
//import InAppBrowser from 'react-native-inappbrowser-reborn';
//import {v4 as uuid} from 'uuid';
import {supabase} from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompetitionsDB from '../database/Competitions';
import ScoutReportsDB from '../database/ScoutReports';

const DEBUG = true;

const CompetitionsView = ({navigate}) => {
  const [competitions, setCompetitions] = useState([]);
  const [competitionIds, setCompetitionIds] = useState([]);
  // TODO: have chosenComp be an object encapsulating everything for a competition.
  // this will allow us to have more information about the competition without having to
  // store everything in separate variables
  const [chosenComp, setChosenComp] = useState(null);
  const [scoutData, setScoutData] = useState([]);
  const {colors} = useTheme();
  const [internetError, setInternetError] = useState(false);
  const [addCompetitionModal, setAddCompetitionModal] = useState(false);

  // for the editing competition modal
  const [editingMode, setEditingMode] = useState(false);
  const [editingModal, setEditingModal] = useState(false);
  const [scoutSpreadsheetEditingModal, setScoutSpreadsheetEditingModal] =
    useState(false);
  const [settingScoutSpreadsheetModal, setSettingScoutSpreadsheetModal] =
    useState(false);
  const [
    loadingSettingScoutSpreadsheetModal,
    setLoadingSettingScoutSpreadsheetModal,
  ] = useState(false);
  const [addSpreadsheetLoadingText, setAddSpreadsheetLoadingText] =
    useState('Loading...');
  const [scoutSpreadsheetUrl, setScoutSpreadsheetUrl] = useState('');
  const [originalTempComp, setOriginalTempComp] = useState({
    name: '',
    startdate: '',
    enddate: '',
  });
  const [tempComp, setTempComp] = useState({
    name: '',
    startdate: '',
    enddate: '',
  });
  const [tempCompId, setTempCompId] = useState(null);
  const [editingStart, setEditingStart] = useState(false);
  const [editingEnd, setEditingEnd] = useState(false);

  const [loadingCompetitionReports, setLoadingCompetitionReports] =
    useState(false);
  // checking if user has permission to edit competitions
  const [admin, setAdmin] = useState(false);

  const checkAdmin = async () => {
    // use async storage
    const user = await AsyncStorage.getItem('user');
    if (user !== null) {
      console.log('user: ' + user);
      const userObj = JSON.parse(user);
      if (userObj.admin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
  };

  const getCompetitions = async () => {
    if (DEBUG) {
      console.log('Starting to look for competitions');
    }

    console.log('before');
    try {
      const data = await CompetitionsDB.getCompetitions();
      console.log(data);
      const foundComp = data.map(doc => doc);
      const foundCompIds = data.map(doc => doc.id);
      setCompetitionIds(foundCompIds);
      setCompetitions(foundComp);
      if (DEBUG) {
        foundComp.forEach(comp => {
          console.log(comp);
        });
        console.log('Finished searching for competitions');
      }
      setInternetError(false);
    } catch (error) {
      console.error(error);
      setInternetError(true);
    }
  };

  useEffect(() => {
    checkAdmin();
    getCompetitions().then(r => {
      // if (DEBUG) {
      //   console.log(competitions);
      // }
    });
  }, []);

  // useEffect(() => {
  //   if (chosenComp !== null) {
  //     DBManager.getReportsForCompetition(chosenComp).then(r => {
  //       setScoutData(r);
  //     });
  //   }
  // }, [chosenComp]);

  if (internetError) {
    return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
  }

  return (
    <View style={{flex: 1}}>
      {/*TODO: Make this bigger*/}
      {chosenComp !== null && (
        <View>
          <TouchableOpacity onPress={() => setChosenComp(null)}>
            <Text
              style={{
                textAlign: 'right',
                padding: 15,
                color: colors.primary,
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              See Another Competition
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              color: colors.text,
              textAlign: 'center',
              paddingHorizontal: '5%',
              paddingTop: '5%',
            }}>
            {chosenComp.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'gray',
              textAlign: 'center',
              paddingBottom: '5%',
            }}>
            {new Date(chosenComp.startTime).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                // year: 'numeric',
              },
            )}{' '}
            -{' '}
            {new Date(chosenComp.endTime).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
              },
            )}{' '}
            ({new Date(chosenComp.endTime).getFullYear()})
          </Text>
        </View>
      )}
      {chosenComp === null && (
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: colors.background,
            height: '100%',
            borderRadius: 10,
            padding: '10%',
            width: '100%',
          }}>
          {admin && (
            <TouchableOpacity
              onPress={() => setEditingMode(!editingMode)}
              style={{
                alignSelf: 'flex-end',
                // backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 10,
                position: 'absolute',
              }}>
              <Text
                style={{
                  color: editingMode ? colors.primary : 'gray',
                  fontWeight: 'bold',
                  fontSize: 17,
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 20,
              color: colors.text,
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: colors.border,
            }}>
            Choose a Competition
          </Text>
          <ActivityIndicator
            animating={loadingCompetitionReports}
            size="large"
            color={colors.primary}
          />
          <ScrollView>
            {competitions.map((comp, index) => (
              <TouchableOpacity
                key={comp.id}
                onPress={() => {
                  if (editingMode) {
                    if (DEBUG) {
                      console.log('editing mode enabled');
                    }
                    setEditingModal(true);
                    setTempComp(comp);
                    setOriginalTempComp(comp);
                    setTempCompId(competitionIds[index]);
                    setScoutSpreadsheetUrl('');
                  } else {
                    setLoadingCompetitionReports(true);
                    ScoutReportsDB.getReportsForCompetition(comp.id).then(r => {
                      /*r[0].form.map(form => {
                        console.log(form);
                      });*/
                      
                      //console.log(JSON.stringify(r[0].form));
                      setScoutData(r);
                      setLoadingCompetitionReports(false);
                      setChosenComp(comp);
                    });
                  }
                }}
                style={{
                  padding: 20,
                  borderRadius: 10,
                  backgroundColor:
                    index % 2 === 0 ? colors.border : colors.background,
                }}>
                <Text
                  style={{
                    color: editingMode ? colors.primary : colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  {comp.name} (
                  {new Date(comp.startTime).getFullYear()})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {editingModal && (
            <Modal animationType="slide" transparent={true} visible={true}>
              <View
                style={{
                  backgroundColor: colors.card,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: '30%',
                  borderRadius: 20,
                  borderColor: 'black',
                  borderWidth: 1,
                  padding: 35,
                  elevation: 5,
                  margin: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.text,
                    fontWeight: '600',
                    paddingBottom: 20,
                  }}>
                  Edit "{tempComp.name}"
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    padding: 10,
                    borderRadius: 10,
                    width: '100%',
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: colors.text,
                  }}
                  placeholder="Competition Name"
                  placeholderTextColor={colors.text}
                  onChangeText={text => {
                    setTempComp({...tempComp, name: text});
                  }}
                  value={tempComp.name}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 10,
                      padding: 10,
                      flex: 0.7,
                    }}
                    onPress={() => setEditingStart(true)}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      Start Date
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.border,
                      borderRadius: 10,
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => setEditingStart(true)}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {new Date(
                        tempComp.startTime,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={editingStart}
                    date={new Date(tempComp.startTime)}
                    mode={'date'}
                    onConfirm={date => {
                      // TODO: save data here
                      setTempComp({
                        ...tempComp,
                        startdate: date,
                      });
                      setEditingStart(false);
                    }}
                    onCancel={() => {}}
                  />
                </View>
                <View style={{height: 20}} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 10,
                      padding: 10,
                      flex: 0.7,
                    }}
                    onPress={() => setEditingEnd(true)}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      End Date
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.border,
                      borderRadius: 10,
                      padding: 10,
                      flex: 1,
                    }}
                    onPress={() => setEditingEnd(true)}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {new Date(
                        tempComp.endTime,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={editingEnd}
                    date={new Date(tempComp.endTime)}
                    mode={'date'}
                    onConfirm={date => {
                      setTempComp({
                        ...tempComp,
                        enddate: date,
                      });
                      setEditingEnd(false);
                    }}
                    onCancel={() => {
                      setEditingEnd(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <StandardButton
                    text="Scouting spreadsheet"
                    color={'green'}
                    onPress={() => {
                      setScoutSpreadsheetEditingModal(true);
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <StandardButton
                    text="Delete"
                    color={'red'}
                    width={'40%'}
                    onPress={() => {
                      Alert.alert(
                        'Delete ' + tempComp.name + '?',
                        'Are you sure you want to delete this competition? This action cannot be undone.',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => {
                              if (DEBUG) {
                                console.log('Cancel Pressed');
                              }
                            },
                            style: 'cancel',
                          },
                          {
                            text: 'Delete',
                            onPress: async () => {
                              // deleteCompetition(tempComp.id);

                              const {data, error} = await supabase
                                .from('competitions')
                                .delete()
                                .eq('id', tempComp.id);
                              if (error) {
                                console.error(error);
                                Alert.alert(
                                  'Error',
                                  'There was an error deleting the competition. Please try again.',
                                  [
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                        if (DEBUG) {
                                          console.log('OK Pressed');
                                        }
                                      },
                                    },
                                  ],
                                  {cancelable: false},
                                );
                              } else {
                                if (DEBUG) {
                                  console.log('deleted competition');
                                }
                                setEditingModal(false);
                                setEditingMode(false);
                                getCompetitions();
                              }
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                  />
                  <StandardButton
                    text={tempComp === originalTempComp ? 'Cancel' : 'Save'}
                    color={colors.primary}
                    width={'40%'}
                    onPress={async () => {
                      if (tempComp === originalTempComp) {
                        setEditingModal(false);
                        setEditingMode(false);
                        return;
                      }
                      const { data, error } = await supabase.from('competitions').update({
                        name: tempComp.name,
                        start_time: tempComp.startTime,
                        end_time: tempComp.endtime
                      }).eq('id', tempComp.id);

                      if (error) {
                        console.error(error);
                        Alert.alert(
                          'Error',
                          'There was an error updating the competition. Please try again.',
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                if (DEBUG) {
                                  console.log('OK Pressed');
                                }
                              },
                              style: 'cancel',
                            },
                          ],
                          {cancelable: false},
                        );
                        if (DEBUG) {
                          console.log(error);
                        }
                      } else {
                        if (DEBUG) {
                          console.log('updated competition');
                        }
                        setEditingModal(false);
                        setEditingMode(false);
                        getCompetitions();
                      }
                    }}
                  />
                </View>
              </View>
            </Modal>
          )}
          {admin && (
            <TouchableOpacity
              onPress={() => {
                if (DEBUG) {
                  console.log('adding a new competition');
                }

                setAddCompetitionModal(true);
              }}
              style={{
                padding: '2%',
                alignContent: 'center',
                justifyContent: 'center',
                paddingHorizontal: '6%',
                margin: 10,
                borderRadius: 100,
                borderStyle: 'solid',
                backgroundColor: colors.primary,
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 40,
                }}>
                +
              </Text>
            </TouchableOpacity>
          )}
          {scoutSpreadsheetEditingModal && (
            <Modal animationType="slide" transparent={true} visible={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    width: '80%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 17,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      Spreadsheet Link Status:
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 17,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {tempComp.scoutAssignmentsSpreadsheet == null
                        ? 'Not linked'
                        : 'Linked'}
                    </Text>
                  </View>
                  {!tempComp.scoutAssignmentsSpreadsheet && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}>
                      <StandardButton
                        text="Link spreadsheet"
                        color={'green'}
                        onPress={() => {
                          setSettingScoutSpreadsheetModal(true);
                        }}
                      />
                    </View>
                  )}
                  {tempComp.scoutAssignmentsSpreadsheet && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}>
                      <StandardButton
                        text="Unlink spreadsheet"
                        color={'red'}
                        onPress={() => {
                          Alert.alert(
                            'Unlink spreadsheet',
                            'Do you really want to unlink the scouting spreadsheet',
                            [
                              {
                                text: 'Cancel',
                              },
                              {
                                text: 'Unlink',
                                onPress: async () => {
                                  /*const compRef = firestore()
                                    .collection('competitions')
                                    .doc(tempCompId);
                                  await compRef.update({
                                    scoutAssignmentsSpreadsheet:
                                      firestore.FieldValue.delete(),
                                  });
                                  Alert.alert(
                                    'Success',
                                    'Scout spreadsheet successfully unlinked.',
                                  );*/
                                  await getCompetitions();
                                  setScoutSpreadsheetEditingModal(false);
                                  setEditingModal(false);
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        }}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <StandardButton
                      text="Cancel"
                      color={'red'}
                      onPress={() => {
                        setScoutSpreadsheetEditingModal(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}
          {settingScoutSpreadsheetModal && (
            <Modal animationType="slide" transparent={true} visible={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    width: '80%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 17,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      Spreadsheet Link:
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      placeholder="Spreadsheet Link"
                      style={{
                        height: 40,
                        width: '100%',
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                        margin: 10,
                        color: colors.text,
                        backgroundColor: colors.background,
                      }}
                      defaultValue={''}
                      onChangeText={text => {
                        setScoutSpreadsheetUrl(text);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <StandardButton
                      text="Submit"
                      color={'green'}
                      onPress={async () => {
                        //setScoutSpreadsheetEditingModal(true);
                        /*setAddSpreadsheetLoadingText(
                          'Opening browser to link spreadsheet...',
                        );
                        setLoadingSettingScoutSpreadsheetModal(true);
                        const competition = tempCompId;
                        const authKey = uuid();
                        await firestore()
                          .collection('spreadsheet_sync_auth')
                          .add({
                            authKey: authKey,
                          });

                        let details = {
                          authKey: authKey,
                          competition: competition,
                          spreadsheetUrl: scoutSpreadsheetUrl,
                        };

                        let formBody = [];
                        for (let property in details) {
                          let encodedKey = encodeURIComponent(property);
                          let encodedValue = encodeURIComponent(
                            details[property],
                          );
                          formBody.push(encodedKey + '=' + encodedValue);
                        }

                        formBody = formBody.join('&');

                        const url =
                          'https://script.google.com/macros/s/AKfycbyM5BQf4xHdRwQmfDEXD2aUPYlhVsNQcs2A4KMBNfatDkbKFu_n95wCRnD5TlxrF3KIqQ/exec?' +
                          formBody;
                        try {
                          if (await InAppBrowser.isAvailable()) {
                            const result = await InAppBrowser.open(url, {
                              // iOS Properties
                              dismissButtonStyle: 'cancel',
                              preferredBarTintColor: '#453AA4',
                              preferredControlTintColor: 'white',
                              readerMode: false,
                              animated: true,
                              modalPresentationStyle: 'fullScreen',
                              modalTransitionStyle: 'coverVertical',
                              modalEnabled: true,
                              enableBarCollapsing: false,
                              // Android Properties
                              showTitle: true,
                              toolbarColor: '#6200EE',
                              secondaryToolbarColor: 'black',
                              navigationBarColor: 'black',
                              navigationBarDividerColor: 'white',
                              enableUrlBarHiding: true,
                              enableDefaultShare: true,
                              forceCloseOnRedirection: false,
                              // Specify full animation resource identifier(package:anim/name)
                              // or only resource name(in case of animation bundled with app).
                              animations: {
                                startEnter: 'slide_in_right',
                                startExit: 'slide_out_left',
                                endEnter: 'slide_in_left',
                                endExit: 'slide_out_right',
                              },
                            });
                            //await this.sleep(800);
                            //Alert.alert(JSON.stringify(result));
                          } else {
                            console.warn(
                              'InAppBrowser not available, defaulting to Linking.openURL',
                            );
                            await Linking.openURL(url);
                          }
                        } catch (error) {
                          Alert.alert(error.message);
                        }

                        const doc = await firestore()
                          .collection('competitions')
                          .doc(competition)
                          .get();
                        if (doc.data().scoutAssignmentsSpreadsheet != null) {
                          // success
                          Alert.alert(
                            'Success',
                            'Successfully linked spreadsheet',
                          );
                          setLoadingSettingScoutSpreadsheetModal(false);
                          setSettingScoutSpreadsheetModal(false);
                          setScoutSpreadsheetEditingModal(false);
                          setEditingModal(false);
                          await getCompetitions();
                        } else {
                          // failure
                          Alert.alert(
                            'Failure',
                            'Failed to link spreadsheet. Please check if the URL is correct and if you shared it with dev@team114.org',
                          );
                          setLoadingSettingScoutSpreadsheetModal(false);
                        }*/
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <StandardButton
                      text="Cancel"
                      color={'red'}
                      onPress={() => {
                        setSettingScoutSpreadsheetModal(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}
          {loadingSettingScoutSpreadsheetModal && (
            <Modal animationType="slide" transparent={true} visible={true}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    width: '80%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 17,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {addSpreadsheetLoadingText}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}
      <AddCompetitionModal
        visible={addCompetitionModal}
        setVisible={setAddCompetitionModal}
        onRefresh={getCompetitions}
      />
      {chosenComp !== null && <ReportList forms={scoutData} />}
    </View>
  );
};

export default CompetitionsView;
