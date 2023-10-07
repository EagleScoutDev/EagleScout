import React, {useEffect, useState} from 'react';
import {SimpleEvent, TBA} from './lib/TBAUtils';
import {useTheme} from '@react-navigation/native';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Svg, {Path} from 'react-native-svg';

// TODO: Add a loading indicator
// TODO: When it is clicked on, expand and show their rank history for the past few competitions they have attended
function CompetitionRank({team_number}: {team_number: number}) {
  const [currentCompetition, setCurrentCompetition] =
    useState<SimpleEvent | null>(null);
  const [currentCompetitionRank, setCurrentCompetitionRank] = useState<
    number | null
  >(null);
  const [allCompetitions, setAllCompetitions] = useState<SimpleEvent[]>([]);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const {colors} = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competition = await TBA.getCurrentCompetitionForTeam(team_number);
        setCurrentCompetition(competition);

        if (competition) {
          const rank = await TBA.getTeamRank(competition.key, team_number);
          setCurrentCompetitionRank(rank);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log('fetching the data!!!!!');

    const fetchTeamRankings = async () => {
      TBA.getAllCompetitionsForTeam(team_number).then(events => {
        for (let i = 0; i < events.length; i++) {
          TBA.getTeamRank(events[i].key, team_number).then(rank => {
            events[i].rank = rank;
          });
        }
        setAllCompetitions(events);
      });
    };

    fetchData();
    fetchTeamRankings();
  }, [team_number]);

  const rankToColor = (rank: number) => {
    if (rank < 8) {
      return 'green';
    } else if (rank < 16) {
      return 'deepskyblue';
    } else if (rank < 24) {
      return 'orangered';
    }
    return 'red';
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setHistoryVisible(!historyVisible);
        }}
        style={{
          minWidth: '85%',
          maxWidth: '85%',
          padding: '5%',
          marginTop: '5%',
          backgroundColor:
            currentCompetitionRank === undefined
              ? 'white'
              : rankToColor(currentCompetitionRank!),
          borderRadius: 10,
          alignSelf: 'center',
        }}>
        <View>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              marginTop: '2%',
              fontWeight: '800',
            }}>
            Ranked #{currentCompetitionRank}
          </Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              marginTop: '2%',
            }}>
            at {currentCompetition?.name}
          </Text>
        </View>
        {historyVisible ? (
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            stroke={'white'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              right: '8%',
              top: '60%',
              transform: [{rotate: '90deg'}],
            }}>
            <Path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </Svg>
        ) : (
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            stroke={'white'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              right: '5%',
              top: '60%',
            }}>
            <Path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </Svg>
        )}
      </TouchableOpacity>
      {historyVisible && (
        <ScrollView
          style={{
            marginBottom: '5%',
            // borderWidth: 2,
            // borderColor: colors.border,
            // marginHorizontal: '5%',
            minWidth: '85%',
            maxWidth: '85%',
            alignSelf: 'center',
            // padding: '5%',
            // borderRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          {allCompetitions.map((item, index) => {
            return (
              <View
                key={item.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  padding: '5%',
                  paddingHorizontal: '3%',
                  backgroundColor:
                    index % 2 == 0 ? colors.card : colors.background,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    flex: 2,
                  }}>
                  {index + 1}. {item.name}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flex: 1,
                  }}>
                  Rank {item.rank}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default CompetitionRank;
