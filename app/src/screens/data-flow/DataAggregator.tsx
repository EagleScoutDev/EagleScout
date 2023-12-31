import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import CompetitionsDB, {
  CompetitionReturnData,
} from '../../database/Competitions';
import ScoutReportsDB from '../../database/ScoutReports';
import StandardButton from '../../components/StandardButton';

interface Question {
  question: string;
  index: number;
}

function DataAggregation({navigation}) {
  const {colors} = useTheme();

  const [currForm, setCurrForm] = useState<Array<Object>>();
  const [compID, setCompID] = useState<number>();

  const [chosenQuestion, setChosenQuestion] = useState<Question | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);

  const [teamsToAverage, setTeamsToAverage] = useState<Map<
    number,
    number
  > | null>(null);

  const [compName, setCompName] = useState<string>();

  const [noActiveCompetition, setNoActiveCompetition] =
    useState<boolean>(false);
  // const navigation = useNavigation();

  const [fullCompetitionsList, setFullCompetitionsList] = useState<
    CompetitionReturnData[]
  >([]);

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(competition => {
      if (!competition) {
        setNoActiveCompetition(true);
        CompetitionsDB.getCompetitions().then(c => {
          setFullCompetitionsList(c);
        });
        return;
      }

      setCurrForm(competition.form);
      setCompID(competition.id);
      setCompName(competition.name);
    });
  }, []);

  const onPress = (index: number, question: string) => {
    setChosenQuestion({
      index: index,
      question: question,
    });
    setProcessing(true);
    beginAggregation(index);
  };

  const beginAggregation = (index: number) => {
    let temp: Map<number, number[]>;
    temp = new Map<number, number[]>();

    let averaged_values: Map<number, number>;
    averaged_values = new Map<number, number>();

    console.log(chosenQuestion);
    ScoutReportsDB.getReportsForCompetition(compID!).then(reports => {
      for (let i = 0; i < reports.length; i++) {
        const relevant_field = reports[i].data[index];
        const team_num = reports[i].teamNumber;
        console.log('relevant field: ' + relevant_field);

        let curr_values = temp.get(team_num) ?? [];
        curr_values.push(relevant_field);
        temp.set(team_num, curr_values);
      }

      temp.forEach((value, key) => {
        console.log(key, value);
        let sum: number = 0;
        value.forEach(v => {
          sum += v;
        });
        averaged_values.set(key, sum / value.length);
      });

      // now average, the values, and save that
      averaged_values.forEach((value, key) => {
        console.log(key, value);
      });

      const sorted = new Map([...averaged_values.entries()].sort().reverse());
      sorted.forEach((value, key) => {
        console.log(key, value);
      });
      setTeamsToAverage(sorted);
      setProcessing(false);
    });
  };

  const styles = StyleSheet.create({
    header: {
      color: colors.text,
      fontSize: 20,
    },
    container: {
      backgroundColor: colors.card,
      margin: '10%',
      padding: '10%',
      borderRadius: 20,
      maxHeight: '80%',
    },
    list_item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: '5%',
    },
    list_text: {
      color: colors.text,
      fontSize: 14,
    },
    question_text: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 20,
    },
    rank_list_item: {
      backgroundColor: colors.card,
      color: 'red',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: colors.border,
      padding: '5%',
    },
  });

  if (noActiveCompetition) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No Active Competition</Text>
        <Text style={{color: colors.text, fontSize: 14}}>
          Please choose which competition you would like to view data for.
        </Text>
        {fullCompetitionsList.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setNoActiveCompetition(false);
              setCurrForm(item.form);
              setCompID(item.id);
              setCompName(item.name);
            }}>
            <View style={styles.list_item}>
              <Text style={styles.list_text}>{item.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View>
      {chosenQuestion !== null && (
        <View>
          <Pressable
            onPress={() => {
              setChosenQuestion(null);
              setTeamsToAverage(null);
            }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 18,
                paddingTop: '5%',
                paddingLeft: '5%',
              }}>
              Back
            </Text>
          </Pressable>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              marginVertical: '5%',
              color: colors.text,
            }}>
            {compName} / {chosenQuestion && chosenQuestion.question}
          </Text>
          <Pressable
            onPress={() => {
              if (teamsToAverage) {
                // change sort
                const sorted = new Map([...teamsToAverage.entries()].reverse());
                setTeamsToAverage(sorted);
              }
            }}
            style={({pressed}) => ({
              backgroundColor: colors.card,
              padding: '3%',
              marginHorizontal: '20%',
              borderRadius: 10,
              opacity: pressed ? 0.5 : 1,
            })}>
            <Text style={{color: colors.text, textAlign: 'center'}}>
              Change Sort
            </Text>
          </Pressable>
        </View>
      )}
      {chosenQuestion === null && (
        <View style={styles.container}>
          <Text style={styles.question_text}>
            Choose a Question to rank teams
          </Text>
          <ScrollView>
            {currForm &&
              currForm.map((item, index) => (
                <Pressable onPress={() => onPress(index, item.question)}>
                  {item.type === 'number' && (
                    <View style={styles.list_item}>
                      <Text style={styles.list_text}>
                        {index}) {item.question}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
          </ScrollView>
        </View>
      )}
      {processing && (
        <View style={styles.container}>
          <Text style={styles.question_text}>Processing...</Text>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      {teamsToAverage && (
        <View>
          <ScrollView
            style={{
              backgroundColor: colors.card,
              margin: '10%',
              padding: '10%',
              borderRadius: 20,
              maxHeight: '80%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1, color: colors.text, fontSize: 20}}>
                Team
              </Text>
              <Text style={{color: colors.text, fontSize: 20}}>Value</Text>
            </View>
            {teamsToAverage &&
              Array.from(teamsToAverage, ([key, value]) => (
                <View key={key} style={styles.rank_list_item}>
                  <Text
                    style={{
                      flex: 1,
                      color: colors.text,
                    }}>
                    {key}
                  </Text>
                  <Text style={styles.list_text}>{value}</Text>
                </View>
              ))}
          </ScrollView>
          <View
            style={{
              marginHorizontal: '10%',
              marginVertical: '5%',
            }}>
            <StandardButton
              text={'Send to Picklist'}
              color={'blue'}
              isLoading={false}
              onPress={() => {
                navigation.navigate('Picklists', {
                  screen: 'Picklist Creator',
                  params: {
                    picklist_id: -1,
                    given_teams: Array.from(teamsToAverage.keys()),
                  },
                });
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default DataAggregation;