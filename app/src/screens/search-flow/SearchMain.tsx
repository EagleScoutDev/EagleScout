import {
  View,
  Text,
  TextInput,
  Switch,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import MinimalSectionHeader from '../../components/MinimalSectionHeader';
import Svg, {Path} from 'react-native-svg';

import {SimpleTeam} from '../../lib/TBAUtils';
import {TBA} from '../../lib/TBAUtils';
import CompetitionsDB from '../../database/Competitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormHelper from '../../FormHelper';
import Competitions from '../../database/Competitions';

interface Props {
  setChosenTeam: (team: SimpleTeam) => void;
}

const SearchMain: React.FC<Props> = ({navigation}) => {
  const [team, setTeam] = useState<string>('');
  const {colors} = useTheme();

  const [currentCompetitionOnly, setCurrentCompetitionOnly] = useState(true);
  const [isCompetitionHappening, setIsCompetitionHappening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [listOfTeams, setListOfTeams] = useState<SimpleTeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<SimpleTeam[]>([]);

  // initial data fetch
  useEffect(() => {
    (async () => {
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
        }
      } else {
        const storedComp = await FormHelper.readAsyncStorage(
          FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
        );
        if (storedComp != null) {
          comp = JSON.parse(storedComp);
        }
      }
      setIsOffline(!dbRequestWorked);

      let teams = null;
      if (comp != null) {
        setIsCompetitionHappening(true);
        if (dbRequestWorked) {
          teams = await Competitions.getCompetitionTeams(comp.id);
          await AsyncStorage.setItem('teams', JSON.stringify(teams));
        } else {
          const teamsOffline = await AsyncStorage.getItem('teams');
          if (teamsOffline != null) {
            teams = JSON.parse(teamsOffline);
          }
        }
      } else {
        setIsCompetitionHappening(false);
      }
      if (teams != null) {
        teams.sort();
      }
      setListOfTeams(teams);
    })();
  }, []);

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
    <>
      {isCompetitionHappening ? (
        <View style={{flex: 1}}>
          <MinimalSectionHeader title={'Search'} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '4%',
              marginTop: '3%',
            }}>
            <Svg width={'6%'} height="50%" viewBox="0 0 16 16">
              <Path
                fill={'gray'}
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </Svg>
            <TextInput
              style={{
                marginHorizontal: '6%',
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 25,
                paddingLeft: '6%',
                color: colors.text,
                flex: 1,
              }}
              onChangeText={text => setTeam(text)}
              value={team}
              // keyboardType={'numeric'}
              placeholder={'Try "114" or "Eaglestrike"'}
              onEndEditing={() => {
                console.log('onEndEditing');
              }}
            />
          </View>
          {/*<View*/}
          {/*  style={{*/}
          {/*    flexDirection: 'row',*/}
          {/*    alignItems: 'center',*/}
          {/*    marginTop: '3%',*/}
          {/*    justifyContent: 'space-between',*/}

          {/*    padding: '4%',*/}
          {/*    paddingHorizontal: '6%',*/}
          {/*    marginHorizontal: '5%',*/}

          {/*    backgroundColor: colors.card,*/}
          {/*    borderColor: colors.border,*/}
          {/*    borderWidth: 1,*/}
          {/*    borderRadius: 10,*/}
          {/*  }}>*/}
          {/*  <Text style={{color: colors.text, fontWeight: 'bold', fontSize: 15}}>*/}
          {/*    Filter by current competition*/}
          {/*  </Text>*/}
          {/*  <Switch*/}
          {/*    onValueChange={() =>*/}
          {/*      setCurrentCompetitionOnly(!currentCompetitionOnly)*/}
          {/*    }*/}
          {/*    value={currentCompetitionOnly}*/}
          {/*  />*/}
          {/*</View>*/}
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: colors.border,
              marginVertical: '3%',
            }}
          />
          <FlatList
            data={filteredTeams}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  width: '80%',
                  alignSelf: 'center',
                  backgroundColor: colors.border,
                }}
              />
            )}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('TeamViewer', {team: item});
                  }}
                  key={item.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginVertical: '2%',
                    justifyContent: 'space-between',

                    padding: '5%',
                    paddingHorizontal: '3%',
                    marginHorizontal: '5%',

                    // backgroundColor: colors.card,
                    // borderColor: colors.border,
                    // borderBottomColor: colors.border,
                    // borderBottomWidth: 1,
                    // borderWidth: 1,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      flex: 1,
                    }}>
                    {item.team_number}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      textAlign: 'right',
                      flex: 5,
                    }}>
                    {item.nickname}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>There is no competition happening currently.</Text>

          {isOffline && (
            <Text>
              To check for competitions, please connect to the internet.
            </Text>
          )}
        </View>
      )}
    </>
  );
};

export default SearchMain;
