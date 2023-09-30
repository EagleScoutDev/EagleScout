import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import ScoutingReportsList from './ScoutingReportsList';

const CompetitionViewer = ({resetCompID, competition}) => {
  const {colors} = useTheme();

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={resetCompID}>
        <Text
          style={{
            textAlign: 'right',
            padding: 15,
            color: colors.primary,
            fontSize: 17,
            fontWeight: 'bold',
          }}>
          See Another Competition
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: colors.text,
          textAlign: 'center',
          paddingHorizontal: '5%',
          paddingTop: '5%',
        }}>
        {competition.name}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'gray',
          textAlign: 'center',
          paddingBottom: '5%',
        }}>
        {new Date(competition.startTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          // year: 'numeric',
        })}{' '}
        -{' '}
        {new Date(competition.endTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}{' '}
        ({new Date(competition.endTime).getFullYear()})
      </Text>

      <ScoutingReportsList competition={competition} />
    </View>
  );
};

export default CompetitionViewer;
