import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import CompetitionsDB from '../../database/Competitions';
import ScoutReportsDB from '../../database/ScoutMatchReports';
import { useTheme } from '@react-navigation/native';
import { type CrescendoAutoPath } from '../../components/games/crescendo/CrescendoAutoPath';
import { CrescendoAutoViewer } from '../../components/games/crescendo/CrescendoAutoViewer';
import { type ReefscapeAutoPath } from '../../components/games/reefscape/ReefscapeAutoPath';
import { ReefscapeViewer } from '../../components/games/reefscape/ReefscapeViewer';

export const AutoPathsForTeam = ({ route }) => {
    const { team_number, competitionId } = route.params;
    const { colors } = useTheme();
    const [autoPaths, setAutoPaths] = useState<
        CrescendoAutoPath[] | ReefscapeAutoPath[] | undefined
    >();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then(async competition => {
            if (!competition) {
                return;
            }
            console.log('start');
            console.log(competition.startTime.toString());
            setYear(parseInt(competition.startTime.toString().split('-')[0]));
            console.log(year);
            const reports = await ScoutReportsDB.getReportsForTeamAtCompetition(
                team_number,
                competition.id,
            );
            console.log('in callback');
            console.log(reports);
            setAutoPaths(
                reports.map(report => report.autoPath).filter(autoPath => autoPath) as
                | ReefscapeAutoPath[]
                | CrescendoAutoPath[],
            );
            console.log(autoPaths);
            console.log('it should be here');
        });
        console.log('end');
    }, [team_number]);

    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    fontWeight: 'bold',
                    fontSize: 25,
                    paddingLeft: '5%',
                    color: colors.text,
                }}>
                Auto Paths for Team {team_number}
            </Text>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                }}>
                <Text style={{ color: colors.text }}>
                    {autoPaths ? `Path ${currentIndex + 1} of ${autoPaths.length}` : ''}
                </Text>
                {autoPaths ? (
                    year === 2025 ? (
                        <ReefscapeViewer
                            autoPath={autoPaths[currentIndex] as ReefscapeAutoPath}
                        />
                    ) : (
                        <CrescendoAutoViewer
                            autoPath={autoPaths[currentIndex] as CrescendoAutoPath}
                        />
                    )
                ) : (
                    <Text style={{ color: colors.text, fontSize: 25 }}>
                        No auto paths found
                    </Text>
                )}
                {autoPaths ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            width: '100%',
                            marginTop: 10,
                            gap: 10,
                        }}>
                        <Pressable
                            style={{
                                backgroundColor: colors.card,
                                padding: 10,
                                borderRadius: 10,
                            }}
                            onPress={() => {
                                if (currentIndex > 0) {
                                    setCurrentIndex(currentIndex - 1);
                                }
                            }}>
                            <Text style={{ color: colors.text }}>Previous</Text>
                        </Pressable>
                        <Pressable
                            style={{
                                backgroundColor: colors.card,
                                padding: 10,
                                borderRadius: 10,
                            }}
                            onPress={() => {
                                if (currentIndex < autoPaths.length - 1) {
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }}>
                            <Text style={{ color: colors.text }}>Next</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Text style={{ color: colors.text, fontSize: 20 }}>:(</Text>
                )}
            </View>
        </View>
    );
};
