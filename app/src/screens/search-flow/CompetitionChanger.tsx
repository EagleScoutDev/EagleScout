import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import CompetitionsDB from '../../database/Competitions';
import {CompetitionReturnData} from '../../database/Competitions';
import Svg, {Path} from 'react-native-svg';
import SearchModal from './SearchModal';
import {Dropdown} from 'react-native-element-dropdown';
import Competitions from '../../database/Competitions';

interface CompetitionChangerProps {
  currentCompId: number;
  setCurrentCompId: (id: number) => void;
  loading: boolean;
}

const CompetitionChanger = ({
  currentCompId,
  setCurrentCompId,
  loading,
}: CompetitionChangerProps) => {
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isActive]);

  useEffect(() => {
    if (currentCompId === -1) {
      CompetitionsDB.getCurrentCompetition().then(competition => {
        if (competition != null) {
          setCurrentCompId(competition.id);
        } else {
          // TODO: handle when there is no current competition
          setCurrentCompId(-1);
        }
      });
    }
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
        flex: 1,
      }}>
      <Dropdown
        data={competitionsList.map(competition => {
          return {
            label: competition.name,
            value: competition.id,
          };
        })}
        labelField={'label'}
        valueField={'value'}
        disable={competitionsList.length === 0}
        placeholderStyle={{
          color: colors.text,
        }}
        placeholder={
          loading
            ? 'Loading...'
            : competitionsList.length > 0
            ? 'Select Competition'
            : 'No competitions found'
        }
        onChange={item => {
          setCurrentCompId(item.value);
          setCompetitionName(item.label);
          setIsActive(false);
        }}
        activeColor={colors.card}
        style={{
          borderRadius: 10,
          padding: '2%',
          marginVertical: '2%',
          backgroundColor: colors.background,
          paddingLeft: '6%',
        }}
        selectedTextStyle={{
          color: colors.text,
          fontWeight: 'bold',
          backgroundColor: colors.background,
        }}
        containerStyle={{
          borderRadius: 10,
          backgroundColor: colors.background,
        }}
        itemContainerStyle={{
          borderRadius: 10,
          borderBottomWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        }}
        itemTextStyle={{
          color: colors.text,
        }}
        value={{
          label: competitionName,
          value: currentCompId,
        }}
        renderLeftIcon={() => {
          if (loading) {
            return (
              <ActivityIndicator
                style={{marginRight: '4%'}}
                size={'small'}
                color={colors.text}
              />
            );
          }
          // return (
          //   <View
          //     style={{
          //       backgroundColor: colors.card,
          //       borderRadius: 200,
          //
          //       width: 40 + (compnameToIcon(competitionName).length - 1) * 20,
          //       height: 40,
          //       justifyContent: 'center',
          //       marginRight: '4%',
          //     }}>
          //     <Text
          //       style={{
          //         color: colors.text,
          //         fontSize: 20,
          //         textAlign: 'center',
          //         fontWeight: '700',
          //       }}>
          //       {competitionName === 'Loading...'
          //         ? ''
          //         : compnameToIcon(competitionName)}
          //     </Text>
          //   </View>
          // );
        }}
      />
    </View>
  );
};

export default CompetitionChanger;
