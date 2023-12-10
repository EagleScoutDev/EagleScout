import {FlatList, Modal, Pressable, Text, TextInput, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import React, {useEffect, useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SimpleTeam} from '../../lib/TBAUtils';
import {ScoutReportReturnData} from '../../database/ScoutReports';
import ProfilesDB, {ProfilesReturnData} from '../../database/Profiles';
import {Dropdown} from 'react-native-element-dropdown';

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
  reportsByMatch: Map<number, ScoutReportReturnData[]>;
  navigateIntoReport: (report: ScoutReportReturnData) => void;
}

const SearchModal = ({
  searchActive,
  setSearchActive,
  teams,
  reportsByMatch,
  navigateIntoReport,
}: SearchModalProps) => {
  const {colors} = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(FilterState.TEAM);
  const navigation = useNavigation();

  // parsed from reports, then used to find names
  const [userIds, setUserIds] = useState<string[]>([]);

  const [users, setUsers] = useState<ProfilesReturnData[]>([]);

  const [selectedUser, setSelectedUser] = useState<ProfilesReturnData | null>(
    null,
  );

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

  useEffect(() => {
    let temp: Set<string> = new Set<string>();
    reportsByMatch.forEach((reports, match) => {
      reports.forEach(report => {
        if (!temp.has(report.userId)) {
          temp.add(report.userId);
        }
      });
    });
    setUserIds(Array.from(temp));
  }, [reportsByMatch]);

  useEffect(() => {
    if (userIds.length === 0) {
      return;
    }

    let temp: ProfilesReturnData[] = [];

    for (let i = 0; i < userIds.length; i++) {
      ProfilesDB.getProfile(userIds[i]).then(profile => {
        temp.push(profile);
      });
    }

    // sort temp by first name
    temp.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });

    setUsers(temp);
  }, [userIds]);

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
              placeholderTextColor={'gray'}
              placeholder={getSearchPrompt()}
              onEndEditing={() => {
                console.log('onEndEditing');
              }}
            />
            {searchTerm.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearchTerm('');
                }}>
                <Svg width="16" height="16" fill="grey" viewBox="0 0 16 16">
                  <Path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </Svg>
              </Pressable>
            )}
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
                      team: item,
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
        {filterState === FilterState.MATCH && (
          <FlatList
            data={Array.from(reportsByMatch.keys()).filter(match => {
              return match.toString().includes(searchTerm);
            })}
            renderItem={({item}) => {
              return (
                <View>
                  <View
                    style={{
                      minWidth: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: '3%',
                    }}>
                    <Text
                      style={{
                        color: 'grey',
                        marginHorizontal: '4%',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      {item}
                    </Text>
                    <View
                      style={{
                        height: 2,
                        width: '100%',
                        backgroundColor: colors.border,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      // make it like a 3x2 grid
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {reportsByMatch.get(item)?.map((report, index) => {
                      return (
                        <Pressable
                          onPress={() => {
                            setSearchActive(false);
                            navigateIntoReport(report);
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor:
                              index < 3 ? 'crimson' : 'dodgerblue',
                            margin: '2%',
                            padding: '6%',
                            borderRadius: 10,
                            minWidth: '25%',
                          }}>
                          <Text
                            style={{
                              color: colors.text,
                              fontWeight: 'bold',
                              textAlign: 'center',
                              flex: 1,
                            }}>
                            {report.teamNumber}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />
        )}
        {filterState === FilterState.PERSON && users.length > 0 && (
          <View style={{flex: 1, marginBottom: '10%'}}>
            <Dropdown
              data={users.map(user => {
                return {
                  label: user.name,
                  value: user.id,
                };
              })}
              labelField={'label'}
              valueField={'value'}
              onChange={item => {
                let newSelectedUser: ProfilesReturnData | null = null;
                users.forEach(user => {
                  if (user.id === item.value) {
                    newSelectedUser = user;
                  }
                });
                setSelectedUser(newSelectedUser);
              }}
              activeColor={colors.card}
              style={{
                borderRadius: 10,
                padding: '2%',
                margin: '2%',
                backgroundColor: colors.background,
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
              placeholder={'Select a user'}
              value={{
                label: selectedUser?.name ?? 'Select a user',
                value: selectedUser?.id ?? '',
              }}
              renderLeftIcon={() => {
                return (
                  <Svg
                    style={{
                      marginRight: '4%',
                    }}
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16">
                    <Path fill="gray" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <Path
                      fill="gray"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </Svg>
                );
              }}
            />
            {selectedUser && (
              <FlatList
                data={Array.from(reportsByMatch.keys()).filter(match => {
                  return reportsByMatch
                    .get(match)
                    ?.some(report => report.userId === selectedUser?.id);
                })}
                renderItem={({item}) => {
                  return (
                    <View>
                      <View
                        style={{
                          minWidth: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: '3%',
                        }}>
                        <Text
                          style={{
                            color: 'grey',
                            marginHorizontal: '4%',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          {item}
                        </Text>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor: colors.border,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          // make it like a 3x2 grid
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        {reportsByMatch.get(item)?.map((report, index) => {
                          if (report.userId === selectedUser?.id) {
                            return (
                              <Pressable
                                onPress={() => {
                                  setSearchActive(false);
                                  navigateIntoReport(report);
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  backgroundColor:
                                    index < 3 ? 'crimson' : 'dodgerblue',
                                  margin: '2%',
                                  padding: '6%',
                                  borderRadius: 10,
                                  minWidth: '25%',
                                }}>
                                <Text
                                  style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    flex: 1,
                                  }}>
                                  {report.teamNumber}
                                </Text>
                              </Pressable>
                            );
                          }
                        })}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default SearchModal;
