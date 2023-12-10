import {
  View,
  Text,
  TextInput,
  Switch,
  FlatList,
  TouchableOpacity,
  Pressable,
  Animated,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import Svg, {Path} from 'react-native-svg';
import ScoutReports, {ScoutReportReturnData} from '../../database/ScoutReports';

import {SimpleTeam} from '../../lib/TBAUtils';
import {TBA} from '../../lib/TBAUtils';
import ScoutReportsDB from '../../database/ScoutReports';
import CompetitionChanger from './CompetitionChanger';
import ScoutViewer from '../../components/modals/ScoutViewer';
import SearchModal from './SearchModal';

interface Props {
  setChosenTeam: (team: SimpleTeam) => void;
}

const SearchMain: React.FC<Props> = ({navigation}) => {
  const [team, setTeam] = useState<string>('');
  const {colors} = useTheme();

  const [listOfTeams, setListOfTeams] = useState<SimpleTeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<SimpleTeam[]>([]);

  const [listOfScoutReports, setListOfScoutReports] = useState<
    ScoutReportReturnData[]
  >([]);

  const [competitionId, setCompetitionId] = useState<number>(1); // default to 2023mttd

  // create an object where key is match number and value is an array of reports
  const [reportsByMatch, setReportsByMatch] = useState<
    Map<number, ScoutReportReturnData[]>
  >(new Map());

  const [scoutViewerVisible, setScoutViewerVisible] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<ScoutReportReturnData>();

  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);

  // for searching
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const [fetchingData, setFetchingData] = useState<boolean>(false);

  // used for animating the search bar hiding and showing
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isScrolling]);

  // initial data fetch
  useEffect(() => {
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

      // // print temp out nicely
      // temp.forEach((value, key) => {
      //   console.log('key: ' + key);
      //   console.log(value.length);
      // });
      setReportsByMatch(temp);

      setListOfScoutReports(reports);
    });

    TBA.getTeamsAtCompetition('2023mttd').then(teams => {
      // sort teams by team number
      teams.sort((a, b) => {
        return a.team_number - b.team_number;
      });
      setListOfTeams(teams);
      setFetchingData(false);
    });
    // console.log(listOfTeams);
  }, [competitionId]);

  // when user starts searching, filter the results displayed
  useEffect(() => {
    if (team.length > 0 && listOfTeams.length > 0) {
      setFilteredTeams(
        listOfTeams.filter(t => {
          return (
            t.team_number.toString().includes(team) ||
            t.nickname.toLowerCase().includes(team.toLowerCase())
          );
        }),
      );
    } else {
      setFilteredTeams(listOfTeams);
    }
  }, [team, listOfTeams]);

  const navigateIntoReport = (report: ScoutReportReturnData) => {
    setScoutViewerVisible(true);
    setCurrentReport(report);
  };

  return (
    <View style={{flex: 1, marginTop: '10%'}}>
      {!isScrolling && (
        <>
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
              <Svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16">
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
                setSearchActive(true);
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
              marginVertical: '3%',
            }}
          />
        </>
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
          if (scroll_event.nativeEvent.contentOffset.y === 0) {
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
                    width: '100%',
                    backgroundColor: colors.border,
                  }}
                />
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
      <SearchModal
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        teams={listOfTeams}
        reportsByMatch={reportsByMatch}
        navigateIntoReport={navigateIntoReport}
      />
    </View>
  );
};

export default SearchMain;
