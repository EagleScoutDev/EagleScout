import {Pressable, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export const Tabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: '2%',
        paddingHorizontal: '5%',
      }}>
      {tabs.map(tab => (
        <Pressable
          onPress={() => {
            setSelectedTab(tab);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '2%',
            backgroundColor:
              selectedTab === tab ? colors.text : colors.background,
            borderRadius: 10,
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: selectedTab === tab ? colors.background : colors.text,
              fontWeight: selectedTab === tab ? 'bold' : 'normal',
            }}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
