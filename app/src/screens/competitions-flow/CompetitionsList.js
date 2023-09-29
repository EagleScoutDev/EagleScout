import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import NoInternet from '../../components/NoInternet';
import AddCompetitionModal from './AddCompetitionModal';
import DBManager from '../../DBManager';
//import InAppBrowser from 'react-native-inappbrowser-reborn';
//import {v4 as uuid} from 'uuid';
import {supabase} from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditCompetitionModal from '../../components/modals/EditCompetitionModal';
import CompetitionsDB from '../../database/Competitions';

const DEBUG = true;

const CompetitionsList = ({setChosenComp}) => {
  const {colors} = useTheme();
  const [internetError, setInternetError] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [addCompetitionModalVisible, setAddCompetitionModalVisible] =
    useState(false);
  const [editCompetitionModalVisible, setEditCompetitionModalVisible] =
    useState(false);

  const [competitionToEdit, setCompetitionToEdit] = useState(null);

  // checking if user has permission to edit competitions
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    checkAdmin().then(r => {
      if (DEBUG) {
        console.log('Admin: ' + admin);
      }
    });
    getCompetitions().then(r => {
      if (DEBUG) {
        console.log('Got competitions');
      }
    });
  }, [admin]);

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

    try {
      const data = await CompetitionsDB.getCompetitions();
      // sort the data by start time
      data.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
      });
      setCompetitionList(data);
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
        <ScrollView>
          {competitionList.map((comp, index) => (
            <TouchableOpacity
              key={comp.id}
              onPress={() => {
                if (editingMode) {
                  setCompetitionToEdit(comp);
                  setEditCompetitionModalVisible(true);
                } else {
                  setChosenComp(comp);
                }
                // DBManager.getReportsForCompetition(comp).then(r => {
                //   /*r[0].form.map(form => {
                //         console.log(form);
                //       });*/
                //
                //   console.log(JSON.stringify(r[0].form));
                // });
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
                {comp.name} ({new Date(comp.startTime).getFullYear()})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {admin && (
          <TouchableOpacity
            onPress={() => {
              if (DEBUG) {
                console.log('adding a new competition');
              }

              setAddCompetitionModalVisible(true);
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
      </View>
      <AddCompetitionModal
        visible={addCompetitionModalVisible}
        setVisible={setAddCompetitionModalVisible}
        onRefresh={getCompetitions}
      />
      {competitionToEdit !== null &&
        editingMode &&
        editCompetitionModalVisible && (
          <EditCompetitionModal
            setVisible={setEditCompetitionModalVisible}
            onRefresh={getCompetitions}
            tempComp={competitionToEdit}
          />
        )}
    </View>
  );
};

export default CompetitionsList;
