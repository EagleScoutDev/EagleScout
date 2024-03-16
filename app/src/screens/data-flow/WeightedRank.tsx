import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, {Path} from 'react-native-svg';
import ScoutReportsDB, {
  ScoutReportReturnData,
} from '../../database/ScoutReports';

interface WeightedRankProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  form: Object[] | undefined;
  compId: number;
}

enum WeightedRankStatus {
  CHOOSING_WEIGHTS,
  FETCHING_REPORTS,
  PROCESSING,
  PRESENTING_RANKINGS,
}

interface MapValue {
  sum: number;
  count: number;
}

function WeightedRank({form, visible, setVisible, compId}: WeightedRankProps) {
  const {colors} = useTheme();
  const [listOfWeights, setListOfWeights] = React.useState<number[]>([]);
  const [originalWeights, setOriginalWeights] = React.useState<number[]>([]);

  const [status, setStatus] = React.useState<WeightedRankStatus>(
    WeightedRankStatus.CHOOSING_WEIGHTS,
  );

  const [numberQuestions, setNumberQuestions] = React.useState<Object[]>([]);

  const [allReports, setAllReports] = React.useState<ScoutReportReturnData[]>(
    [],
  );

  const [teamMap, setTeamMap] = React.useState<Map<number, MapValue>>(
    new Map(),
  );

  const [teamMapSortable, setTeamMapSortable] = React.useState<
    Map<number, number>
  >(new Map());

  useEffect(() => {
    console.log('form: ' + form);
    if (form) {
      let temp: Object[] = [];
      for (let i = 0; i < form?.length; i++) {
        if (form[i].type === 'number') {
          temp.push(form[i]);
        }
      }
      setNumberQuestions(temp);
    }
  }, [form]);

  useEffect(() => {
    if (numberQuestions.length > 0 && form) {
      let temp: number[] = [];
      for (let i = 0; i < form.length; i++) {
        temp.push(0);
      }
      setListOfWeights(temp);
      setOriginalWeights(temp);
    }
  }, [numberQuestions]);

  const generateRankings = () => {
    setStatus(WeightedRankStatus.FETCHING_REPORTS);
    fetchAllReports();
    console.log('num scout reports: ' + allReports.length);
    // let weights_total = listOfWeights.reduce((a, b) => a + b, 0);
    // console.log('total weights: ' + weights_total);
  };

  const processData = () => {
    setStatus(WeightedRankStatus.PROCESSING);
    let temp_map = new Map<number, MapValue>();
    for (let i = 0; i < allReports.length; i++) {
      let report = allReports[i];
      let sum = 0;
      let count = 1;
      for (let j = 0; j < numberQuestions.length; j++) {
        sum += report.data[j] * listOfWeights[j];
      }
      if (temp_map.has(report.teamNumber)) {
        let temp = temp_map.get(report.teamNumber);
        if (temp) {
          temp.sum += sum;
          temp.count += count;
          temp_map.set(report.teamNumber, temp);
        }
      } else {
        temp_map.set(report.teamNumber, {sum: sum, count: count});
      }
    }
    // nicely print out the map
    temp_map.forEach((value, key) => {
      console.log('team ' + key + ' : ' + value.sum / value.count);
    });
    setTeamMap(temp_map);
    setStatus(WeightedRankStatus.PRESENTING_RANKINGS);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (allReports.length > 0) {
      processData();
    }
  }, [allReports]);

  const fetchAllReports = () => {
    if (compId === -1) {
      return;
    }

    setStatus(WeightedRankStatus.FETCHING_REPORTS);
    ScoutReportsDB.getReportsForCompetition(compId).then(reports => {
      setAllReports(reports);
    });
  };

  const styles = StyleSheet.create({
    header: {
      color: colors.text,
      fontSize: 20,
    },
    container: {
      backgroundColor: colors.card,
      paddingHorizontal: '10%',
      flex: 1,
    },
    list_item: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: '5%',
      flexDirection: 'row',
    },
    list_text: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
      textAlign: 'right',
    },
    question_text: {
      color: colors.text,
      // fontWeight: 'bold',
      fontSize: 16,
    },
    rank_list_item: {
      // backgroundColor: colors.card,
      color: 'red',
      flexDirection: 'row',
      // borderBottomWidth: 1,
      // borderColor: colors.border,
      padding: '5%',
      paddingVertical: '2%',
    },
  });

  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      presentationStyle={'formSheet'}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {status === WeightedRankStatus.PRESENTING_RANKINGS && (
            <Pressable
              onPress={() => {
                setListOfWeights(originalWeights);
                setStatus(WeightedRankStatus.CHOOSING_WEIGHTS);
              }}>
              <Text style={{color: 'gray', fontSize: 14, textAlign: 'left'}}>
                Reset
              </Text>
            </Pressable>
          )}

          {originalWeights !== listOfWeights &&
            status !== WeightedRankStatus.PRESENTING_RANKINGS && (
              <Pressable
                onPress={() => {
                  setListOfWeights(originalWeights);
                }}>
                <Text style={{color: 'gray', fontSize: 14, textAlign: 'left'}}>
                  Reset
                </Text>
              </Pressable>
            )}
          <Pressable
            onPress={() => {
              setVisible(false);
            }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
                textAlign: 'right',
                padding: '5%',
                fontWeight: 'bold',
              }}>
              Close
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            // marginTop: '5%',
          }}>
          Weighted Rank
        </Text>
        {/*<Text style={{color: colors.text, fontSize: 14}}>*/}
        {/*  {listOfWeights.toString()}*/}
        {/*</Text>*/}
        {status === WeightedRankStatus.PRESENTING_RANKINGS && (
          <ScrollView>
            {Array.from(teamMap)
              .sort((a, b) => a[1].sum / a[1].count - b[1].sum / b[1].count)
              .reverse()
              .map((team, index) => {
                return (
                  <View style={styles.list_item} key={index}>
                    <Text
                      style={{
                        color: 'gray',
                        fontSize: 16,
                        flex: 0.3,
                        fontWeight: 'bold',
                      }}>
                      {index + 1}
                    </Text>
                    <Text style={{color: colors.text, fontSize: 16, flex: 1}}>
                      {team[0]}
                    </Text>
                    <Text style={{color: colors.text, fontSize: 16, width: 50}}>
                      {parseFloat((team[1].sum / team[1].count).toFixed(2))}
                    </Text>
                  </View>
                );
              })}
          </ScrollView>
        )}
        {status === WeightedRankStatus.PROCESSING && (
          <Text style={{color: colors.text, fontSize: 20, textAlign: 'center'}}>
            Processing...
          </Text>
        )}
        {status === WeightedRankStatus.CHOOSING_WEIGHTS && (
          <>
            <ScrollView>
              {form &&
                form.map((question, index) => {
                  if (question.type === 'number') {
                    return (
                      <View
                        style={{
                          // borderBottomWidth: 1,
                          // borderColor: 'gray',
                          paddingBottom: '4%',
                          paddingTop: '4%',
                        }}
                        key={index}>
                        <Pressable
                          onPress={() => {
                            let temp = [...listOfWeights]; // Create a new array by spreading the old one
                            temp[index] = 0;
                            setListOfWeights(temp);
                          }}>
                          <Text
                            style={{
                              color:
                                listOfWeights[index] === 0
                                  ? 'gray'
                                  : colors.text,
                              fontSize: 16,
                              // fontWeight: 'bold',
                              // textAlign: 'center',
                            }}>
                            {question.question}
                          </Text>
                        </Pressable>
                        {/*<Text>{listOfWeights[index]}</Text>*/}
                        <Slider
                          style={{width: '100%', height: 40}}
                          minimumValue={-1}
                          maximumValue={1}
                          // start the track at the middle
                          // set track color to red if negative, blue if positive
                          minimumTrackTintColor={
                            listOfWeights[index] === 0
                              ? 'dimgray'
                              : listOfWeights[index] > 0
                              ? colors.primary
                              : 'red'
                          }
                          tapToSeek={true}
                          value={listOfWeights[index]}
                          onValueChange={value => {
                            let temp = [...listOfWeights]; // Create a new array by spreading the old one
                            temp[index] = value;
                            setListOfWeights(temp);
                          }}
                        />
                        {listOfWeights.length > 0 && (
                          <View>
                            <Text
                              style={{color: colors.text, textAlign: 'center'}}>
                              {listOfWeights[index].toFixed(2)}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  }
                })}
            </ScrollView>

            {listOfWeights !== originalWeights && (
              <Pressable
                onPress={() => generateRankings()}
                style={{
                  marginVertical: '10%',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  backgroundColor: '#bf1cff',
                  marginHorizontal: '5%',
                  padding: '5%',
                  borderRadius: 12,
                }}>
                <Svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16">
                  <Path
                    fill="white"
                    style={{alignSelf: 'center'}}
                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5m0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z"
                  />
                </Svg>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Generate Rankings
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

export default WeightedRank;
