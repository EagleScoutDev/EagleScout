import {FlatList, Modal, Pressable, Text, TextInput, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SimpleTeam} from '../../lib/TBAUtils';

enum FilterState {
  TEAM,
  MATCH,
  PERSON,
}

// write the parameters
interface SearchModalProps {
  searchActive: boolean;
  setSearchActive: (searchActive: boolean) => void;
  teams: SimpleTeam[];
}

const SearchModal = ({
  searchActive,
  setSearchActive,
  teams,
}: SearchModalProps) => {
  const {colors} = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(FilterState.TEAM);
  const navigation = useNavigation();

  const getSearchPrompt = (): string => {
    switch (filterState) {
      case FilterState.TEAM:
        return 'Try "114" or "Eaglestrike"';
      case FilterState.MATCH:
        return 'Try "10"';
      case FilterState.PERSON:
        return 'Try "John" or "John Smith"';
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={searchActive}
      onRequestClose={() => {
        setSearchActive(false);
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: '10%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2%',
            marginTop: '3%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              flex: 1,
              paddingHorizontal: '2%',
            }}>
            <Svg width={'20'} height="20" viewBox="0 0 16 16">
              <Path
                fill={'gray'}
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </Svg>
            <TextInput
              style={{
                marginHorizontal: '4%',
                height: 40,
                color: colors.text,
                flex: 1,
              }}
              onChangeText={text => setSearchTerm(text)}
              value={searchTerm}
              keyboardType={
                filterState === FilterState.MATCH ? 'numeric' : 'default'
              }
              placeholder={getSearchPrompt()}
              onEndEditing={() => {
                console.log('onEndEditing');
              }}
            />
          </View>
          <Pressable
            style={{
              marginLeft: '5%',
              marginRight: '5%',
            }}
            onPress={() => setSearchActive(false)}>
            <Text
              style={{
                color: colors.text,
              }}>
              Cancel
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: '2%',
          }}>
          <Pressable
            onPress={() => {
              setFilterState(FilterState.TEAM);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: '2%',
              backgroundColor:
                filterState === FilterState.TEAM
                  ? colors.text
                  : colors.background,
              borderRadius: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color:
                  filterState === FilterState.TEAM
                    ? colors.background
                    : colors.text,
                fontWeight:
                  filterState === FilterState.TEAM ? 'bold' : 'normal',
              }}>
              Team
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilterState(FilterState.MATCH);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: '2%',
              backgroundColor:
                filterState === FilterState.MATCH
                  ? colors.text
                  : colors.background,
              borderRadius: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color:
                  filterState === FilterState.MATCH
                    ? colors.background
                    : colors.text,
                fontWeight:
                  filterState === FilterState.MATCH ? 'bold' : 'normal',
              }}>
              Match
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilterState(FilterState.PERSON);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: '2%',
              backgroundColor:
                filterState === FilterState.PERSON
                  ? colors.text
                  : colors.background,
              borderRadius: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color:
                  filterState === FilterState.PERSON
                    ? colors.background
                    : colors.text,
                fontWeight:
                  filterState === FilterState.PERSON ? 'bold' : 'normal',
              }}>
              Person
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: colors.border,
          }}
        />
        {filterState === FilterState.TEAM && (
          <FlatList
            data={teams.filter(team => {
              return (
                team.team_number.toString().includes(searchTerm) ||
                team.nickname.toLowerCase().includes(searchTerm.toLowerCase())
              );
            })}
            renderItem={({item}) => {
              return (
                <Pressable
                  onPress={() => {
                    setSearchActive(false);
                    navigation.navigate('TeamViewer', {
                      team: item.team_number,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '4%',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}>
                  <Text style={{color: colors.text, flex: 1, fontSize: 16}}>
                    {item.team_number}
                  </Text>
                  <Text style={{color: colors.text, flex: 5, fontSize: 16}}>
                    {item.nickname}
                  </Text>
                  <Svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{
                      flex: 1,
                    }}>
                    <Path
                      fill="gray"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </Svg>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
};

export default SearchModal;
