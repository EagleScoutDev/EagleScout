import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';

const CompetitionViewer = ({resetCompID, competition}) => {
  const {colors} = useTheme();

  return (
    <View>
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
        {new Date(competition.start_time).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          // year: 'numeric',
        })}{' '}
        -{' '}
        {new Date(competition.end_time).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}{' '}
        ({new Date(competition.end_time).getFullYear()})
      </Text>
    </View>
  );
};

export default CompetitionViewer;
