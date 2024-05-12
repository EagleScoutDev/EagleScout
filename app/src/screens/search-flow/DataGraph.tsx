import {Dimensions, Pressable, Text, View} from 'react-native';
import StandardModal from '../../components/modals/StandardModal';
import {LineChart} from 'react-native-chart-kit';
import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';

const DataGraph = ({
  question,
  modalActive,
  setModalActive,
  data,
}: {
  question: string;
  modalActive: boolean;
  setModalActive: (arg0: boolean) => void;
  data: {match: number; data: number}[];
}) => {
  const {colors, dark} = useTheme();
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientFromOpacity: 1.0,
    backgroundGradientTo: colors.card,
    backgroundGradientToOpacity: 1.0,
    color: (opacity = 1) =>
      dark ? `rgba(255, 255, 255, ${opacity})` : 'rgba(0, 0, 0, 1)',
    backgroundColor: colors.card,
    strokeWidth: 2, // optional, default 3
    // barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: colors.card,
  };
  const [avg, setAvg] = React.useState<number>(0);

  useEffect(() => {
    let sum = 0;
    data.forEach(datum => {
      sum += datum.data;
    });
    setAvg(sum / data.length);
  }, []);

  return (
    <StandardModal
      title={question}
      visible={modalActive}
      onDismiss={() => {
        setModalActive(false);
      }}>
      <View>
        <LineChart
          data={{
            labels: data
              .sort((a, b) => a.match - b.match)
              .map(datum => String(datum.match)),
            datasets: [
              {
                data: data
                  .sort((a, b) => a.match - b.match)
                  .map(datum => datum.data),
                color: (opacity = 1) => colors.primary,
                strokeWidth: 2, // optional
              },
              {
                data: data.map(() => avg),
                strokeDashArray: [10],
                withDots: false,
                color: (opacity = 1) => colors.text,
                strokeWidth: 2, // optional
              },
            ],
            legend: ['Data', 'Average'], // optional
          }}
          width={Dimensions.get('window').width * 0.85} // from react-native
          height={Dimensions.get('window').height / 4}
          // verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />
        <Text
          style={{
            color: colors.text,
            textAlign: 'center',
            marginVertical: '3%',
          }}>
          Match Number
        </Text>
      </View>
      <Pressable
        style={{marginTop: '4%'}}
        onPress={() => setModalActive(false)}>
        <Text style={{color: colors.primary, fontSize: 16}}>Close</Text>
      </Pressable>
    </StandardModal>
  );
};

export default DataGraph;
