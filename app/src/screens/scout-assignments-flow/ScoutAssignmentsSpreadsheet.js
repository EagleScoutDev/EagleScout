import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {SectionGrid} from 'react-native-super-grid';
import {useState, useEffect} from 'react';
import TBAMatches from '../../database/TBAMatches';
import SetScoutAssignmentModal from '../../components/modals/SetScoutAssignmentModal';
import ScoutAssignments from '../../database/ScoutAssignments';
import {useTheme} from '@react-navigation/native';

function ScoutAssignmentsSpreadsheet({route}) {
  const {competition} = route.params;
  const [matchesGrouped, setMatchesGrouped] = useState([]);
  const [scoutAssignmentModalVisible, setScoutAssignmentModalVisible] =
    useState(false);
  const [matches, setMatches] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const {colors} = useTheme();
  const [nextIdx, setNextIdx] = useState(0);

  const styles = StyleSheet.create({
    gridView: {
      marginTop: 40,
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
      let uniqueIndex = nextIdx;
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
      setNextIdx(uniqueIndex);

      matchesGrouped.sort((a, b) => {
        return a.data[0].match - b.data[0].match;
      });

      setMatchesGrouped(matchesGrouped);
    })();
  }, [competition]); // eslint-disable-line react-hooks/exhaustive-deps
  // Eslint exhausting deps was disabled because we don't want to re-render
  // when nextIdx changes. nextIdx is only used to keep track of the next
  // unique index for items, changes to it should not trigger a re-render
  // Putting it in the deps array would cause an infinite loop.

  const teamFormatter = team => {
    if (team.substring(0, 3) === 'frc') {
      return team.substring(3);
    } else {
      return team;
    }
  };

  const setScoutAssignment = item => {
    console.log('setting scout assignment');
    if (selectMode) {
      if (selectedItems.length === 0) {
        Alert.alert('Select an item', 'Please select at least one item.');
        return;
      } else {
        setMatches(selectedItems);
      }
    } else {
      setMatches([item]);
    }
    setScoutAssignmentModalVisible(true);
  };

  const setNameCb = name => {
    let uniqueIndex = nextIdx;
    for (let i = 0; i < matchesGrouped.length; i++) {
      for (let j = 0; j < matchesGrouped[i].data.length; j++) {
        for (let k = 0; k < matches.length; k++) {
          if (matchesGrouped[i].data[j].key === matches[k].key) {
            if (name != null) {
              matchesGrouped[i].data[j].name = name;
              matchesGrouped[i].data[j].assignmentExists = true;
            } else {
              matchesGrouped[i].data[j].name = '';
              matchesGrouped[i].data[j].assignmentExists = false;
            }
            matchesGrouped[i].data[j].selected = false;
            matchesGrouped[i].data[j].key = uniqueIndex++;
          }
        }
      }
    }
    setNextIdx(uniqueIndex);
    setMatchesGrouped(matchesGrouped);
  };

  useEffect(() => {
    setSelectedItems([]);
    let uniqueIndex = nextIdx;
    for (let i = 0; i < matchesGrouped.length; i++) {
      for (let j = 0; j < matchesGrouped[i].data.length; j++) {
        if (matchesGrouped[i].data[j].selected) {
          matchesGrouped[i].data[j].key = uniqueIndex++;
          matchesGrouped[i].data[j].selected = false;
        }
      }
    }
    setNextIdx(uniqueIndex);
    setMatchesGrouped(matchesGrouped);
  }, [matchesGrouped, selectMode]); // eslint-disable-line react-hooks/exhaustive-deps
  // eslint disabled for same reason as it was disabled for the previous useEffect

  const setSelected = item => {
    item.selected = !item.selected;
    const originalKey = item.key;
    item.key = nextIdx;
    setNextIdx(nextIdx + 1);
    for (let i = 0; i < matchesGrouped.length; i++) {
      for (let j = 0; j < matchesGrouped[i].data.length; j++) {
        if (matchesGrouped[i].data[j].key === originalKey) {
          matchesGrouped[i].data[j] = item;
          break;
        }
      }
    }
    setSelectedItems([...selectedItems, item]);
    setMatchesGrouped(matchesGrouped);
  };

  const getColor = item => {
    if (item.alliance === 'blue') {
      if (item.selected) {
        return '#3366ff';
      } else {
        return '#1a1aff';
      }
    } else {
      if (item.selected) {
        return '#ff6666';
      } else {
        return '#ff1a1a';
      }
    }
  };

  return (
    <>
      <View>
        <TouchableOpacity
          onPress={() => setSelectMode(!selectMode)}
          style={{
            alignSelf: 'flex-end',
            // backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 10,
            position: 'absolute',
          }}>
          <Text
            style={{
              color: selectMode ? colors.primary : 'gray',
              fontWeight: 'bold',
              fontSize: 17,
            }}>
            {selectMode ? 'Exit' : 'Select Mode'}
          </Text>
        </TouchableOpacity>
        {selectMode && (
          <TouchableOpacity
            onPress={() => {
              setScoutAssignment(null);
            }}
            style={{
              alignSelf: 'flex-center',
              marginLeft: '50%',
              paddingTop: 10,
              borderRadius: 10,
              position: 'absolute',
            }}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: 'bold',
                fontSize: 17,
              }}>
              OK
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <SectionGrid
        itemDimension={90}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={matchesGrouped}
        style={styles.gridView}
        renderItem={({item, section, index}) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              {
                backgroundColor: getColor(item),
              },
            ]}
            onPress={() =>
              selectMode ? setSelected(item) : setScoutAssignment(item)
            }>
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
        matches={matches}
        setNameCb={setNameCb}
      />
    </>
  );
}

export default ScoutAssignmentsSpreadsheet;
