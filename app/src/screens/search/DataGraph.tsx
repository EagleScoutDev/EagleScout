import { Dimensions, Pressable, Text, View } from 'react-native';
import { StandardModal } from '../../components/modals/StandardModal';
import { LineChart } from 'react-native-chart-kit';
import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import type { Setter } from '../../lib/react-utils/types';

export interface DataGraphProps {
    modalActive: boolean, setModalActive: Setter<boolean>
    item: any
    data: { match: number, data: number }[]
}
export function DataGraph({
    item,
    modalActive,
    setModalActive,
    data,
}: DataGraphProps) {
    const { colors, dark } = useTheme();
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
            title={item.question}
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
                        fontWeight: 'bold',
                    }}>
                    Match Number
                </Text>
                {item.options && item.options.length > 0 && (
                    <>
                        <Text style={{ color: colors.text, textAlign: 'center' }}>
                            Graph Interpretation
                        </Text>
                        {item.options?.map((option: string, index: number) => {
                            return (
                                <Text style={{ color: colors.text, textAlign: 'center' }}>
                                    {index + ' - ' + item.options![index]}
                                </Text>
                            );
                        })}
                    </>
                )}
            </View>
            <Pressable
                style={{ marginTop: '4%' }}
                onPress={() => setModalActive(false)}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>Close</Text>
            </Pressable>
        </StandardModal>
    );
};
