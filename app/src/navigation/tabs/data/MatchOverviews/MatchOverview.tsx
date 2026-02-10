import React, {useEffect, useMemo, useState} from 'react';
import {SimpleTeam} from '../../lib/TBAUtils';
import {
    FlatList,
    Pressable, SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {useCurrentCompetitionMatches} from '../../../../lib/hooks/useCurrentCompetitionMatches';
import {CompetitionsDB} from '../../../../lib/database/Competitions';
import {useTheme} from '@react-navigation/native';
import {MatchReportsDB
} from '../../../../lib/database/ScoutMatchReports';
import AllianceSummaryCard from './AllianceSummaryCard';
import {type RootStackScreenProps, useRootNavigation} from "@/navigation";
import type {TeamSummaryProps} from "@/navigation/(recon)/TeamSummary";

export interface MatchOverviewParams{
    matchNumber: number;
    alliance: string;
}
export interface MatchOverviewProps extends RootStackScreenProps<"MatchOverview"> {

}

export function MatchOverview ({route: {
                                       params: {matchNumber, alliance},
                                   },
                                   navigation,
                               }: MatchOverviewProps) {
    const {colors} = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontSize: 18,
            color: colors.text,
            paddingTop: '3%',
            paddingLeft: '2%',
        },
        titleText: {
            textAlign: 'left',
            paddingTop: '5%',
            paddingBottom: '1%',
            paddingLeft: '2%',
            fontSize: 30,
            fontWeight: 'bold',
            color: colors.text,
            // marginVertical: 20,
        },
        button: {
            flex: 1,
            aspectRatio: '3/2',
            paddingTop: 17,
            paddingBottom: 17,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const {competitionId, matches} = useCurrentCompetitionMatches();
    const [formStructure, setFormStructure] = useState<Array<Object> | null>(
        null,
    );

    const [teamCleaned, setTeamCleaned] = useState<any[][]>([]);

    const teamsInMatch = useMemo(() => {
        const sus = matches
            .filter(match => match.compLevel === 'qm')
            .filter(match => match.match === matchNumber)
            .filter(match => match.alliance === alliance)
            .map(match => match.team.replace('frc', ''))
            .map(match => match.replace(/[A-Za-z]/g, ' '))
            .map(match => Number(match));
        return sus.map(
            sus =>
                ({
                    key: `frc${sus}`,
                    team_number: sus,
                    nickname: `Team ${sus}`,
                    name: `FRC Team ${sus}`,
                    city: 'Unknown',
                    state_prov: 'Unknown',
                    country: 'Unknown',
                } as SimpleTeam),
        );
    }, [matches, matchNumber]);

    useEffect(() => {
        if (competitionId === -1) {
            return;
        }
        (async () => {
            const competition = await CompetitionsDB.getCompetitionById(
                competitionId,
            );
            if (!competition) {
                return;
            }
            console.log('STARTING USE EFFECT');
            const allianceReports = await MatchReportsDB.getAllianceReports(
                teamsInMatch.map(team => team.team_number),
                competition.id,
            );
            setFormStructure(competition.form);
            if (!formStructure || !allianceReports) {
                return;
            }
            // console.log(allianceReports);
            // console.log(teamsInMatch);
            const data = allianceReports.map((teamData, sus) => {
                console.log('Getting data for team: ', teamsInMatch[sus].team_number);
                console.log(teamData.map(data => data.data));
                return formStructure.map((item, index) => {
                    if (item.title) {
                        console.log(item.title);
                    }
                    if (item.question) {
                        console.log(item.question);
                    }
                    if (item.type === 'number') {
                        const temp = [
                            Math.max(...teamData.map(datum => datum.data[index])),
                            teamData
                                .map(datum => datum.data[index])
                                .reduce((a, b) => a + b, 0) / teamData.length,
                            Math.min(...teamData.map(datum => datum.data[index])),
                        ];
                        console.log(temp);
                        return temp;
                    } else if (item.type === 'radio') {
                        let counts: number[] = [];
                        for (let i = 0; i < item.options.length; i++) {
                            counts.push(
                                (teamData.filter(datum => datum.data[index] === i).length *
                                    100) /
                                teamData.length,
                            );
                        }
                        return counts;
                    } else if (item.type === 'checkboxes') {
                        const freq = new Map<string, number>(
                            item.options.map((option: string) => [option, 0]),
                        );
                        for (const {data: matchData} of teamData) {
                            for (const selected of matchData[index]) {
                                freq.set(selected, freq.get(selected)! + 1);
                            }
                        }
                        const numbers = Array.from(freq.values());
                        console.log('amogi', freq);
                        console.log(numbers);

                        return numbers.map(number => (number * 100) / teamData.length);
                    } else {
                        return 'undef';
                    }
                });
            });
            setTeamCleaned(data);
            console.log('final: ', data);
            // console.log(formStructure.question);
            // console.log('temp', temp);
            // console.log(teamCleaned);
        })();
        // console.log(teamCleaned);
    }, [competitionId, teamsInMatch]);

    // for every THING in formstructure
    // get the average of each of the THINGS in the sub arrays
    // and put them into a new array of data STFUFF
    if (teamsInMatch.length === 0) {
        return (
            <View>
                <Text style={styles.titleText}>Not a valid match</Text>
                <Text style={styles.text}>This match doesn&#39;t have teams in it</Text>
            </View>
        );
    } else if (formStructure && teamCleaned.length > 0) {
        return (
            <ScrollView  style={{ paddingTop: 50 }}>
                <Text style={styles.titleText}> Match Overview {matchNumber}</Text>
                <View
                    style={{
                        flexDirection: 'column',
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: colors.card,
                        margin: 10,
                        padding: 15,
                        borderRadius: 10,
                        borderColor: colors.border,
                        borderWidth: 0.5,
                    }}>
                    <Text style={{fontSize: 17, color: colors.text, paddingVertical: 5}}>
                        Teams in match:
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 30,
                            justifyContent: 'center',
                            alignContent: 'center',
                            width: '100%',
                            marginTop: 5,
                        }}>
                        {teamsInMatch.map(team => (
                            <Pressable
                                key={team.key}
                                onPress={() => {
                                    // navigation.navigate('TeamViewer', {
                                    //     team: team,
                                    //     competitionId: competitionId,
                                    // });
                                }}>
                                <View
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor:
                                                alliance === 'red' ? '#e43737' : '#0b6fdf',
                                        },
                                    ]}>
                                    <Text style={{fontSize: 20, color: 'white'}}>
                                        {team.team_number}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View>
                    {formStructure.map((item, index) => {
                        return (
                            <AllianceSummaryCard
                                key={index}
                                form={item}
                                data={teamCleaned.map(teamData => {
                                    return teamData[index];
                                })}
                                teams={teamsInMatch.map(team => team.team_number)}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        );
    } else {
        return (
            <ScrollView style={{ paddingTop: 50 }}>
                <Text style={styles.titleText}> Match Overview {matchNumber} Loading...</Text>
                <View
                    style={{
                        flexDirection: 'column',
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: colors.card,
                        margin: 10,
                        padding: 15,
                        borderRadius: 10,
                        borderColor: colors.border,
                        borderWidth: 0.5,
                    }}>
                    <Text style={{fontSize: 17, color: colors.text, paddingVertical: 5}}>
                        Teams in match:
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 30,
                            justifyContent: 'center',
                            alignContent: 'center',
                            width: '100%',
                            marginTop: 5,
                        }}>
                        {teamsInMatch.map(team => (
                            <Pressable
                                key={team.key}
                                onPress={() => {
                                    navigation.navigate('TeamViewer', {
                                        team: team,
                                        competitionId: competitionId,
                                    });
                                }}>
                                <View
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor:
                                                alliance === 'red' ? '#e43737' : '#0b6fdf',
                                        },
                                    ]}>
                                    <Text style={{fontSize: 20, color: 'white'}}>
                                        {team.team_number}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        );
    }
    //tba stuff here -> get alliance, get teams
    //call supabase to get numbers
    //have buttons to navigate between teams.
};
export default MatchOverview;
