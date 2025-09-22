import { Alert, FlatList, Modal, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import * as Bs from "../../ui/icons";
import type { SimpleTeam } from "../../lib/tba";
import { TBA } from "../../lib/tba";
import { CompetitionChanger } from "./CompetitionChanger";
import { ScoutViewer } from "../../components/modals/ScoutViewer";
import { CompetitionsDB } from "../../database/Competitions";
import { NotesDB, type NoteWithMatch } from "../../database/ScoutNotes";
import { NoteList } from "../../components/NoteList.tsx";
import { getLighterColor, parseColor } from "../../lib/color";
import { isTablet } from "../../lib/deviceType";
import type { SearchMenuScreenProps } from "./SearchMenu";

export interface SearchMainProps extends SearchMenuScreenProps<"Main"> {}
export function SearchMain({ navigation }: SearchMainProps) {
    const { colors } = useTheme();
    const [listOfTeams, setListOfTeams] = useState<SimpleTeam[]>([]);

    const [competitionId, setCompetitionId] = useState<number>(-1); // default to 2023mttd

    const [reportsByMatch, setReportsByMatch] = useState<Map<number, MatchReportReturnData[]>>(new Map());
    const [notesByMatch, setNotesByMatch] = useState<Map<number, NoteWithMatch[]>>(new Map());

    const [scoutViewerVisible, setScoutViewerVisible] = useState<boolean>(false);
    const [currentReport, setCurrentReport] = useState<MatchReportReturnData>();
    const [notesViewerVisible, setNotesViewerVisible] = useState<boolean>(false);
    const [currentMatchNumber, setCurrentMatchNumber] = useState<number>(0);

    // const [isScrolling, setIsScrolling] = useState<boolean>(false);

    // used for hiding and showing header
    const [prevScrollY, setPrevScrollY] = useState<number>(0);

    // for searching
    const [searchActive, setSearchActive] = useState<boolean>(false);

    // indicates if competition data is still being fetched
    const [fetchingData, setFetchingData] = useState<boolean>(false);

    // used for animating the search bar hiding and showing
    // useEffect(() => {
    //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // }, [isScrolling]);

    const fetchData = useCallback(() => {
        if (competitionId !== -1) {
            setFetchingData(true);
            MatchReportsDB.getReportsForCompetition(competitionId).then((reports) => {
                // console.log('num reports found for id 8 is ' + reports.length);

                // sort reports by match number
                reports.sort((a, b) => {
                    return a.matchNumber - b.matchNumber;
                });

                // create an object where key is match number and value is an array of reports
                let temp: Map<number, MatchReportReturnData[]> = new Map();
                reports.forEach((report) => {
                    if (temp.has(report.matchNumber)) {
                        temp.get(report.matchNumber)?.push(report);
                    } else {
                        temp.set(report.matchNumber, [report]);
                    }
                });

                setReportsByMatch(temp);
            });

            NotesDB.getNotesForCompetition(competitionId).then((notes) => {
                notes.sort((a, b) => {
                    return a.match_number - b.match_number;
                });

                let temp: Map<number, NoteWithMatch[]> = new Map();
                for (const note of notes) {
                    if (temp.has(note.match_number)) {
                        temp.get(note.match_number)?.push(note);
                    } else {
                        temp.set(note.match_number, [note]);
                    }
                }
                setNotesByMatch(temp);
            });

            CompetitionsDB.getCompetitionTBAKey(competitionId).then((key) => {
                TBA.getTeamsAtCompetition(key).then((teams) => {
                    // sort teams by team number
                    teams.sort((a, b) => {
                        return a.team_number - b.team_number;
                    });
                    setListOfTeams(teams);
                    setFetchingData(false);
                });
            });
            // console.log(listOfTeams);
        }
    }, [competitionId]);

    const navigateToTeamViewer = (team: SimpleTeam) => {
        navigation.navigate("TeamViewer", {
            team: team,
            competitionId: competitionId,
        });
    };

    // initial data fetch
    useEffect(() => {
        fetchData();
        navigation.addListener("focus", () => {
            fetchData();
        });
    }, [fetchData, navigation]);

    const navigateIntoReport = (report: MatchReportReturnData) => {
        setScoutViewerVisible(true);
        setCurrentReport(report);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: isTablet() ? "0%" : "2%",
                    }}
                >
                    <CompetitionChanger
                        currentCompId={competitionId}
                        setCurrentCompId={setCompetitionId}
                        loading={fetchingData}
                    />
                    {!fetchingData && (
                        <Pressable
                            style={{
                                paddingHorizontal: "8%",
                                paddingVertical: "4%",
                                // backgroundColor: colors.card,
                            }}
                            onPress={() => {
                                navigation.navigate("SearchModal", {
                                    teams: listOfTeams,
                                    reportsByMatch: reportsByMatch,
                                    competitionId: competitionId,
                                });
                            }}
                        >
                            <Bs.Search size="20" fill={colors.text} />
                        </Pressable>
                    )}
                </View>
                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.border,
                    }}
                />
            </View>
            {reportsByMatch.size === 0 && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 20,
                            textAlign: "center",
                        }}
                    >
                        No reports found
                    </Text>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 18,
                            textAlign: "center",
                            marginTop: 20,
                            opacity: 0.7,
                        }}
                    >
                        Select a competition above to get started
                    </Text>
                </View>
            )}
            <FlatList
                data={Array.from(reportsByMatch.keys()).reverse()}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <View
                                style={{
                                    minWidth: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: "3%",
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                        opacity: 0.7,
                                        marginHorizontal: "4%",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                    }}
                                >
                                    {item}
                                </Text>
                                <View
                                    style={{
                                        height: 2,
                                        backgroundColor: colors.border,
                                        flex: 1,
                                    }}
                                />
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.card,
                                        padding: "3%",
                                        borderRadius: 99,
                                        marginRight: "4%",
                                    }}
                                    onPress={() => {
                                        setNotesViewerVisible(true);
                                        setCurrentMatchNumber(item);
                                    }}
                                >
                                    <Bs.StickyFill size="16" fill={getLighterColor(parseColor(colors.primary))} />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    // make it like a 3x2 grid
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                }}
                            >
                                {reportsByMatch.get(item)?.map((report, index) => {
                                    return (
                                        <Pressable
                                            key={report.reportId}
                                            onPress={() => {
                                                navigateIntoReport(report);
                                            }}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                // borderWidth: 1,
                                                backgroundColor: index < 3 ? "red" : "dodgerblue",
                                                // shadowColor: colors.card,
                                                // shadowOffset: {width: 0, height: 2},
                                                // shadowOpacity: 0.25,
                                                // shadowRadius: 4,
                                                // elevation: 5,
                                                borderColor: colors.text,

                                                margin: "2%",
                                                padding: "6%",
                                                borderRadius: 10,
                                                minWidth: "25%",
                                                // backgroundColor: colors.card,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: colors.text,
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                {report.teamNumber}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    );
                }}
            />
            {scoutViewerVisible && currentReport && (
                <ScoutViewer
                    visible={scoutViewerVisible}
                    setVisible={setScoutViewerVisible}
                    data={currentReport ?? []}
                    chosenComp={currentReport?.competitionName ?? ""}
                    updateFormData={() => {}}
                    isOfflineForm={false}
                    navigateToTeamViewer={() => {
                        if (currentReport) {
                            let team = listOfTeams.find((team) => team.team_number === currentReport.teamNumber);
                            if (team) {
                                setScoutViewerVisible(false);
                                navigateToTeamViewer(team);
                            } else {
                                Alert.alert("Error: Team not found", "Report likely inputted with wrong team number.");
                            }
                        }
                    }}
                />
            )}
            {notesViewerVisible && (
                <Modal visible={notesViewerVisible} animationType="slide">
                    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                        <NoteList
                            notes={notesByMatch.get(currentMatchNumber) ?? []}
                            onClose={() => setNotesViewerVisible(false)}
                        />
                    </SafeAreaView>
                </Modal>
            )}
        </SafeAreaView>
    );
}
