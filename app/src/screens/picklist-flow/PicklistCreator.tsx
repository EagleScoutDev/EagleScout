import React, {useState, useEffect} from 'react';
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

function PicklistCreator({
  route,
}: {
  route: {params: {picklist_id: number; given_teams: number[]}};
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
  const [teams_list, setTeamsList] = useState<number[]>(
    route.params.given_teams,
  );

  // used to enable/disable dragging
  const [dragging_active, setDraggingActive] = useState(false);

  // used to store the picklist that is being edited, or undefined if a new picklist is being created
  const [presetPicklist, setPresetPicklist] = useState<PicklistStructure>();

  // id holds the id of the picklist to be edited, or -1 if a new picklist is being created
  const {picklist_id} = route.params;

  // used to display the team name next to the team number
  const [teamNumberToNameMap, setTeamNumberToNameMap] = useState<
    Map<number, string>
  >(new Map());

  // human-readable name of the person who created the picklist
  const [creator_name, setCreatorName] = useState<string>('');

  // live mode, displays strikethroughs if in live picklist making
  const [live_mode, setLiveMode] = useState<boolean>(false);
  const [removed_teams, setRemovedTeams] = useState<number[]>([]);

  // fetches all teams at the current competition
  useEffect(() => {
    // TODO: @gabor, replace this hardcoded value with the current competition
    PicklistsDB.getTeamsAtCompetition('2023cc')
      .then(teams => {
        // set teams to just the numbers of the returned teams
        setPossibleTeams(teams.map(team => team.team_number));

        let temp_map = new Map();

        for (let i = 0; i < teams.length; i++) {
          temp_map.set(teams[i].team_number, teams[i].nickname);
        }

        setTeamNumberToNameMap(temp_map);
      })
      .catch(error => {
        console.error('Error getting teams at competition:', error);
      });
  }, []);

  // if a picklist is being edited, fetches the picklist from the database
  useEffect(() => {
    if (picklist_id !== -1) {
      fetchPicklist();
    }
  }, []);

  // adds header button to fetch picklist from database
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            fetchPicklist();
          }}>
          <Svg
            width={25}
            height={25}
            viewBox="0 0 16 16"
            stroke="gray"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              marginRight: '5%',
            }}>
            <Path
              fill={colors.primary}
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <Path
              fill={colors.primary}
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
            />
          </Svg>
        </Pressable>
      ),
    });
  }, []);

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
        <Pressable onPressIn={drag} style={styles.team_item_in_list}>
          <Text style={{color: 'gray'}}>{teams_list.indexOf(item) + 1}</Text>
          <Text
            style={{
              ...styles.team_number_displayed,
              color: isActive ? 'blue' : colors.text,
              fontWeight: isActive ? 'bold' : 'normal',
            }}>
            {item} - {teamNumberToNameMap.get(item)}
          </Text>
        </Pressable>
      </ScaleDecorator>
    );
  };

  const savePicklistToDB = () => {
    if (presetPicklist) {
      console.log('user has opted to update picklist');
      PicklistsDB.updatePicklist(picklist_id, teams_list).then(r => {
        console.log('response after updating picklist: ' + r);
      });
    } else {
      console.log('saving picklist to db');
      PicklistsDB.createPicklist(name ?? 'Picklist', teams_list).then(r => {
        console.log('response after submitting picklist to db: ' + r);
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
            navigation.goBack();
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
      borderWidth: 1,
      borderColor: colors.text,
      minWidth: '80%',
      textDecorationLine: 'none',
    },
    team_item_in_list: {
      padding: '2%',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: '30%',
    },
    team_number_strikethrough: {
      flex: 1,
      color: 'gray',
      fontSize: 20,
      marginLeft: '5%',

      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    team_number_displayed: {
      flex: 1,
      color: colors.text,
      fontSize: 20,
      marginLeft: '5%',
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: colors.border,
          marginBottom: '5%',
        }}>
        <Pressable
          onPress={() => {
            setDraggingActive(!dragging_active);
            setLiveMode(false);
          }}>
          <Text
            style={{
              color: dragging_active ? colors.primary : colors.text,
              fontSize: 20,
              marginBottom: '5%',
            }}>
            Sortable
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setLiveMode(!live_mode);
            setDraggingActive(false);
          }}>
          <Text
            style={{
              color: live_mode ? colors.primary : colors.text,
              fontSize: 20,
              marginBottom: '5%',
            }}>
            Live Mode
          </Text>
        </Pressable>
      </View>
      {presetPicklist ? (
        <View>
          <Text style={styles.name_input}>{presetPicklist.name}</Text>
          <Text style={{color: 'gray'}}>By {creator_name}</Text>
        </View>
      ) : (
        <TextInput
          style={styles.name_input}
          onPressIn={() => setName('')}
          onChangeText={text => {
            setName(text);
          }}
          value={name}
          defaultValue={'Enter Name'}
        />
      )}
      <StandardModal
        title={'Add/Remove Teams'}
        visible={teamAddingModalVisible}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
            padding: '5%',
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: '5%',
          }}
          onPress={() => {
            setTeamAddingModalVisible(false);
          }}>
          <Text style={{color: 'white', fontSize: 20}}>Save</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '5%',
          }}>
          <Text style={{color: colors.text, fontSize: 20, marginRight: '3%'}}>
            Filter by Added
          </Text>
          <Switch
            onValueChange={value => setFilterByAdded(value)}
            value={filter_by_added}
          />
        </View>
        <FlatList
          style={{maxHeight: '50%'}}
          data={
            filter_by_added
              ? possibleTeams.filter(team => teams_list.includes(team))
              : possibleTeams
          }
          renderItem={({item}) => {
            return (
              <BouncyCheckbox
                size={30}
                fillColor="blue"
                unfillColor="#FFFFFF"
                text={String(item)}
                textStyle={styles.team_item}
                isChecked={teams_list.includes(item)}
                onPress={() => {
                  addOrRemoveTeam(item);
                }}
              />
            );
          }}
        />
      </StandardModal>

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
                style={styles.team_item_in_list}
                onPress={() => {
                  if (live_mode) {
                    addOrRemoveTeamLiveMode(item);
                  }
                }}>
                <Text style={{color: 'gray'}}>
                  {teams_list.indexOf(item) + 1}
                </Text>
                <Text
                  style={
                    removed_teams.includes(item)
                      ? styles.team_number_strikethrough
                      : styles.team_number_displayed
                  }>
                  {item} - {teamNumberToNameMap.get(item)}
                </Text>
              </Pressable>
            );
          }}
          keyExtractor={item => String(item)}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 0,
          margin: '5%',
          width: '100%',
        }}>
        <Pressable
          style={{
            backgroundColor: colors.text,
            padding: '5%',
            borderRadius: 10,
            alignItems: 'center',
            flex: 1,
          }}
          onPress={() => {
            setTeamAddingModalVisible(true);
          }}>
          <Text
            style={{
              color: colors.background,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Add/Remove Teams
          </Text>
        </Pressable>
        <Pressable
          onPress={() => prepareUpload()}
          style={{
            backgroundColor:
              teams_list === presetPicklist?.teams ? 'red' : colors.text,
            borderColor: colors.border,
            borderWidth: 1,
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: '5%',
            marginLeft: '5%',
          }}>
          <Svg width={'50%'} height="100%" viewBox="0 0 16 16">
            <Path
              fill={colors.background}
              stroke={colors.background}
              strokeWidth={1}
              d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
            />
            <Path
              fill={colors.background}
              stroke={colors.background}
              strokeWidth={1}
              d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

export default PicklistCreator;
