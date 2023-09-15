import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {Path, Svg} from 'react-native-svg';

const UpcomingRoundsView = ({navigation}) => {
  const [upcomingRounds, setUpcomingRounds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {colors} = useTheme();
  const getUpcomingRounds = async () => {
    setRefreshing(true);
    console.log('getting upcoming rounds');
    /*const upcomingRounds = await firestore()
      .collection('scout_assignments')
      .where(
        'user',
        '==',
        firestore().collection('users').doc(auth().currentUser.uid),
      )
      .get();
    // create upcomingRoundsData variable that will hold doc.team and the value of the doc.match reference match number
    const upcomingRoundsData = [];
    for (let i = 0; i < upcomingRounds.size; i++) {
      const match = await upcomingRounds.docs[i].data().match.get();
      const scoutReport = await firestore()
        .collection('scout_reports')
        .where('match', '==', match.data().number.toString())
        .where('team', '==', upcomingRounds.docs[i].data().team.toString())
        .where('user', '==', auth().currentUser.uid)
        .where('competition', '==', match.data().competition)
        .get();
      if (scoutReport.size === 0) {
        upcomingRoundsData.push({
          team: upcomingRounds.docs[i].data().team,
          match: match.data().number,
        });
      }
    }*/
    //setUpcomingRounds(upcomingRounds.docs.map(doc => doc.data()));
    //setUpcomingRounds(upcomingRoundsData);
    setRefreshing(false);
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
    <View style={{flex: 1}}>
      <View
        style={{
          alignSelf: 'center',
          height: '100%',
          borderRadius: 10,
          padding: '10%',
          width: '100%',
        }}>
        {upcomingRounds.length !== 0 && (
          <Text style={{color: colors.text, paddingBottom: '5%'}}>
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
            <Svg width={'100%'} height="50%" viewBox="0 0 16 16">
              <Path
                fill="green"
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <Path
                fill={'green'}
                d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
              />
            </Svg>
            <Text
              style={{
                color: colors.text,
                fontSize: 25,
                padding: '5%',
                textAlign: 'center',
              }}>
              Congratulations! You have no rounds left to scout today.
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
                  match: round.match,
                  team: round.team,
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
                  Match: {+round.match}
                </Text>
                <View style={{height: '20%'}} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: colors.text,
                    // padding: '2%',
                  }}>
                  Team: {+round.team}
                </Text>
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
  );
};

export default UpcomingRoundsView;
