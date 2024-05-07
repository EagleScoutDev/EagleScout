import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import React, {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  ScoutcoinLedger as ScoutcoinLedgerDB,
  ScoutcoinLedgerItem,
} from '../../database/ScoutcoinLedger';
import Svg, {Path} from 'react-native-svg';

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
      // padding: 20,
      // marginVertical: 8,
      // marginHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      textAlign: 'center',
    },
    row_container: {
      // flexDirection: 'row', justifyContent: 'space-between',
      backgroundColor: colors.card,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 5,
      borderRadius: 10,
      flex: 1,
    },
    subtext: {
      color: 'gray',
      flex: 1,
      fontSize: 14,
    },
  });

  const rightArrow = () => {
    return (
      <View style={{flex: 1}}>
        <Svg width="24" height="24" fill={colors.text} viewBox="0 0 16 16">
          <Path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={scoutcoinLedger}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: 'red',
              alignItems: 'center',
            }}>
            <View style={styles.row_container}>
              <View style={styles.item}>
                {item.amount_change > 0 ? (
                  <>
                    <Text style={styles.text}>{item.src_user_name}</Text>
                    {rightArrow()}
                    <Text style={styles.text}>{item.dest_user_name}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.text}>{item.dest_user_name}</Text>
                    {rightArrow()}
                    <Text style={styles.text}>{item.src_user_name}</Text>
                  </>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.subtext}>{item.description}</Text>
                <Text style={styles.subtext}>
                  {item.created_at.toLocaleString()}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.text,

                fontWeight: 'bold',
                flex: 0.2,
                textAlign: 'center',
              }}>
              {Math.abs(item.amount_change)}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
