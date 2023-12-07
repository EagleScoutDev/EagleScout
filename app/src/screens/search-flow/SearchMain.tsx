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

interface Props {
  setChosenTeam: (team: SimpleTeam) => void;
}

const SearchMain: React.FC<Props> = ({navigation}) => {
  const [team, setTeam] = useState<string>('');
  const {colors} = useTheme();

  const [listOfTeams, setListOfTeams] = useState<SimpleTeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<SimpleTeam[]>([]);

  const [searchInFocus, setSearchInFocus] = useState<boolean>(false);

  const [listOfScoutReports, setListOfScoutReports] = useState<
    ScoutReportReturnData[]
  >([]);

  const [competitionId, setCompetitionId] = useState<number>(1); // default to 2023mttd

  // create an object where key is match number and value is an array of reports
  const [reportsByMatch, setReportsByMatch] = useState<
    Map<number, ScoutReportReturnData[]>
  >(new Map());

  const [scoutViewerVisible, setScoutViewerVisible] = useState<boolean>(false);

  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isScrolling]);

  // initial data fetch
  useEffect(() => {
    ScoutReportsDB.getReportsForCompetition(competitionId).then(reports => {
      console.log('num reports found for id 8 is ' + reports.length);

      // sort reports by matchnumber
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

      // print temp out nicely
      temp.forEach((value, key) => {
        console.log('key: ' + key);
        console.log(value.length);
      });
      setReportsByMatch(temp);

      setListOfScoutReports(reports);
    });

    TBA.getTeamsAtCompetition('2023mttd').then(teams => {
      // sort teams by team number
      teams.sort((a, b) => {
        return a.team_number - b.team_number;
      });
      setListOfTeams(teams);
    });
    console.log(listOfTeams);
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

  return (
    <View style={{flex: 1, marginTop: '10%'}}>
      <CompetitionChanger
        currentCompId={competitionId}
        setCurrentCompId={setCompetitionId}
      />
      {!isScrolling && (
        <>
          <MinimalSectionHeader title={'Search'} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // marginLeft: '4%',
              marginTop: '3%',
              paddingLeft: '4%',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <Svg width={'6%'} height="50%" viewBox="0 0 16 16">
              <Path
                fill={'gray'}
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </Svg>
            <TextInput
              style={{
                marginHorizontal: '4%',
                height: 40,
                // paddingLeft: '6%',
                color: colors.text,
                flex: 1,
              }}
              onChangeText={text => setTeam(text)}
              value={team}
              onFocus={() => setSearchInFocus(true)}
              // keyboardType={'numeric'}
              placeholder={'Try "114" or "Eaglestrike"'}
              onEndEditing={() => {
                console.log('onEndEditing');
              }}
            />
          </View>
        </>
      )}
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: colors.border,
          marginVertical: '3%',
        }}
      />
      <FlatList
        onScroll={scroll_event => {
          // if scrolling down, hide search bar
          if (scroll_event.nativeEvent.contentOffset.y > 0) {
            setIsScrolling(true);
          } else {
            setIsScrolling(false);
          }
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
                        navigation.navigate('Scout Report Viewer', {
                          visible: scoutViewerVisible,
                          setVisible: setScoutViewerVisible,
                          data: report.data ?? [],
                          chosenComp: report.competitionName,
                          updateFormData: () => {},
                          isOfflineForm: false,
                        });
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
    </View>
  );
};

export default SearchMain;
