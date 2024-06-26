import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import PicklistsDB, {
  PicklistStructure,
  PicklistTeam,
} from '../../database/Picklists';
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
import TagsModal from './TagsModal';
import {TagsDB, TagStructure} from '../../database/Tags';
import TagColorChangeModal from './TagColorChangeModal';
import DoNotPickModal from './DoNotPickModal';
import {getIdealTextColor} from '../../lib/ColorReadability';

function PicklistCreator({
  route,
}: {
  route: {params: {picklist_id: number; currentCompID: number}};
}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  // name of picklist
  const [name, setName] = useState<string | undefined>(undefined);

  // human-readable name of the person who created the picklist
  const [creator_name, setCreatorName] = useState<string>('');

  // used to display the team name next to the team number
  const [teamNumberToNameMap, setTeamNumberToNameMap] = useState<
    Map<number, string>
  >(new Map());

  // screen config
  const [dragging_active, setDraggingActive] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // modals
  const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
  const [createTagModal, setCreateTagModal] = useState(false);
  const [showDNPModal, setShowDNPModal] = useState(false);

  // list of teams at the current competition
  const [tbaSimpleTeams, setTBASimpleTeams] = useState<SimpleTeam[]>([]);

  // list of teams in the picklist -- this is the actual picklist
  const [teams_list, setTeamsList] = useState<PicklistTeam[]>([]);

  // id holds the id of the picklist to be edited, or -1 if a new picklist is being created
  const {picklist_id, currentCompID} = route.params;

  // used to store the picklist that is being edited, or undefined if a new picklist is being created
  const [presetPicklist, setPresetPicklist] = useState<PicklistStructure>();

  // used to track which teams have been selected already
  const [removed_teams, setRemovedTeams] = useState<PicklistTeam[]>([]);

  // currently highlighted team
  const [selectedTeam, setSelectedTeam] = useState<PicklistTeam | null>(null);

  // set of tags
  const [uniqueTags, setUniqueTags] = useState<Set<number>>(new Set());
  const [allTags, setAllTags] = useState<TagStructure[]>([]);
  const [filteredTags, setFilteredTags] = useState<Set<number>>(new Set());
  const [tagColorChangeModalVisible, setTagColorChangeModalVisible] =
    useState(false);
  const [selectedTagForColorChange, setSelectedTagForColorChange] = useState<
    TagStructure | undefined
  >(undefined);

  useEffect(() => {
    console.log('picklist_id: ', picklist_id);
    if (picklist_id !== -1) {
      TagsDB.getTagsForPicklist(picklist_id).then(tags => {
        setAllTags(tags);
      });
    }
  }, [createTagModal, tagColorChangeModalVisible]);

  // fetches all teams at the current competition for use in the team adding modal, name map
  useEffect(() => {
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
                setTBASimpleTeams(teams);
                initializeNumberToNameMap(teams);
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

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const setSelectedTeamWithAnimation = (
    team: React.SetStateAction<PicklistTeam | null>,
  ) => {
    if (team) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setSelectedTeam(team);
  };

  // sets up the map that will be used to display team names next to team numbers
  const initializeNumberToNameMap = (teams: SimpleTeam[]) => {
    let temp_map = new Map();

    for (let i = 0; i < teams.length; i++) {
      temp_map.set(teams[i].team_number, teams[i].nickname);
    }

    setTeamNumberToNameMap(temp_map);
  };

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

  // when the picklist is being edited, ensures that the picklist has been uploaded before trying a save
  useEffect(() => {
    saveIfExists();
  }, [teams_list]);

  // gets latest picklist from db
  const fetchPicklist = () => {
    PicklistsDB.getPicklist(String(picklist_id))
      .then(picklist => {
        setPresetPicklist(picklist);
        setName(picklist.name);
        setTeamsList(picklist.teams);
        ProfilesDB.getProfile(picklist.created_by).then(profile => {
          setCreatorName(profile.name);
        });

        let temp = new Set<number>();
        picklist.teams.forEach(t => {
          t.tags.forEach(tag => {
            temp.add(tag);
          });
        });
        setUniqueTags(temp);
      })
      .catch(error => {
        console.error('Error getting picklist:', error);
      });
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
    let newTeam: PicklistTeam = {
      dnp: false,
      tags: [],
      team_number: team,
      notes: '',
    };
    setTeamsList(prevTeams => [...prevTeams, newTeam]);
  };

  const removeTeam = (team: number) => {
    setTeamsList(prevTeams => prevTeams.filter(t => t.team_number !== team));
  };

  // only used by TeamAddingModal
  const addOrRemoveTeam = (team: SimpleTeam) => {
    if (teams_list.some(t => t.team_number === team.team_number)) {
      removeTeam(team.team_number);
    } else {
      addTeam(team.team_number);
    }
  };

  const addOrRemoveTeamLiveMode = (team: PicklistTeam) => {
    if (removed_teams.includes(team)) {
      setRemovedTeams(prev => prev.filter(t => t !== team));
    } else {
      setRemovedTeams(prev => [...prev, team]);
    }
  };

  const addTag = (team: PicklistTeam, tag: number) => {
    let newTeams = teams_list.map(t => {
      if (t === team && !t.tags.includes(tag)) {
        t.tags.push(tag);
      }
      return t;
    });
    setTeamsList(newTeams);

    let newTags = new Set(uniqueTags);
    newTags.add(tag);
    setUniqueTags(newTags);
  };

  const removeTag = (team: PicklistTeam, tag: number) => {
    let newTeams = teams_list.map(t => {
      if (t === team) {
        t.tags = t.tags.filter(a => a !== tag);
      }
      return t;
    });
    setTeamsList(newTeams);

    fillUniqueTags();
  };

  // sets up the set of unique tags
  const fillUniqueTags = () => {
    let temp = new Set<number>();
    teams_list.forEach(t => {
      t.tags.forEach(tag => {
        temp.add(tag);
      });
    });
    setUniqueTags(temp);
  };

  const deleteTag = (tag: number) => {
    for (let team of teams_list) {
      removeTag(team, tag);
    }

    TagsDB.deleteTag(tag).then(() => {
      TagsDB.getTagsForPicklist(picklist_id).then(tags => {
        setAllTags(tags);
      });
    });
  };

  const getTagFromTagId = (tagId: number) => {
    return allTags.find(tag => Number.parseInt(tag.id ?? '', 10) === tagId);
  };

  const addToDNP = (team: SimpleTeam) => {
    let newTeams = teams_list;

    let specificTeam = teams_list.find(t => t.team_number === team.team_number);
    if (!specificTeam) {
      newTeams.push({
        team_number: team.team_number,
        dnp: true,
        tags: [],
        notes: '',
      });
    } else {
      newTeams = newTeams.filter(t => t.team_number !== team.team_number);
    }

    setTeamsList(newTeams);
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
    team_item_in_list: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
    },
    team_item_in_list_selected: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 8,
    },
    // the style taken on by every team item in the list that is not selected, when a team has been selected
    team_item_in_list_not_selected: {
      padding: '2%',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: 0.4,
    },
    team_number_strikethrough: {
      flex: 1,
      color: 'gray',
      fontSize: 18,
      marginLeft: '5%',
    },
    team_number_displayed: {
      // flex: 1,
      color: colors.text,
      fontSize: 18,
      marginLeft: '5%',
    },
    modal_activation_button_container: {
      width: '16%',
      height: 30,
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: '2%',
      margin: '2%',
      marginHorizontal: '2%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  });

  const renderItemDraggable = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<PicklistTeam>) => {
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
              alignItems: 'center',
            }}>
            <BouncyCheckbox
              isChecked={false}
              disabled={true}
              fillColor={colors.primary}
            />
            <Text style={{color: 'gray'}}>{teams_list.indexOf(item) + 1}</Text>
            <Text
              style={{
                ...styles.team_number_displayed,
                flex: 1,
              }}>
              {item.team_number}
              {teamNumberToNameMap.size === 0 ? '' : ' '}
              {teamNumberToNameMap.get(item.team_number)}
            </Text>
            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              {item.tags.length > 0 &&
                item.tags.map(tag => {
                  return (
                    <View
                      style={{
                        borderRadius: 10,
                        backgroundColor: getTagFromTagId(tag)?.color,
                        width: 14,
                        height: 14,
                        margin: '2%',
                        opacity: removed_teams.includes(item) ? 0.4 : 1,
                      }}
                    />
                  );
                })}
            </View>
          </View>
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => setSelectedTeamWithAnimation(null)}>
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
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={() => setTeamAddingModalVisible(true)}
          style={styles.modal_activation_button_container}>
          <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <Path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z" />
          </Svg>
          <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <Path
              fill-rule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
            />
          </Svg>
        </Pressable>

        <Pressable
          onPress={() => {
            setCreateTagModal(true);
            setSelectedTeamWithAnimation(null);
          }}
          style={styles.modal_activation_button_container}>
          <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <Path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </Svg>
          <Svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <Path
              fill-rule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
            />
          </Svg>
        </Pressable>
        <Pressable
          onPress={() => {
            setShowDNPModal(true);
          }}
          style={styles.modal_activation_button_container}>
          <Svg
            width="16"
            height="16"
            fill={teams_list.some(a => a.dnp) ? 'red' : 'gray'}
            viewBox="0 0 16 16">
            <Path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <Path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </Svg>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          // if the contents of the view are too wide, they will be wrapped and placed below the previous line
          flexWrap: 'wrap',
          // the contents of the view are centered along the horizontal axis
        }}>
        {[...uniqueTags].map(tag => {
          return (
            <Pressable
              key={tag}
              onLongPress={() => {
                setTagColorChangeModalVisible(true);
                setSelectedTagForColorChange(getTagFromTagId(tag));
              }}
              onPress={() => {
                if (filteredTags.has(tag)) {
                  let newTags = new Set(filteredTags);
                  newTags.delete(tag);
                  setFilteredTags(newTags);
                } else {
                  let newTags = new Set(filteredTags);
                  newTags.add(tag);
                  setFilteredTags(newTags);
                }
              }}
              style={{
                backgroundColor: filteredTags.has(tag)
                  ? getTagFromTagId(tag)?.color
                  : colors.card,
                paddingHorizontal: '4%',
                paddingVertical: '2%',
                margin: 4,
                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderWidth: 2,
                borderColor: getTagFromTagId(tag)?.color,
              }}>
              <Text
                style={{
                  color: filteredTags.has(tag)
                    ? getIdealTextColor(getTagFromTagId(tag)?.color ?? '')
                    : colors.text,
                  fontWeight: filteredTags.has(tag) ? 'bold' : 'normal',
                }}>
                {allTags.find(t => Number.parseInt(t.id ?? '', 10) === tag)
                  ?.name ?? 'Unknown'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TagsModal
        visible={createTagModal}
        setVisible={setCreateTagModal}
        picklist_id={picklist_id}
        selected_team={selectedTeam}
        addTag={addTag}
        removeTag={removeTag}
        issueDeleteCommand={deleteTag}
      />
      <TagColorChangeModal
        visible={tagColorChangeModalVisible}
        setVisible={setTagColorChangeModalVisible}
        tag={selectedTagForColorChange}
      />
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
        teamsAtCompetition={tbaSimpleTeams}
        addOrRemoveTeam={addOrRemoveTeam}
      />
      <DoNotPickModal
        visible={showDNPModal}
        setVisible={setShowDNPModal}
        teams={teams_list}
        teamsAtCompetition={tbaSimpleTeams}
        numbersToNames={teamNumberToNameMap}
        addToDNP={addToDNP}
      />
      {dragging_active ? (
        <DraggableFlatList
          data={teams_list}
          onDragEnd={({data}) => setTeamsList(data)}
          keyExtractor={item => String(item.team_number)}
          renderItem={renderItemDraggable}
        />
      ) : (
        <FlatList
          data={teams_list.filter(
            t =>
              filteredTags.size === 0 ||
              filteredTags.size ===
                t.tags.filter(tag => filteredTags.has(tag)).length,
          )}
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
                    setSelectedTeamWithAnimation(item);
                  } else if (selectedTeam !== item) {
                    setSelectedTeamWithAnimation(null);
                  }
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // alignSelf: 'flex-start',
                      // alignContent: 'flex-start',
                      alignSelf: 'flex-start',
                    }}>
                    <BouncyCheckbox
                      isChecked={removed_teams.includes(item)}
                      disabled={item !== selectedTeam && selectedTeam !== null}
                      fillColor={colors.primary}
                      onPress={() => {
                        addOrRemoveTeamLiveMode(item);
                        ReactNativeHapticFeedback.trigger(
                          'notificationSuccess',
                          {
                            enableVibrateFallback: true,
                            ignoreAndroidSystemSettings: false,
                          },
                        );
                      }}
                    />
                    <Text style={{color: 'gray'}}>
                      {teams_list.indexOf(item) + 1}
                    </Text>
                    <Text
                      style={
                        removed_teams.includes(item)
                          ? {
                              ...styles.team_number_displayed,
                              color: 'gray',
                              textDecorationLine: 'line-through',
                              textDecorationStyle: 'solid',
                            }
                          : item.dnp
                          ? {...styles.team_number_displayed, color: 'red'}
                          : styles.team_number_displayed
                      }>
                      {item.team_number}
                      {teamNumberToNameMap.size === 0 ? '' : ' - '}
                      {teamNumberToNameMap.get(item.team_number)}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                      }}>
                      {item.tags.length > 0 &&
                        item.tags.map(tag => {
                          return (
                            <View
                              style={{
                                borderRadius: 10,
                                backgroundColor: getTagFromTagId(tag)?.color,
                                width: 14,
                                height: 14,
                                margin: '2%',
                                opacity: removed_teams.includes(item) ? 0.4 : 1,
                              }}
                            />
                          );
                        })}
                    </View>
                  </View>
                  {selectedTeam === item && (
                    <TextInput
                      inputMode={'text'}
                      placeholder={'Notes'}
                      onChangeText={text => {
                        let newTeams = teams_list.map(t => {
                          if (t === item) {
                            t.notes = text;
                          }
                          return t;
                        });
                        setTeamsList(newTeams);
                      }}
                      defaultValue={item.notes}
                      placeholderTextColor={'gray'}
                      multiline={true}
                      style={{
                        color: colors.text,
                        backgroundColor: colors.card,
                        padding: '2%',
                        marginTop: '2%',
                      }}
                    />
                  )}
                </View>
                {selectedTeam === item && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-end',
                      paddingVertical: '2%',
                      // alignItems: 'center',
                      // justifyContent: 'space-around',
                    }}>
                    <Pressable
                      style={{paddingHorizontal: '4%', flex: 0}}
                      onPress={() => {
                        setCreateTagModal(true);
                      }}>
                      <Svg
                        width="24"
                        height="24"
                        fill="gray"
                        viewBox="0 0 16 16">
                        <Path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                      </Svg>
                    </Pressable>
                    <Pressable
                      style={{paddingHorizontal: '4%', flex: 0}}
                      onPress={() => addToDNP(item)}>
                      <Svg
                        width="24"
                        height="24"
                        fill={item.dnp ? 'red' : 'gray'}
                        viewBox="0 0 16 16">
                        <Path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                        <Path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                      </Svg>
                    </Pressable>
                    <Pressable
                      style={{paddingHorizontal: '4%', flex: 0}}
                      onPress={() => {
                        navigation.navigate('Search', {
                          screen: 'TeamViewer',
                          params: {
                            team: tbaSimpleTeams.find(
                              team => team.team_number === item.team_number,
                            ),
                            competitionId: currentCompID,
                          },
                        });
                      }}>
                      <Svg
                        width="24"
                        height="24"
                        fill="gray"
                        viewBox="0 0 16 16">
                        <Path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <Path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      </Svg>
                    </Pressable>
                    <Pressable
                      style={{paddingHorizontal: '4%', flex: 0}}
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
                                removeTeam(item.team_number);
                                setSelectedTeamWithAnimation(null);
                              },
                            },
                          ],
                        );
                      }}>
                      <Svg
                        width="24"
                        height="24"
                        fill="red"
                        viewBox="0 0 16 16">
                        <Path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </Svg>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          }}
          keyExtractor={item => String(item.team_number)}
        />
      )}
    </Pressable>
  );
}

export default PicklistCreator;
