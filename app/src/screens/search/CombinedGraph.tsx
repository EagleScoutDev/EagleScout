import { Dimensions, Pressable, Text, View } from 'react-native';
import { StandardModal } from '../../components/modals/StandardModal';
import { LineChart } from 'react-native-chart-kit';
import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import {
    MatchReportsDB,
    type MatchReportReturnData,
} from '../../database/ScoutMatchReports';
import { FormsDB, type FormReturnData } from '../../database/Forms';
import { CompetitionsDB } from '../../database/Competitions';
import type { Setter } from '../../lib/react-utils/types';

export interface CombinedGraphProps {
    modalActive: boolean, setModalActive: Setter<boolean>
    team_number: number
    competitionId: number
    questionIndices: number[]
}
export function CombinedGraph({
    team_number,
    competitionId,
    modalActive,
    setModalActive,
    questionIndices,
}: CombinedGraphProps) {
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
    const [relevantReports, setRelevantReports] = React.useState<
        MatchReportReturnData[]
    >([]);
    const [form, setForm] = React.useState<FormReturnData>();
    const [questionToColor, setQuestionToColor] = React.useState<
        Map<string, string>
    >(new Map());

    useEffect(() => {
        if (modalActive) {
            MatchReportsDB.getReportsForTeamAtCompetition(
                team_number,
                competitionId,
            ).then(reports => {
                setRelevantReports(reports);
                CompetitionsDB.getCompetitionById(competitionId).then(comp => {
                    FormsDB.getForm(comp.formId).then(form => {
                        setForm(form);
                    });
                });
            });
        }
    }, [team_number, competitionId, modalActive]);

    useEffect(() => {
        if (form !== undefined) {
            const newMap = new Map<string, string>();
            questionIndices.forEach(index => {
                newMap.set(
                    form.formStructure[index].question,
                    `rgba(${(index * 100) % 255}, ${(index * 50) % 255}, ${(index * 25) % 255
                    }, 1.0)`,
                );
            });
            setQuestionToColor(newMap);
        }
    }, [questionIndices, form]);

    return (
        <StandardModal
            title={'Team ' + team_number.toString(10) + ' Performance'}
            visible={modalActive}
            onDismiss={() => {
                setModalActive(false);
            }}>
            <View>
                {relevantReports.length > 0 && form !== undefined && (
                    <>
                        <View
                            style={{
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}>
                            {Array.from(questionToColor.keys()).map((question, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginVertical: '2%',
                                    }}>
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: questionToColor.get(question),
                                            marginRight: '2%',
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}>
                                        {question}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <LineChart
                            data={{
                                labels: relevantReports.map(report =>
                                    report.matchNumber.toString(10),
                                ),
                                datasets: questionIndices.map(index => {
                                    return {
                                        data: relevantReports
                                            .sort((a, b) => a.matchNumber - b.matchNumber)
                                            .map(report => report.data[index]),
                                        color: (opacity = 1.0) =>
                                            questionToColor.get(
                                                form!.formStructure[index].question,
                                            ) ?? 'rgba(0, 0, 0, 1.0)',
                                        strokeWidth: 4, // optional
                                    };
                                }),
                            }}
                            width={Dimensions.get('window').width * 0.85} // from react-native
                            height={Dimensions.get('window').height / 4}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </>
                )}
                <Text
                    style={{
                        color: colors.text,
                        textAlign: 'center',

                        fontWeight: 'bold',
                    }}>
                    Match Number
                </Text>
            </View>
            <Pressable
                style={{ marginTop: '4%' }}
                onPress={() => setModalActive(false)}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>Close</Text>
            </Pressable>
        </StandardModal>
    );
};
