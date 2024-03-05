import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

  const [isScrolling, setIsScrolling] = useState<boolean>(false);

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

  // initial data fetch
  useEffect(() => {
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

  const navigateIntoReport = (report: ScoutReportReturnData) => {
    setScoutViewerVisible(true);
    setCurrentReport(report);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          display: isScrolling ? 'none' : 'flex',
        }}>
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
            onPress={() => {
              const sortedKeys = Array.from(reportsByMatch.keys()).reverse();

              const sortedMap = new Map<number, ScoutReportReturnData[]>();
              sortedKeys.forEach(key => {
                sortedMap.set(key, reportsByMatch.get(key)!);
              });

              setReportsByMatch(sortedMap);
            }}
            style={{
              marginRight: '2%',
              marginLeft: '6%',
            }}>
            <Svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <Path
                fill="gray"
                d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
              />
            </Svg>
          </Pressable>
          <Pressable
            style={{
              marginRight: '2%',
              marginLeft: '6%',
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
                fill={searchActive ? colors.primary : 'gray'}
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
        onScroll={scroll_event => {
          // if scrolling down, hide search bar
          if (scroll_event.nativeEvent.contentOffset.y > prevScrollY) {
            setIsScrolling(true);
          } else {
            setIsScrolling(false);
          }

          // if at top of flatlist, show search bar
          if (
            scroll_event.nativeEvent.contentOffset.y <
            0.005 * scroll_event.nativeEvent.contentSize.height
          ) {
            setIsScrolling(false);
          }
          setPrevScrollY(scroll_event.nativeEvent.contentOffset.y);
        }}
        data={Array.from(reportsByMatch.keys()).reverse()}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => {
          return (
            <View>
              <View
                style={{
                  minWidth: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: '3%',
                }}>
                <Text
                  style={{
                    color: 'grey',
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
                    fill={colors.text}>
                    <Path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                  </Svg>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // make it like a 3x2 grid
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {reportsByMatch.get(item)?.map((report, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        navigateIntoReport(report);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: index < 3 ? 'crimson' : 'dodgerblue',
                        margin: '2%',
                        padding: '6%',
                        borderRadius: 10,
                        minWidth: '25%',
                      }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          flex: 1,
                        }}>
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
          chosenComp={currentReport?.competitionName ?? ''}
          updateFormData={() => {}}
          isOfflineForm={false}
        />
      )}
      {notesViewerVisible && (
        <Modal visible={notesViewerVisible} animationType="slide">
          <SafeAreaView style={{flex: 1}}>
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
