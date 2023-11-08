import React, {useEffect, useState} from 'react';
import EnableScoutAssignmentsModal from '../../components/modals/EnableScoutAssignmentsModal';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import CompetitionsDB from '../../database/Competitions';
import NoInternet from '../../components/NoInternet';
import {SectionGrid} from 'react-native-super-grid';
import {StyleSheet} from 'react-native';
import ScoutAssignmentsSpreadsheet from "./ScoutAssignmentsSpreadsheet";

function ScoutAssignments() {
  const [chosenComp, setChosenComp] = useState(null);
  const [enableScoutAssignmentsVisible, setEnableScoutAssignmentsVisible] =
    useState(false);
  const {colors} = useTheme();
  const [internetError, setInternetError] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [scoutAssignmentsVisible, setScoutAssignmentsVisible] = useState(false);

  const getCompetitions = async () => {
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
    getCompetitions().catch(console.error);
  }, []);

  if (internetError) {
    return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
  }

  return (
    <>
      {!scoutAssignmentsVisible ? (
        <>
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
                      setChosenComp(comp);
                      console.log(comp);
                      if (!comp.scoutAssignmentsEnabled) {
                        setEnableScoutAssignmentsVisible(true);
                      } else {
                        setScoutAssignmentsVisible(true);
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
                        color: colors.text,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: 16,
                      }}>
                      {comp.name} ({new Date(comp.startTime).getFullYear()})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <EnableScoutAssignmentsModal
            visible={enableScoutAssignmentsVisible}
            setVisible={setEnableScoutAssignmentsVisible}
            competition={chosenComp}
            onRefresh={() => getCompetitions().catch(console.error)}
            resetCompID={() => setChosenComp(null)}
          />
        </>
      ) : (
        <ScoutAssignmentsSpreadsheet competition={chosenComp} />
      )}
    </>
  );
}

export default ScoutAssignments;
