import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, LayoutAnimation} from 'react-native';

import {useTheme} from '@react-navigation/native';
import CompetitionsDB from '../../database/Competitions';
import {CompetitionReturnData} from '../../database/Competitions';
import Svg, {Path} from 'react-native-svg';
import SearchModal from './SearchModal';

const CompetitionChanger = ({currentCompId, setCurrentCompId}) => {
  const {colors} = useTheme();
  const [isActive, setIsActive] = useState(false);

  const [competitionName, setCompetitionName] = useState('Loading...');

  const [competitionsList, setCompetitionsList] = useState<
    CompetitionReturnData[]
  >([]);

  const [searchActive, setSearchActive] = useState<boolean>(false);

  const compnameToIcon = (compname: string): string => {
    let split = compname.split(' ');
    let firstLetters = split.map(word => word[0].toUpperCase());
    return firstLetters.join('');
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isActive]);

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
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2%',
          marginHorizontal: '3%',
        }}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setIsActive(!isActive);
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
                fontSize: 20,
                textAlign: 'center',
                fontWeight: '700',
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
          <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <Path
              fill="gray"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </Svg>
        </Pressable>
        <Pressable
          onPress={() => {
            setSearchActive(true);
          }}>
          <Svg width={'20'} height="20" viewBox="0 0 16 16">
            <Path
              fill={searchActive ? colors.primary : 'gray'}
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </Svg>
        </Pressable>
      </View>
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
                    competition.id === currentCompId
                      ? colors.primary
                      : colors.background,
                  width: 20,
                  height: 20,
                  borderRadius: 200,
                  // marginHorizontal: '5%',
                  marginLeft: '5%',
                  marginRight: '10%',
                }}
              />
              <Text style={{color: colors.text}}>{competition.name}</Text>
            </Pressable>
          );
        })}

      <SearchModal
        searchActive={searchActive}
        setSearchActive={setSearchActive}
      />
    </View>
  );
};

export default CompetitionChanger;
