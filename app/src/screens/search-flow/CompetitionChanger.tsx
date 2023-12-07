import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import {useTheme} from '@react-navigation/native';
import CompetitionsDB from '../../database/Competitions';
import {CompetitionReturnData} from '../../database/Competitions';

const CompetitionChanger = ({currentCompId, setCurrentCompId}) => {
  const {colors} = useTheme();
  const [isActive, setIsActive] = useState(false);

  const [competitionName, setCompetitionName] = useState('Loading...');

  const [competitionsList, setCompetitionsList] = useState<
    CompetitionReturnData[]
  >([]);

  const compnameToIcon = (compname: string): string => {
    let split = compname.split(' ');
    let firstLetters = split.map(word => word[0].toUpperCase());
    return firstLetters.join('');
  };

  useEffect(() => {
    CompetitionsDB.getCompetitions().then(competitions => {
      setCompetitionsList(competitions);

      // set the current competition name
      competitions.forEach(competition => {
        if (competition.id === currentCompId) {
          setCompetitionName(competition.name);
        }
      });
    });
  }, []);

  return (
    <View
      style={{
        minHeight: 50,
        zIndex: 100,
        elevation: 100,
      }}>
      <Pressable
        onPress={() => {
          setIsActive(!isActive);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: '2%',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
        }}>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 200,
            width: 40 + (compnameToIcon(competitionName).length - 1) * 20,
            height: 40,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 700,
              fontSize: 20,
              textAlign: 'center',
            }}>
            {compnameToIcon(competitionName)}
          </Text>
        </View>
        <Text
          style={{
            color: colors.text,
            marginHorizontal: '5%',
            fontWeight: 'bold',
          }}>
          {competitionName}
        </Text>
      </Pressable>
      {isActive &&
        competitionsList.map(competition => {
          return (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: '2%',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                maxWidth: '40%',
              }}
              onPress={() => {
                setIsActive(false);
                setCurrentCompId(competition.id);
                setCompetitionName(competition.name);
              }}>
              <View
                style={{
                  backgroundColor:
                    competition.id == currentCompId
                      ? colors.primary
                      : colors.background,
                  width: 20,
                  height: 20,
                  borderRadius: 200,
                  marginHorizontal: '5%',
                }}
              />
              <Text style={{color: colors.text}}>{competition.name}</Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export default CompetitionChanger;
