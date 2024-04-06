import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  ScoutcoinLedger as ScoutcoinLedgerDB,
  ScoutcoinLedgerItem,
} from '../../database/ScoutcoinLedger';

export const ScoutcoinLedger = () => {
  const [scoutcoinLedger, setScoutcoinLedger] = useState<ScoutcoinLedgerItem[]>(
    [],
  );
  const {colors} = useTheme();
  useEffect(() => {
    ScoutcoinLedgerDB.getLogs().then(logs => {
      setScoutcoinLedger(logs);
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10,
    },
    item: {
      backgroundColor: colors.card,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={scoutcoinLedger}
        renderItem={({item}) => (
          <View style={styles.item}>
            {item.amount_change > 0 ? (
              <Text>
                {item.src_user_name} {'->'} {item.dest_user_name}
              </Text>
            ) : (
              <Text>
                {item.dest_user_name} {'->'} {item.src_user_name}
              </Text>
            )}
            <Text>{item.description}</Text>
            <Text>{item.created_at.toString()}</Text>
            <Text>{Math.abs(item.amount_change)}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
