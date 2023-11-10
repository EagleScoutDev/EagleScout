import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';

// Note: Statbotics is said to update their data every 6 hours from Blue Alliance.
const DEBUG = false;
const YEAR = '2023';

/**
 * A capsule that displays a value and a label.
 * @param title {string} The label to display.
 * @param value {string} The value to display.
 * @returns {JSX.Element} The capsule.
 * @constructor The capsule.
 */
function InfoCapsule({title, value, textColor}) {
  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: textColor}}>
        {value}
      </Text>
      <Text style={{fontSize: 12, color: 'gray'}}>{title}</Text>
    </View>
  );
}

/**
 * A row of capsules.
 * @param children {JSX.Element[]} The capsules to display.
 * @returns {JSX.Element} The row.
 * @constructor The row.
 */
function InfoRow({children}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
      }}>
      {children}
    </View>
  );
}

function Statbotics({team}) {
  const [overall, setOverall] = useState(null);
  const [competitions, setCompetitions] = useState(null);
  const [visible, setVisible] = useState(true);
  const [isTeam, setIsTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamValid, setIsTeamValid] = useState(false);
  const {colors} = useTheme();

  /**
   * Fetches a team's overall data from Statbotics.
   * @param team_num {string} The team number to fetch data for.
   * @returns {Promise<void>} A promise that resolves when the data is fetched.
   */
  async function fetchTeam() {
    setIsLoading(true);
    const url =
      'https://api.statbotics.io/v2/team_year/' + team + '/' + YEAR + '/';
    fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // do something with the data
        if (DEBUG) {
          console.log(data);
        }
        if (data && Object.entries(data).length !== 0) {
          setIsTeam(true);
          setOverall(data);
          if (DEBUG) {
            console.log(data.name);
          }
        } else {
          setIsTeam(false);
        }
        setIsLoading(false);
      })
      .catch(error => {
        if (DEBUG) {
          console.error('[fetchTeam]: ' + error);
        }
      });
  }

  /**
   * Fetches the team's event data from Statbotics.
   * This includes every event that the team participated in.
   */
  async function fetchTeamEvent() {
    const url =
      'https://api.statbotics.io/v2/team_events/team/' + team + '/year/' + YEAR;
    fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // do something with the data
        // if (isTeam) {
        setCompetitions(data);
        // }
      })
      .catch(error => {
        if (DEBUG) {
          console.error(error);
        }
      });
  }

  useEffect(() => {
    setOverall(null);
    // setCompetitions(null);

    if (/^\d+$/.test(team) && Number(team) < 100000) {
      setIsTeamValid(true);
      fetchTeam(team).then(() => {
        fetchTeamEvent().then(() => {
          if (DEBUG) {
            console.log('done');
          }
        });
      });
    } else {
      setIsTeamValid(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team]);

  const styles = StyleSheet.create({
    formSection: {
      flexDirection: 'column',
      minWidth: '85%',
      maxWidth: '85%',
      padding: '5%',
      backgroundColor: colors.card,
      borderRadius: 10,
      alignSelf: 'center',
      marginTop: '5%',
    },
  });

  // empty team number
  if (team === '') {
    return (
      <View style={styles.formSection}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.text,
          }}
          onPress={() => setVisible(!visible)}>
          Team Statistics
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: colors.text,
          }}>
          Get started by entering a team number.
        </Text>
      </View>
    );
  }

  if (!isTeamValid) {
    return (
      <View style={styles.formSection}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.text,
          }}
          onPress={() => setVisible(!visible)}>
          Team Statistics
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: colors.text,
          }}>
          Please enter a valid team number.
        </Text>
      </View>
    );
  }

  // team number is not in the database
  if (isLoading) {
    return (
      <View style={styles.formSection}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.text,
          }}
          onPress={() => setVisible(!visible)}>
          Team {team} Statistics
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: colors.text,
          }}>
          Loading...
        </Text>
      </View>
    );
  }

  // team number is not in the database
  if (!isTeam) {
    return (
      <View style={styles.formSection}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.text,
          }}
          onPress={() => setVisible(!visible)}>
          Team {team} Statistics
        </Text>
        <Text style={{textAlign: 'center', color: 'red'}}>
          This team is not in the database. Please check your team number.
        </Text>
      </View>
    );
  }

  // minimized view, only shows team number and nickname
  if (!visible) {
    return (
      <View style={styles.formSection}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.text,
          }}
          onPress={() => setVisible(!visible)}>
          Team {team} Statistics
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: colors.text,
          }}>
          {overall ? overall.name : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.formSection}>
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: colors.text,
          }}>
          Overall Statistics
        </Text>
        {overall && (
          <InfoRow>
            <InfoCapsule
              title="Auto EPA"
              value={overall.auto_epa_mean}
              textColor={colors.text}
            />
            <InfoCapsule
              title="Teleop EPA"
              value={overall.teleop_epa_mean}
              textColor={colors.text}
            />
            <InfoCapsule
              title="Endgame EPA"
              value={overall.endgame_epa_mean}
              textColor={colors.text}
            />
          </InfoRow>
        )}
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            marginTop: 10,
            color: colors.text,
          }}>
          Past Competition Stats
        </Text>
        <ScrollView>
          {competitions[0] != null &&
            competitions.map(comp => (
              <View style={{paddingVertical: 10}}>
                <Text style={{fontWeight: '500', color: colors.text}}>
                  {comp.event_name}
                </Text>
                <InfoRow>
                  <InfoCapsule
                    title="Auto EPA"
                    value={comp.auto_epa_mean}
                    textColor={colors.text}
                  />
                  <InfoCapsule
                    title="Teleop EPA"
                    value={comp.teleop_epa_mean}
                    textColor={colors.text}
                  />
                  <InfoCapsule
                    title="Endgame EPA"
                    value={comp.endgame_epa_mean}
                    textColor={colors.text}
                  />
                </InfoRow>
              </View>
            ))}
        </ScrollView>
        <Text style={{textAlign: 'center', color: 'gray', marginLeft: '2%'}}>
          Powered by Statbotics
        </Text>
      </View>
    </View>
  );
}

export default Statbotics;
