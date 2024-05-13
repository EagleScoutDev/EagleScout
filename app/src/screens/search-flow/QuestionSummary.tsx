import React, {useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {OpenAI} from '../../lib/OpenAI';
import {isTablet} from 'react-native-device-info';
import {
  getIdealTextColorFromRGB,
  getLighterColor,
} from '../../lib/ColorReadability';
import DataGraph from './DataGraph';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

interface Props {
  item: any;
  index: number;
  data: [
    {
      data: any;
      match: number;
    },
  ];
  generate_ai_summary: boolean;
  graph_disabled: boolean;
}

interface Statistics {
  average: number;
  max: number;
  min: number;
}

function QuestionSummary({
  item,
  index,
  data,
  generate_ai_summary,
  graph_disabled,
}: Props) {
  const {colors} = useTheme();

  // holds the response from the OpenAI API
  const [response, setResponse] = useState<String | null>('');

  // used for number-type questions
  const [stats, setStats] = useState<Statistics | null>(null);
  const [modalActive, setModalActive] = useState<boolean>(false);

  // for radio-type questions
  const [indexOfGreatestValue, setIndexOfGreatestValue] = useState<number>(0);

  // for checkbox-type questions
  const [frequencies, setFrequencies] = useState(new Map<string, number>());
  const [valueOfMostOccurrences, setValueOfMostOccurrences] =
    useState<number>(0);

  const [pieChartVisible, setPieChartVisible] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      // alignItems: 'center',
      justifyContent: 'space-between',

      padding: '4%',
      paddingVertical: '2%',
      marginHorizontal: '2%',
      // paddingHorizontal: '3%',
      // width: '40%',
      alignSelf: isTablet() ? 'center' : 'auto',
      // marginHorizontal: '2%',
      flexBasis: '33%',
      flexGrow: 1,
      borderRadius: 12,

      backgroundColor: colors.card,
      marginVertical: '2%',
    },
    question: {
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'left',
      // flex: 2,
      fontSize: 20,
    },
    statistic_container: {
      flexDirection: isTablet() ? 'row' : 'column-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: isTablet() ? 1 : 0,
      borderBottomColor: colors.border,
    },
    overall_statistic_container: {
      flexDirection: isTablet() ? 'column' : 'row',
      justifyContent: 'space-around',
    },
    statistic_label: {
      color: getLighterColor(colors.primary),
      fontWeight: 'bold',
    },
    statistic: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 25,
    },
    section_heading_container: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginHorizontal: '5%',
      marginTop: '10%',
      flexBasis: '100%',
    },
    section_heading: {
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'left',
      fontSize: 30,
    },
    section_description: {
      color: getLighterColor(colors.primary),
      fontWeight: 'bold',
    },
    multiple_option_container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: '2%',
    },
    multiple_option_option: {
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 2,
    },
    multiple_option_separator: {
      height: 1,
      width: '100%',
      backgroundColor: colors.border,
      marginVertical: '3%',
    },
    multiple_option_response_count: {
      color: getLighterColor(colors.primary),
      textAlign: 'center',
    },
    multiple_option_percentage_container: {
      flex: 1,
      borderCurve: 'continuous',
      borderRadius: 12,
    },
    multiple_option_percentage_text: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    ai_summary_container: {
      marginVertical: '2%',
      backgroundColor: colors.card,
      padding: '5%',
      borderRadius: 12,
      borderColor: colors.border,
    },
    ai_summary_header: {
      color: 'gray',
      fontWeight: 'bold',
    },
    ai_summary_text: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    comment_container: {
      marginVertical: '2%',
    },
    comment_match_number: {
      color: colors.text,
      fontWeight: 'bold',
    },
    comment_text: {
      color: 'gray',
    },
  });

  useEffect(() => {
    if (item.type === 'textbox' && generate_ai_summary) {
      let filteredData = data.filter(datum => datum.data !== '');
      let joinedData = filteredData.map(datum => datum.data).join('. ');
      OpenAI.getOpenAIResponse(item.question, joinedData).then(summary => {
        setResponse(summary);
      });
    }
  }, [generate_ai_summary]);

  useEffect(() => {
    if (item.type === 'number') {
      const avg =
        data.map(datum => datum.data).reduce((a, b) => a + b, 0) / data.length;
      const max = Math.max(...data.map(datum => datum.data));
      const min = Math.min(...data.map(datum => datum.data));
      setStats({average: avg, max: max, min: min});

      // sort data by match number
      data.sort((a, b) => {
        return a.match - b.match;
      });

      // TODO: remove duplicate data points (determined by match number)
    }

    if (item.type === 'radio') {
      let counts: number[] = [];
      for (let i = 0; i < item.options.length; i++) {
        counts.push(data.filter(datum => datum.data === i).length);
      }
      const index = counts.indexOf(Math.max(...counts));

      // if the largest value appears multiple times, set the index to -1
      if (counts.filter(count => count === counts[index]).length > 1) {
        setIndexOfGreatestValue(-1);
        return;
      }
      setIndexOfGreatestValue(index);
    }
    if (item.type === 'checkboxes') {
      const freq = new Map<string, number>(
        item.options.map((option: string) => [option, 0]),
      );
      for (const {data: matchData} of data) {
        for (const selected of matchData) {
          freq.set(selected, freq.get(selected)! + 1);
        }
      }
      setFrequencies(freq);
      const counts = Array.from(freq.values());
      const index = counts.indexOf(Math.max(...counts));

      // if the largest value appears multiple times, set the index to -1
      if (counts.filter(count => count === counts[index]).length > 1) {
        setValueOfMostOccurrences(-1);
        return;
      }
      setValueOfMostOccurrences(index);
    }
  }, []);

  if (item.type === 'heading') {
    return (
      <View key={item.key} style={styles.section_heading_container}>
        <Text style={styles.section_heading}>{item.title}</Text>
        <Text style={styles.section_description}>{item.description}</Text>
      </View>
    );
  }

  return (
    <View key={item.key} style={styles.container}>
      <Text style={styles.question}>{item.question}</Text>
      {item.type === 'radio' && (
        <Pressable
          onPress={() => {
            if (!graph_disabled) {
              setModalActive(true);
            }
          }}>
          {item.options.map((label: string, index_of_item: number) => {
            return (
              <View>
                <View
                  key={index_of_item}
                  style={styles.multiple_option_container}>
                  <Text style={styles.multiple_option_option}>{label}</Text>
                  <View
                    style={{
                      ...styles.multiple_option_percentage_container,
                      backgroundColor:
                        index_of_item === indexOfGreatestValue
                          ? colors.primary
                          : colors.card,
                      paddingVertical:
                        index_of_item === indexOfGreatestValue ? '2%' : 0,
                    }}>
                    <Text
                      style={{
                        ...styles.multiple_option_percentage_text,
                        color:
                          index_of_item === indexOfGreatestValue
                            ? getIdealTextColorFromRGB(colors.primary)
                            : colors.text,
                      }}>
                      {(
                        (data.filter(datum => datum.data === index_of_item)
                          .length /
                          data.length) *
                        100
                      ).toFixed(2)}
                      %
                    </Text>
                  </View>
                </View>
                <View style={styles.multiple_option_separator} />
              </View>
            );
          })}
          <Text style={styles.multiple_option_response_count}>
            {data.length} total responses
          </Text>
        </Pressable>
      )}
      {item.type === 'checkboxes' && (
        <View>
          {item.options.map((label: string, index: number) => {
            return (
              <View>
                <View key={index} style={styles.multiple_option_container}>
                  <Text style={styles.multiple_option_option}>{label}</Text>
                  <View
                    style={{
                      ...styles.multiple_option_percentage_container,
                      backgroundColor:
                        index === valueOfMostOccurrences
                          ? colors.primary
                          : colors.card,
                      paddingVertical:
                        index === valueOfMostOccurrences ? '2%' : 0,
                    }}>
                    <Text
                      style={{
                        ...styles.multiple_option_percentage_text,
                        color:
                          index === valueOfMostOccurrences
                            ? getIdealTextColorFromRGB(colors.primary)
                            : colors.text,
                      }}>
                      {((frequencies.get(label)! / data.length) * 100).toFixed(
                        2,
                      )}
                      %
                    </Text>
                  </View>
                </View>
                <View style={styles.multiple_option_separator} />
              </View>
            );
          })}
          <Text style={styles.multiple_option_response_count}>
            {data.length} total responses
          </Text>
        </View>
      )}
      {item.type === 'number' && (
        <Pressable
          style={styles.overall_statistic_container}
          onPress={() => {
            if (!graph_disabled) {
              setModalActive(true);
            }
          }}>
          <View style={styles.statistic_container}>
            <Text style={styles.statistic_label}>AVG</Text>
            <Text style={styles.statistic}>
              {stats ? stats.average.toFixed(2) : 'loading...'}
            </Text>
          </View>
          <View style={styles.statistic_container}>
            <Text style={styles.statistic_label}>MIN</Text>
            <Text style={styles.statistic}>
              {stats ? stats.min : 'loading...'}
            </Text>
          </View>
          <View style={styles.statistic_container}>
            <Text style={styles.statistic_label}>MAX</Text>
            <Text style={styles.statistic}>
              {stats ? stats.max : 'loading...'}
            </Text>
          </View>
        </Pressable>
      )}
      {response && (
        <View style={styles.ai_summary_container}>
          <Text style={styles.ai_summary_header}>AI SUMMARY</Text>
          <Text style={styles.ai_summary_text}>{response}</Text>
        </View>
      )}
      {item.type === 'textbox' && (
        <View>
          {data
            .map(datum => {
              if (datum.data === '') {
                return null;
              }
              return (
                <View style={styles.comment_container}>
                  <Text style={styles.comment_match_number}>
                    Match {datum.match}
                  </Text>
                  <Text style={styles.comment_text}>
                    {datum.data.replace(/(\r\n|\n|\r)/gm, '')}
                  </Text>
                </View>
              );
            })
            .reverse()}
        </View>
      )}

      <DataGraph
        item={item}
        modalActive={modalActive}
        setModalActive={setModalActive}
        data={data}
      />
    </View>
  );
}

export default QuestionSummary;
