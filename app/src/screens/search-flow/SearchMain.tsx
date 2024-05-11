import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {ScoutReportReturnData} from '../../database/ScoutReports';

import {SimpleTeam} from '../../lib/TBAUtils';
import {TBA} from '../../lib/TBAUtils';
import ScoutReportsDB from '../../database/ScoutReports';
import CompetitionChanger from './CompetitionChanger';
import ScoutViewer from '../../components/modals/ScoutViewer';
import SearchModal from './SearchModal';
import Competitions from '../../database/Competitions';
import NotesDB, {
  NoteStructure,
  NoteStructureWithMatchNumber,
} from '../../database/Notes';
import {NoteList} from '../../components/NoteList';
import {getLighterColor} from '../../lib/ColorReadability';
import TBAMatches, {TBAMatch} from '../../database/TBAMatches';
import number from '../form-creation-flow/components/questions/Number';

interface Props {
  setChosenTeam: (team: SimpleTeam) => void;
  navigation: any;
}

const SearchMain: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [listOfTeams, setListOfTeams] = useState<SimpleTeam[]>([]);

  const [competitionId, setCompetitionId] = useState<number>(-1); // default to 2023mttd

  const [reportsByMatch, setReportsByMatch] = useState<
    Map<number, ScoutReportReturnData[]>
  >(new Map());
  const [notesByMatch, setNotesByMatch] = useState<
    Map<number, NoteStructureWithMatchNumber[]>
  >(new Map());

  const [scoutViewerVisible, setScoutViewerVisible] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<ScoutReportReturnData>();
  const [notesViewerVisible, setNotesViewerVisible] = useState<boolean>(false);
  const [currentMatchNumber, setCurrentMatchNumber] = useState<number>(0);

  const [officialMatchesByMatch, setOfficialMatchesByMatch] = useState<
    Map<number, TBAMatch[]>
  >(new Map());

  const [missingReports, setMissingReports] = useState<Set<TBAMatch>>(
    new Set(),
  );

  useEffect(() => {
    if (competitionId === -1) {
      return;
    }
    TBAMatches.getMatchesForCompetition(competitionId.toString()).then(
      matches => {
        let temp: Map<number, TBAMatch[]> = new Map();
        matches.forEach(match => {
          if (temp.has(match.match)) {
            temp.get(match.match)?.push(match);
          } else {
            temp.set(match.match, [match]);
          }
        });
        setOfficialMatchesByMatch(temp);
      },
    );
  }, [competitionId]);

  useEffect(() => {
    let temp: Set<TBAMatch> = new Set();
    officialMatchesByMatch.forEach((value, key) => {
      value.forEach(match => {
        if (!reportsByMatch.has(key)) {
          return;
        }
        if (
          reportsByMatch.get(key)!.find(report => {
            return (
              report.teamNumber === Number.parseInt(match.team.slice(3), 10)
            );
          }) === undefined
        ) {
          temp.add(match);
        }
      });
    });
    setMissingReports(temp);
  }, [reportsByMatch, officialMatchesByMatch]);

  // indicates if competition data is still being fetched
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  const fetchData = useCallback(() => {
    if (competitionId !== -1) {
      setFetchingData(true);
      ScoutReportsDB.getReportsForCompetition(competitionId).then(reports => {
        // console.log('num reports found for id 8 is ' + reports.length);

        // sort reports by match number
        reports.sort((a, b) => {
          return a.matchNumber - b.matchNumber;
        });

        // create an object where key is match number and value is an array of reports
        let temp: Map<number, ScoutReportReturnData[]> = new Map();
        reports.forEach(report => {
          if (temp.has(report.matchNumber)) {
            temp.get(report.matchNumber)?.push(report);
          } else {
            temp.set(report.matchNumber, [report]);
          }
        });

        setReportsByMatch(temp);
      });

      NotesDB.getNotesForCompetition(competitionId).then(notes => {
        notes.sort((a, b) => {
          return a.match_number - b.match_number;
        });

        let temp: Map<number, NoteStructureWithMatchNumber[]> = new Map();
        for (const note of notes) {
          if (temp.has(note.match_number)) {
            temp.get(note.match_number)?.push(note);
          } else {
            temp.set(note.match_number, [note]);
          }
        }
        setNotesByMatch(temp);
      });

      Competitions.getCompetitionTBAKey(competitionId).then(key => {
        TBA.getTeamsAtCompetition(key).then(teams => {
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
    navigation.navigate('TeamViewer', {
      team: team,
      competitionId: competitionId,
    });
  };

  // initial data fetch
  useEffect(() => {
    fetchData();
    navigation.addListener('focus', () => {
      fetchData();
    });
  }, [fetchData, navigation]);

  const navigateIntoReport = (report: ScoutReportReturnData) => {
    setScoutViewerVisible(true);
    setCurrentReport(report);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2%',
          }}>
          <CompetitionChanger
            currentCompId={competitionId}
            setCurrentCompId={setCompetitionId}
            loading={fetchingData}
          />
          <Pressable
            style={{
              paddingHorizontal: '8%',
              paddingVertical: '4%',
              // backgroundColor: colors.card,
            }}
            onPress={() => {
              navigation.navigate('SearchModal', {
                teams: listOfTeams,
                reportsByMatch: reportsByMatch,
                competitionId: competitionId,
              });
            }}>
            <Svg width={'20'} height="20" viewBox="0 0 16 16">
              <Path
                fill={colors.text}
                opacity={0.7}
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </Svg>
          </Pressable>
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: colors.border,
          }}
        />
      </View>
      {reportsByMatch.size === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.text, fontSize: 20}}>
            No reports found.
          </Text>
        </View>
      )}
      <FlatList
        data={Array.from(officialMatchesByMatch.keys()).sort((a, b) => b - a)}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  minWidth: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: '3%',
                }}>
                <Text
                  style={{
                    color: colors.text,
                    opacity: 0.7,
                    marginHorizontal: '4%',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
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
                    padding: '3%',
                    borderRadius: 99,
                    marginRight: '4%',
                  }}
                  onPress={() => {
                    setNotesViewerVisible(true);
                    setCurrentMatchNumber(item);
                  }}>
                  <Svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill={getLighterColor(colors.primary)}>
                    <Path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293z" />
                  </Svg>
                </TouchableOpacity>
              </View>

              {officialMatchesByMatch
                .get(item)
                ?.sort((a, b) => a.alliance.localeCompare(b.alliance))
                .map((match, index) => {
                  return (
                    <Pressable
                      key={match.id}
                      onPress={() => {
                        console.log('pressed');
                        console.log(missingReports.size);

                        if (missingReports.has(match)) {
                          Alert.alert(
                            'Report for Team ' +
                              match.team.slice(3) +
                              ' Missing',
                            'No report found for this team in match ' +
                              item +
                              '.',
                          );
                          return;
                        } else {
                          let report = reportsByMatch
                            .get(item)
                            ?.find(
                              r =>
                                r.teamNumber ===
                                Number.parseInt(match.team.slice(3), 10),
                            );
                          if (report) {
                            navigateIntoReport(report);
                          } else {
                            Alert.alert(
                              'Error: Report not found',
                              'Report likely inputted with wrong team number.',
                            );
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        flexBasis: '30%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          match.alliance === 'red' ? 'red' : 'blue',
                        padding: '2%',
                        margin: '1%',
                        borderRadius: 10,
                        height: 80,

                        borderWidth: missingReports.has(match) ? 4 : 0,
                        borderColor: colors.primary,
                      }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: 18,
                        }}>
                        {match.team.slice(3)}
                      </Text>

                      {missingReports.has(match) && (
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 18,
                          }}>
                          Missing
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
            </View>
          );
        }}
      />
      {scoutViewerVisible && currentReport && (
        <ScoutViewer
          visible={scoutViewerVisible}
          setVisible={setScoutViewerVisible}
          data={currentReport ?? []}
          chosenComp={currentReport?.competitionName ?? ''}
          updateFormData={() => {}}
          isOfflineForm={false}
          navigateToTeamViewer={() => {
            if (currentReport) {
              let team = listOfTeams.find(
                team => team.team_number === currentReport.teamNumber,
              );
              if (team) {
                setScoutViewerVisible(false);
                navigateToTeamViewer(team);
              } else {
                Alert.alert(
                  'Error: Team not found',
                  'Report likely inputted with wrong team number.',
                );
              }
            }
          }}
        />
      )}
      {notesViewerVisible && (
        <Modal visible={notesViewerVisible} animationType="slide">
          <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
            <NoteList
              notes={notesByMatch.get(currentMatchNumber) ?? []}
              onClose={() => setNotesViewerVisible(false)}
            />
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default SearchMain;
