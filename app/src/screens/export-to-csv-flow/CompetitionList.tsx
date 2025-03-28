import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {CompetitionReturnData} from '../../database/Competitions';

export const CompetitionList = ({
  competitionList,
  competitionsLoading,
  processing,
  onCompetitionPress,
}: {
  competitionList: CompetitionReturnData[];
  competitionsLoading: boolean;
  processing: boolean;
  onCompetitionPress: (comp: CompetitionReturnData) => void;
}) => {
  const {colors} = useTheme();
  return (
    <ScrollView>
      {competitionsLoading && (
        <ActivityIndicator size="large" color={colors.text} />
      )}
      {competitionList.length === 0 && !competitionsLoading && (
        <Text style={{color: colors.text, textAlign: 'center'}}>
          No competitions found
        </Text>
      )}
      {competitionList.map((comp, index) => (
        <TouchableOpacity
          key={comp.id}
          disabled={processing}
          onPress={() => {
            onCompetitionPress(comp);
          }}
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor:
              index % 2 === 0 ? colors.border : colors.background,
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            {comp.name} ({new Date(comp.startTime).getFullYear()})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
