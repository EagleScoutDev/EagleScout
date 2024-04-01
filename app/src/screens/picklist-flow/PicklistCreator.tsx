import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import PicklistsDB, {PicklistStructure} from '../../database/Picklists';
import StandardModal from '../../components/modals/StandardModal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Svg, {Path} from 'react-native-svg';
import ProfilesDB from '../../database/Profiles';
import {SimpleTeam, TBA} from '../../lib/TBAUtils';
import Competitions from '../../database/Competitions';
import TeamAddingModal from './TeamAddingModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface PicklistTeam {
  team_number: number;
  notes: string;
  tags: string[];
}

function PicklistCreator({
  route,
}: {
  route: {params: {picklist_id: number; currentCompID: number}};
}) {
  const {colors} = useTheme();

  // navigates back to the previous screen once picklist is updated
  const navigation = useNavigation();

  // name of picklist
  const [name, setName] = useState<string | undefined>(undefined);

  // list of all teams at the current competition
  const [possibleTeams, setPossibleTeams] = useState<number[]>([]);

  // modal config
  const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
  const [filter_by_added, setFilterByAdded] = useState(false);

  // list of teams in the picklist
  const [teams_list, setTeamsList] = useState<number[]>([]);

  // used to enable/disable dragging
  const [dragging_active, setDraggingActive] = useState(false);

  // used to store the picklist that is being edited, or undefined if a new picklist is being created
  const [presetPicklist, setPresetPicklist] = useState<PicklistStructure>();

  // id holds the id of the picklist to be edited, or -1 if a new picklist is being created
  const {picklist_id, currentCompID} = route.params;

  // used to display the team name next to the team number
  const [teamNumberToNameMap, setTeamNumberToNameMap] = useState<
    Map<number, string>
  >(new Map());

  // human-readable name of the person who created the picklist
  const [creator_name, setCreatorName] = useState<string>('');

  // live mode, displays strikethroughs if in live picklist making
  // const [live_mode, setLiveMode] = useState<boolean>(false);
  const [removed_teams, setRemovedTeams] = useState<number[]>([]);

  // whether the additional settings collapsing view is open
  const [additionalSettingsOpen, setAdditionalSettingsOpen] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [tbaSimpleTeams, setTBASimpleTeams] = useState<SimpleTeam[]>([]);

  // syncing changes to database indicator
  const [syncing, setSyncing] = useState(false);

  // fetches all teams at the current competition
  useEffect(() => {
    // TODO: @gabor, replace this hardcoded value with the current competition
    Competitions.getCurrentCompetition()
      .then(competition => {
        if (!competition) {
          console.error('No current competition found');
          return;
        }
        Competitions.getCompetitionTBAKey(competition.id)
          .then(tba_key => {
            TBA.getTeamsAtCompetition(tba_key)
              .then(teams => {
                // set teams to just the numbers of the returned teams
                setPossibleTeams(teams.map(team => team.team_number));
                setTBASimpleTeams(teams);

                let temp_map = new Map();

                for (let i = 0; i < teams.length; i++) {
                  temp_map.set(teams[i].team_number, teams[i].nickname);
                }

                setTeamNumberToNameMap(temp_map);
              })
              .catch(error => {
                console.error('Error getting teams at competition:', error);
              });
          })
          .catch(error => {
            console.error('Error getting TBA key for competition:', error);
          });
      })
      .catch(error => {
        console.error('Error getting current competition:', error);
      });
  }, []);

  // if a picklist is being edited, fetches the picklist from the database
  useEffect(() => {
    if (picklist_id !== -1) {
      fetchPicklist();
    }
  }, []);

  // adds header button to fetch picklist from database
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: '5%',
            alignItems: 'center',
          }}>
          {!presetPicklist && (
            <Pressable onPress={() => prepareUpload()}>
              <Svg width="32" height="32" fill={'gray'} viewBox="0 0 16 16">
                <Path
                  fill-rule="evenodd"
                  d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"
                />
                <Path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
              </Svg>
            </Pressable>
          )}
          {syncing && presetPicklist && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
          {!syncing && presetPicklist && (
            <Pressable
              onPress={() => {
                fetchPicklist();
              }}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 16 16"
                stroke="gray"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  marginRight: '5%',
                }}>
                <Path
                  fill={'gray'}
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <Path
                  fill={'gray'}
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                />
              </Svg>
            </Pressable>
          )}
          <Pressable
            style={{marginLeft: '10%'}}
            onPress={() => {
              setDraggingActive(prev => !prev);
              // setLiveMode(false);
            }}>
            <Svg
              width="22"
              height="22"
              fill={dragging_active ? colors.primary : 'dimgray'}
              viewBox="0 0 16 16">
              <Path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <Path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </Svg>
          </Pressable>
        </View>
      ),
    });
  }, [dragging_active, syncing]);

  useEffect(() => {
    saveIfExists();
  }, [teams_list]);

  const fetchPicklist = () => {
    PicklistsDB.getPicklist(String(picklist_id))
      .then(picklist => {
        setPresetPicklist(picklist);
        setName(picklist.name);
        setTeamsList(picklist.teams);
        ProfilesDB.getProfile(picklist.created_by).then(profile => {
          setCreatorName(profile.name);
        });
      })
      .catch(error => {
        console.error('Error getting picklist:', error);
      });
  };

  const renderItemDraggable = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<number>) => {
    return (
      <ScaleDecorator>
        <Pressable
          style={{
            ...styles.team_item_in_list,
            backgroundColor: isActive ? colors.card : colors.background,
          }}
          onPressIn={drag}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: selectedTeam === item ? 'center' : 'center',
              // alignContent: 'center',
            }}>
            <BouncyCheckbox
              isChecked={false}
              disabled={true}
              fillColor={colors.primary}
            />
            <Text style={{color: 'gray'}}>{teams_list.indexOf(item) + 1}</Text>
            <Text style={styles.team_number_displayed}>
              {item} - {teamNumberToNameMap.get(item)}
            </Text>
          </View>
        </Pressable>
      </ScaleDecorator>
    );
  };

  const saveIfExists = () => {
    if (presetPicklist) {
      savePicklistToDB();
    }
  };

  const savePicklistToDB = () => {
    setSyncing(true);
    if (presetPicklist) {
      console.log('user has opted to update picklist');
      PicklistsDB.updatePicklist(picklist_id, teams_list).then(r => {
        console.log('response after updating picklist: ' + r);
        setSyncing(false);
      });
    } else {
      console.log('saving picklist to db');
      PicklistsDB.createPicklist(
        name ?? 'Picklist',
        teams_list,
        currentCompID,
      ).then(r => {
        console.log('response after submitting picklist to db: ' + r);
        setSyncing(false);
      });
    }
  };

  const prepareUpload = () => {
    if (teams_list === presetPicklist?.teams) {
      Alert.alert(
        'No Changes',
        'You have not made any changes to this picklist.',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
      return;
    }

    if (teams_list.length === 0) {
      Alert.alert(
        'Error: Empty Picklist',
        'You have not added any teams to this picklist.',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
      return;
    }

    const additional_message = presetPicklist
      ? ' This will overwrite the picklist "' +
        presetPicklist.name +
        '" by ' +
        creator_name +
        '.'
      : '';
    Alert.alert(
      'Upload Picklist',
      'Are you sure you want to upload this picklist?' + additional_message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upload',
          onPress: () => {
            savePicklistToDB();
            navigation.navigate('PicklistsManager');
          },
        },
      ],
    );
  };

  const addTeam = (team: number) => {
    setTeamsList(prevTeams => [...prevTeams, team]);
  };

  const removeTeam = (team: number) => {
    setTeamsList(prevTeams => prevTeams.filter(t => t !== team));
  };

  const addOrRemoveTeam = (team: number) => {
    if (teams_list.includes(team)) {
      removeTeam(team);
    } else {
      addTeam(team);
    }
  };

  const addOrRemoveTeamLiveMode = (team: number) => {
    if (removed_teams.includes(team)) {
      setRemovedTeams(prev => prev.filter(t => t !== team));
    } else {
      setRemovedTeams(prev => [...prev, team]);
    }
  };

  const styles = StyleSheet.create({
    name_input: {
      color: colors.text,
      fontSize: 30,
      fontFamily: 'monospace',
      fontWeight: name ? 'normal' : '200',
    },
    container: {
      color: colors.text,
      padding: '5%',
      flex: 1,
    },
    team_item: {
      color: colors.text,
      padding: '2%',
      fontSize: 20,
      // borderWidth: 1,
      // borderColor: colors.text,
      // minWidth: '60%',
      // marginRight: '20%',
      textDecorationLine: 'none',
      // backgroundColor: 'grey',
    },
    team_item_in_list: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
      // marginRight: '30%',
    },
    team_item_in_list_selected: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
      // marginRight: '30%',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 8,
    },
    team_item_in_list_not_selected: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: 0.4,
    },
    team_number_strikethrough: {
      flex: 1,
      color: 'gray',
      fontSize: 16,
      marginLeft: '5%',

      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    team_number_displayed: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      marginLeft: '5%',
    },
    team_number_displayed_selected: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      marginLeft: '5%',
    },
    settingsLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: '5%',
      paddingBottom: '10%',
    },
    settingsText: {
      color: colors.text,
      fontWeight: 'bold',
    },
    settings_button: {
      position: 'absolute',
      bottom: '4%',
      right: '6%',
      // borderColor: colors.text,
      // borderWidth: 1,
      padding: '5%',
      borderRadius: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: 'gray',
      borderWidth: 2,
      zIndex: 10,
    },
  });

  return (
    <Pressable style={styles.container} onPress={() => setSelectedTeam(null)}>
      {/*{additionalSettingsOpen && (*/}
      {additionalSettingsOpen && (
        <Pressable
          onPress={() => setAdditionalSettingsOpen(false)}
          style={{
            // position: 'absolute',
            // flex: 1,
            backgroundColor: 'gray',
            zIndex: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.6,
          }}
        />
      )}
      {additionalSettingsOpen && (
        <View
          style={{
            zIndex: 10,
            position: 'absolute',
            right: '5%',
            bottom: '20%',
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: '5%',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            style={styles.settingsLine}
            onPress={() => {
              setAdditionalSettingsOpen(false);
              setTeamAddingModalVisible(true);
            }}>
            <Svg
              width="32"
              height="32"
              fill={teamAddingModalVisible ? colors.primary : colors.text}
              viewBox="0 0 16 16">
              <Path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0" />
            </Svg>
            <Text style={styles.settingsText}>Add/Remove Teams</Text>
          </Pressable>
          {/*<Pressable*/}
          {/*  style={styles.settingsLine}*/}
          {/*  onPress={() => {*/}
          {/*    setLiveMode(!live_mode);*/}
          {/*    setDraggingActive(false);*/}
          {/*  }}>*/}
          {/*  <Svg*/}
          {/*    width="32"*/}
          {/*    height="32"*/}
          {/*    fill={live_mode ? colors.primary : colors.text}*/}
          {/*    viewBox="0 0 16 16">*/}
          {/*    <Path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967" />*/}
          {/*  </Svg>*/}
          {/*  <Text style={styles.settingsText}>Strikethrough Mode</Text>*/}
          {/*</Pressable>*/}
          <Pressable
            style={styles.settingsLine}
            onPress={() => prepareUpload()}>
            <Svg width="32" height="32" fill={colors.text} viewBox="0 0 16 16">
              <Path
                fill-rule="evenodd"
                d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"
              />
              <Path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
            </Svg>
            <Text style={styles.settingsText}>Sync with Cloud</Text>
          </Pressable>
        </View>
      )}

      {teams_list.length !== 0 && (
        <Pressable
          onPress={() => {
            setAdditionalSettingsOpen(!additionalSettingsOpen);
            // console.log('additional settings open: ' + additionalSettingsOpen);
          }}
          style={styles.settings_button}>
          <Svg width="32" height="32" fill={colors.text} viewBox="0 0 16 16">
            <Path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </Svg>
        </Pressable>
      )}

      {/*  if the picklist was made by someone else, show the name and title. else, let the user enter a title */}
      {presetPicklist ? (
        <View>
          <Text style={styles.name_input}>{presetPicklist.name}</Text>
          <Text style={{color: 'gray'}}>By {creator_name}</Text>
        </View>
      ) : (
        <TextInput
          style={styles.name_input}
          multiline={true}
          onPressIn={() => setName('')}
          onChangeText={text => {
            setName(text);
          }}
          value={name}
          defaultValue={'Enter Name'}
        />
      )}

      {teams_list.length === 0 && (
        <Pressable onPress={() => setTeamAddingModalVisible(true)}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: '50%',
            }}>
            Add teams to the picklist
          </Text>
        </Pressable>
      )}
      <TeamAddingModal
        visible={teamAddingModalVisible}
        setVisible={setTeamAddingModalVisible}
        teams_list={teams_list}
        setTeamsList={setTeamsList}
        possibleTeams={possibleTeams}
        addOrRemoveTeam={addOrRemoveTeam}
      />

      {dragging_active ? (
        <DraggableFlatList
          data={teams_list}
          onDragEnd={({data}) => setTeamsList(data)}
          keyExtractor={item => String(item)}
          renderItem={renderItemDraggable}
        />
      ) : (
        <FlatList
          data={teams_list}
          renderItem={({item}) => {
            return (
              <Pressable
                style={
                  selectedTeam === null
                    ? styles.team_item_in_list
                    : item === selectedTeam
                    ? styles.team_item_in_list_selected
                    : styles.team_item_in_list_not_selected
                }
                onPress={() => {
                  if (selectedTeam === null) {
                    setSelectedTeam(item);
                  } else if (selectedTeam !== item) {
                    setSelectedTeam(null);
                  }
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: selectedTeam === item ? 'center' : 'center',
                    // alignContent: 'center',
                  }}>
                  <BouncyCheckbox
                    isChecked={removed_teams.includes(item)}
                    disabled={item !== selectedTeam && selectedTeam !== null}
                    fillColor={colors.primary}
                    onPress={() => {
                      addOrRemoveTeamLiveMode(item);
                      ReactNativeHapticFeedback.trigger('notificationSuccess', {
                        enableVibrateFallback: true,
                        ignoreAndroidSystemSettings: false,
                      });
                    }}
                  />
                  <Text style={{color: 'gray'}}>
                    {teams_list.indexOf(item) + 1}
                  </Text>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text
                      style={
                        removed_teams.includes(item)
                          ? styles.team_number_strikethrough
                          : item === selectedTeam
                          ? styles.team_number_displayed_selected
                          : styles.team_number_displayed
                      }>
                      {item} - {teamNumberToNameMap.get(item)}
                    </Text>
                    {selectedTeam === item && (
                      <TextInput
                        inputMode={'text'}
                        placeholder={'Notes'}
                        placeholderTextColor={'gray'}
                        multiline={true}
                        // text color
                        style={{
                          color: colors.text,
                          backgroundColor: colors.card,
                          marginLeft: '5%',
                          // padding: '4%',
                          // borderRadius: 10,
                          // margin: '5%',
                          // alignSelf: 'flex-start',
                          // flex: 1,
                        }}
                      />
                    )}
                  </View>
                </View>
                {selectedTeam === item && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-end',
                    }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('Search', {
                          screen: 'TeamViewer',
                          params: {
                            team: tbaSimpleTeams.find(
                              team => team.team_number === item,
                            ),
                            competitionId: currentCompID,
                          },
                        });
                      }}>
                      <Text style={{color: 'gray', padding: '5%'}}>
                        Learn More
                      </Text>
                    </Pressable>
                    <Pressable>
                      <Text
                        style={{
                          color: 'red',
                          textAlign: 'right',
                          padding: '5%',
                        }}
                        onPress={() => {
                          Alert.alert(
                            'Remove Team',
                            'Are you sure you want to remove this team from the picklist?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Remove',
                                onPress: () => {
                                  removeTeam(item);
                                  setSelectedTeam(null);
                                },
                              },
                            ],
                          );
                        }}>
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          }}
          keyExtractor={item => String(item)}
        />
      )}
    </Pressable>
  );
}

export default PicklistCreator;
