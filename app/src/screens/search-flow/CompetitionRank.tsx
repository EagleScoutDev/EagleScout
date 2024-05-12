import React, {useEffect, useState} from 'react';
import {SimpleEvent, TBA} from '../../lib/TBAUtils';
import {useTheme} from '@react-navigation/native';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let all_competitions: SimpleEvent[] = [];

    const fetchTeamRankings = async () => {
      try {
        const events = await TBA.getAllCompetitionsForTeam(team_number);
        const rankPromises = events.map(async event => {
          const rank = await TBA.getTeamRank(event.key, team_number);
          console.log(event.name + ' ' + rank);
          return {...event, rank}; // return a new object with the rank property added
        });

        const updatedEvents = await Promise.all(rankPromises);
        all_competitions = updatedEvents;
        setAllCompetitions(updatedEvents);
      } catch (error) {
        console.error('An error occurred while fetching team rankings:', error);
      }
    };

    const fetchData = async () => {
      try {
        const competition = await TBA.getCurrentCompetitionForTeam(team_number);
        setCurrentCompetition(competition);

        if (competition) {
          const rank = await TBA.getTeamRank(competition.key, team_number);
          setCurrentCompetitionRank(rank);
          return true;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      return false;
    };

    const findClosestDate = (events: SimpleEvent[]) => {
      const dateDiff = (date: Date, startDate: Date, endDate: Date) => {
        // if the date is between start and end date return 0
        if (date >= startDate && date <= endDate) {
          return 0;
        }
        // else return the difference between the date and the start date or the end date, whichever is closer
        return Math.abs(date.getTime() - startDate.getTime()) <
          Math.abs(date.getTime() - endDate.getTime())
          ? Math.abs(date.getTime() - startDate.getTime())
          : Math.abs(date.getTime() - endDate.getTime());
      };

      let closest = events[0];
      let date = new Date();
      let diff = dateDiff(
        date,
        new Date(events[0].start_date),
        new Date(events[0].end_date),
      );
      events.forEach(event => {
        const newDiff = dateDiff(
          date,
          new Date(event.start_date),
          new Date(event.end_date),
        );
        if (newDiff < diff) {
          closest = event;
          diff = newDiff;
        }
      });
      return closest;
    };

    fetchData().then(success => {
      fetchTeamRankings()
        .then(() => {
          const sorted = [...all_competitions].sort((a, b) => {
            const dateA = new Date(a.start_date).getTime();
            const dateB = new Date(b.start_date).getTime();
            return dateA - dateB;
          });

          setAllCompetitions(sorted);

          if (sorted.length > 0) {
            const filteredArray = sorted.filter(
              event => event.rank != null && event.rank >= 0,
            );

            let last_event;
            if (filteredArray.length > 0) {
              last_event = findClosestDate(filteredArray);
            } else {
              last_event = findClosestDate(sorted);
            }
            console.log('last event: ' + Object.entries(last_event));

            if (!success) {
              setCurrentCompetition(last_event);
              console.log('detected last rank: ' + last_event.rank);
              setCurrentCompetitionRank(last_event.rank);
              // the following line is used to trigger a rerender
              // there is probably a better way to accomplish this
              setCurrentCompetition(last_event);
            }
          } else {
            setCurrentCompetition(null);
            setCurrentCompetitionRank(-3);
          }
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }, [team_number]);

  const rankToColor = (rank: number) => {
    if (rank < 0) {
      return 'gray';
    } else if (rank < 8) {
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
          backgroundColor: loading
            ? 'gray'
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
            {loading ? (
              'Loading...'
            ) : (
              <>
                {currentCompetitionRank === -1
                  ? 'Has not competed yet'
                  : currentCompetitionRank === -2
                  ? 'Unranked'
                  : currentCompetitionRank === -3
                  ? 'No competitions found for this team'
                  : 'Ranked #' + currentCompetitionRank}
              </>
            )}
          </Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              marginTop: '2%',
            }}>
            {loading ? (
              ' '
            ) : (
              <>
                {currentCompetition != null
                  ? 'at ' + currentCompetition.name
                  : ' '}
              </>
            )}
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

                  padding: 20,
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
                  {item.rank === -1
                    ? 'Future Competition'
                    : item.rank === -2
                    ? 'Unranked'
                    : 'Rank #' + item.rank}
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
