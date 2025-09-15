import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Path, Svg } from 'react-native-svg';
import CompetitionsDB, { ScoutAssignmentsConfig } from '../database/Competitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormHelper from '../FormHelper';
import ScoutAssignments from '../database/ScoutAssignments';

const UpcomingRoundsView = ({ navigation }) => {
    const [upcomingRounds, setUpcomingRounds] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { colors } = useTheme();
    const [isCompetitionHappening, setIsCompetitionHappening] = useState(false);
    const [teamBased, setTeamBased] = useState(false);

    const getPositionText = position => {
        if (position === 0) {
            return 'R1';
        } else if (position === 1) {
            return 'R2';
        } else if (position === 2) {
            return 'R3';
        } else if (position === 3) {
            return 'B1';
        } else if (position === 4) {
            return 'B2';
        } else if (position === 5) {
            return 'B3';
        }
    };

    const getUpcomingRounds = async () => {
        setRefreshing(true);
        let dbRequestWorked;
        let dbCompetition;
        try {
            dbCompetition = await CompetitionsDB.getCurrentCompetition();
            dbRequestWorked = true;
        } catch (e) {
            dbRequestWorked = false;
        }

        let comp;
        if (dbRequestWorked) {
            if (dbCompetition != null) {
                comp = dbCompetition;
                await AsyncStorage.setItem(
                    FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
                    JSON.stringify(dbCompetition),
                );
            } else {
                await AsyncStorage.removeItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
                await AsyncStorage.removeItem('scout-assignments');
            }
        } else {
            const storedComp = await FormHelper.readAsyncStorage(
                FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
            );
            if (storedComp != null) {
                comp = JSON.parse(storedComp);
            }
        }

        let scoutAssignments = null;
        if (comp != null) {
            setIsCompetitionHappening(true);
            if (dbRequestWorked) {
                if (comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.TEAM_BASED) {
                    setTeamBased(true);
                    scoutAssignments =
                        await ScoutAssignments.getScoutAssignmentsForCompetitionTeamBasedCurrentUser(
                            comp.id,
                        );
                } else if (
                    comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.POSITION_BASED
                ) {
                    setTeamBased(false);
                    scoutAssignments =
                        await ScoutAssignments.getScoutAssignmentsForCompetitionPositionBasedCurrentUser(
                            comp.id,
                        );
                } else {
                    scoutAssignments = [];
                }
                await AsyncStorage.setItem(
                    'scout-assignments',
                    JSON.stringify(scoutAssignments),
                );
            } else {
                const scoutAssignmentsOffline = await AsyncStorage.getItem(
                    'scout-assignments',
                );
                if (scoutAssignmentsOffline != null) {
                    scoutAssignments = JSON.parse(scoutAssignmentsOffline);
                }
            }
        } else {
            setIsCompetitionHappening(false);
        }
        if (scoutAssignments != null) {
            scoutAssignments.sort((a, b) => {
                return a.matchNumber - b.matchNumber;
            });
        }
        setUpcomingRounds(scoutAssignments);
        setRefreshing(false);
    };

    const teamFormatter = team => {
        if (team.substring(0, 3) === 'frc') {
            return team.substring(3);
        } else {
            return team;
        }
    };

    useEffect(() => {
        (async () => {
            await getUpcomingRounds();
        })();
        return navigation.addListener('focus', async () => {
            await getUpcomingRounds();
        });
    }, [navigation]);

    return (
        <>
            {isCompetitionHappening ? (
                <>
                    {upcomingRounds ? (
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    height: '100%',
                                    borderRadius: 10,
                                    padding: '8%',
                                    width: '100%',
                                }}>
                                {upcomingRounds.length !== 0 && (
                                    <Text style={{ color: colors.text, paddingBottom: '5%' }}>
                                        You have {upcomingRounds.length} round
                                        {upcomingRounds.length !== 1 ? 's' : ''} left today.
                                    </Text>
                                )}
                                {upcomingRounds.length === 0 && (
                                    <View
                                        style={{
                                            backgroundColor: colors.card,
                                            alignItems: 'center',
                                            padding: '5%',
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                            justifyContent: 'space-around',
                                        }}>
                                        <Svg
                                            width={'100%'}
                                            height="50%"
                                            viewBox="0 0 16 16"
                                            style={{ marginVertical: '10%' }}>
                                            <Path
                                                fill={colors.primary}
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                            />
                                            <Path
                                                fill={colors.primary}
                                                d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
                                            />
                                        </Svg>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 24,
                                                padding: '5%',
                                                textAlign: 'center',
                                                flex: 1,
                                            }}>
                                            You have no rounds left to scout today.
                                        </Text>
                                    </View>
                                )}
                                <ScrollView
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={getUpcomingRounds}
                                        />
                                    }>
                                    {upcomingRounds.map((round, index) => (
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.card,
                                                padding: 10,
                                                borderRadius: 10,
                                                marginBottom: 10,
                                                borderWidth: 1,
                                                borderColor: colors.border,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                flex: 1,
                                            }}
                                            onPress={() => {
                                                //console.log('hey');
                                                navigation.navigate('Scout Report', {
                                                    match: round.matchNumber,
                                                    team: teamBased ? teamFormatter(round.team) : null,
                                                });
                                            }}>
                                            <View
                                                style={{
                                                    // backgroundColor: 'red',
                                                    padding: '2%',
                                                    paddingTop: '0%',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 16,
                                                        color: colors.text,
                                                        // padding: '2%',
                                                    }}>
                                                    Match: {round.matchNumber}
                                                </Text>
                                                <View style={{ height: '20%' }} />
                                                {teamBased ? (
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: 16,
                                                            color: colors.text,
                                                            // padding: '2%',
                                                        }}>
                                                        Team: {teamFormatter(round.team)}
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: 16,
                                                            color: colors.text,
                                                            // padding: '2%',
                                                        }}>
                                                        Position: {getPositionText(round.position)}
                                                    </Text>
                                                )}
                                            </View>
                                            <View>
                                                <Svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 24 24"
                                                    stroke="gray"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    style={{
                                                        position: 'absolute',
                                                        right: 20,
                                                        top: 20,
                                                    }}>
                                                    <Path
                                                        fill-rule="evenodd"
                                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                                    />
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={{ color: colors.text }}>
                                Connect to the internet to fetch upcoming rounds.
                            </Text>
                        </>
                    )}
                </>
            ) : (
                <Text style={{ color: colors.text, padding: '5%' }}>
                    There is no competition happening currently.
                </Text>
            )}
        </>
    );
};

export default UpcomingRoundsView;
