import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import {useTheme} from '@react-navigation/native';
import StandardButton from '../components/StandardButton';

function PicklistsManagerScreen({navigation}) {
  const {colors} = useTheme();
  return (
    <View>
      <Text
        style={{
          color: colors.text,
        }}>
        PicklistsManager
      </Text>
      <StandardButton
        color={'blue'}
        text={'Create Picklist'}
        onPress={() => {
          navigation.navigate('Picklist Creator');
        }}
      />
    </View>
  );
}

export default PicklistsManagerScreen;
