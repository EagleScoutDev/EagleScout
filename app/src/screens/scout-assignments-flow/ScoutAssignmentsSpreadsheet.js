import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
import {useState, useEffect} from 'react';
import TBAMatches from '../../database/TBAMatches';
import SetScoutAssignmentModal from '../../components/modals/SetScoutAssignmentModal';
import ScoutAssignments from '../../database/ScoutAssignments';

function ScoutAssignmentsSpreadsheet({route}) {
  const {competition} = route.params;
  const [matchesGrouped, setMatchesGrouped] = useState([]);
  const [scoutAssignmentModalVisible, setScoutAssignmentModalVisible] =
    useState(false);
  const [match, setMatch] = useState(null);

  const styles = StyleSheet.create({
    gridView: {
      marginTop: 20,
      flex: 1,
    },
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 5,
      padding: 10,
      height: 50,
    },
    itemName: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
    sectionHeader: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      alignItems: 'center',
      backgroundColor: '#636e72',
      color: 'white',
      padding: 10,
    },
  });

  useEffect(() => {
    (async () => {
      let matches = await TBAMatches.getMatchesForCompetition(competition.id);
      let scoutAssignments =
        await ScoutAssignments.getScoutAssignmentsForCompetition(
          competition.id,
        );

      matches = matches.filter(match => match.compLevel === 'qm');
      const matchesGrouped = [];
      let uniqueIndex = 0;
      matches.forEach(match => {
        const matchingObject = matchesGrouped.find(
          obj => obj.data[0].match === match.match,
        );
        let name = '';
        let assignmentExists = false;
        for (let i = 0; i < scoutAssignments.length; i++) {
          if (
            scoutAssignments[i].matchId === match.id &&
            scoutAssignments[i].team === match.team
          ) {
            name = scoutAssignments[i].userFullName;
            assignmentExists = true;
            break;
          }
        }
        const matchData = {
          ...match,
          name: name,
          assignmentExists: assignmentExists,
          key: uniqueIndex++,
          teamFormatted: teamFormatter(match.team),
        };
        if (matchingObject) {
          matchingObject.data.push(matchData);
        } else {
          matchesGrouped.push({
            data: [matchData],
            title: `Match: ${match.match}`,
          });
        }
      });

      matchesGrouped.sort((a, b) => {
        return a.data[0].match - b.data[0].match;
      });

      setMatchesGrouped(matchesGrouped);
    })();
  }, [competition]);

  const teamFormatter = team => {
    if (team.substring(0, 3) === 'frc') {
      return team.substring(3);
    } else {
      return team;
    }
  };

  const setScoutAssignment = item => {
    console.log('setting scout assignment');
    setMatch(item);
    setScoutAssignmentModalVisible(true);
  };

  const setNameCb = name => {
    for (let i = 0; i < matchesGrouped.length; i++) {
      for (let j = 0; j < matchesGrouped[i].data.length; j++) {
        if (matchesGrouped[i].data[j].key === match.key) {
          if (name != null) {
            matchesGrouped[i].data[j].name = name;
            matchesGrouped[i].data[j].assignmentExists = true;
          } else {
            matchesGrouped[i].data[j].name = '';
            matchesGrouped[i].data[j].assignmentExists = false;
          }
          break;
        }
      }
    }
  };

  return (
    <>
      <SectionGrid
        itemDimension={90}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={matchesGrouped}
        style={styles.gridView}
        renderItem={({item, section, index}) => (
          <TouchableOpacity
            style={[styles.itemContainer, {backgroundColor: item.alliance}]}
            onPress={() => setScoutAssignment(item)}>
            <Text style={styles.itemName}>{item.teamFormatted}</Text>
            <Text style={styles.itemCode}>{item.name}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
      />
      <SetScoutAssignmentModal
        visible={scoutAssignmentModalVisible}
        setVisible={setScoutAssignmentModalVisible}
        competition={competition}
        match={match}
        setNameCb={setNameCb}
      />
    </>
  );
}

export default ScoutAssignmentsSpreadsheet;
