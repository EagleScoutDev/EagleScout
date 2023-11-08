import {StyleSheet, Text, View} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
import React, { useEffect } from "react";
import TBAMatches from '../../database/TBAMatches';

function ScoutAssignmentsSpreadsheet({competition}) {
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
      console.log(matches[0]);

      matches = matches.filter(match => match.compLevel === 'qm');

      const matchesGrouped = [];
      matches.forEach(match => {
        const matchingObject = matchesGrouped.find(
          obj => obj.data[0].match === match.match,
        );
        if (matchingObject) {
          matchingObject.data.push(match);
        } else {
          matchesGrouped.push({
            data: [match],
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

  const [matchesGrouped, setMatchesGrouped] = React.useState([]);

  return (
    <SectionGrid
      itemDimension={90}
      // staticDimension={300}
      // fixed
      // spacing={20}
      sections={matchesGrouped}
      style={styles.gridView}
      renderItem={({item, section, index}) => (
        <View style={[styles.itemContainer, {backgroundColor: item.alliance}]}>
          <Text style={styles.itemName}>{item.team}</Text>
          <Text style={styles.itemCode}>{item.team}</Text>
        </View>
      )}
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}

export default ScoutAssignmentsSpreadsheet;
