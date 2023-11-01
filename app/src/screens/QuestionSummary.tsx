import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {ScoutReportReturnData} from '../database/ScoutReports';
import RadioButtons from '../components/form/RadioButtons';
import {useState} from 'react';
import {OpenAI} from '../lib/OpenAI';

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
}

interface Statistics {
  average: number;
  max: number;
  min: number;
}

function QuestionSummary({item, index, data, generate_ai_summary}: Props) {
  const {colors} = useTheme();
  const [response, setResponse] = useState<String | null>('');
  const [stats, setStats] = useState<Statistics | null>(null);

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
    }
  }, []);

  if (item.type === 'heading') {
    return (
      <View
        key={item.key}
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginHorizontal: '5%',
        }}>
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize: 30,
          }}>
          {item.text}
        </Text>
        <Text>{item.description}</Text>
      </View>
    );
  }

  return (
    <View
      key={item.key}
      style={{
        flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'space-between',

        padding: '5%',
        paddingHorizontal: '3%',
        maxWidth: '90%',
        alignSelf: 'center',
        minWidth: '90%',

        borderRadius: 12,

        backgroundColor: colors.card,
        marginVertical: '2%',
      }}>
      <Text
        style={{
          color: 'red',
          fontWeight: 'bold',
          textAlign: 'left',
          // flex: 2,
          fontSize: 20,
        }}>
        {item.question}
      </Text>
      <Text
        style={{
          color: 'blue',
          fontWeight: 'bold',
          textAlign: 'center',
          // flex: 1,
        }}>
        {item.type}
        {/*Rank {item.rank}*/}
      </Text>
      {item.type === 'radio' && (
        <View>
          {item.labels.map((label: string, index: number) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: '2%',
                  backgroundColor: colors.border,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    flex: 2,
                  }}>
                  {label}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flex: 1,
                  }}>
                  {data.filter(datum => datum.data === index).length}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Text style={{color: 'green'}}>
        raw data - {data.map(datum => datum.data + ', ')}
      </Text>
      {item.type == 'number' && (
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{color: colors.text, fontWeight: 'bold', fontSize: 25}}>
              {stats ? stats.average.toFixed(2) : 'loading...'}
            </Text>
            <Text style={{color: 'gray', fontWeight: 'bold'}}>AVERAGE</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{color: colors.text, fontWeight: 'bold', fontSize: 25}}>
              {stats ? stats.min : 'loading...'}
            </Text>
            <Text style={{color: 'gray', fontWeight: 'bold'}}>MINIMUM</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{color: colors.text, fontWeight: 'bold', fontSize: 25}}>
              {stats ? stats.max : 'loading...'}
            </Text>
            <Text style={{color: 'gray', fontWeight: 'bold'}}>MAXIMUM</Text>
          </View>
        </View>
      )}
      <Text style={{color: 'blue'}}>{response}</Text>
    </View>
  );
}

export default QuestionSummary;
