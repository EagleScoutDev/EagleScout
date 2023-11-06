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

function PicklistCreator({route}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const [name, setName] = useState<string | undefined>(undefined);
  const [possibleTeams, setPossibleTeams] = useState<number[]>([]);
  const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
  const [filter_by_added, setFilterByAdded] = useState(false);
  const [teams_list, setTeamsList] = useState<number[]>([]);

  const [dragging_active, setDraggingActive] = useState(false);

  const [presetPicklist, setPresetPicklist] = useState<PicklistStructure>();

  const {picklist_id} = route.params;

  useEffect(() => {
    PicklistsDB.getTeamsAtCompetition('2023cc')
      .then(teams => {
        // set teams to just the numbers of the returned teams
        setPossibleTeams(teams.map(team => team.team_number));
      })
      .catch(error => {
        console.error('Error getting teams at competition:', error);
      });
  }, []);

  useEffect(() => {
    if (picklist_id) {
      PicklistsDB.getPicklist(picklist_id)
        .then(picklist => {
          setPresetPicklist(picklist);
          setName(picklist.name);
          setTeamsList(picklist.teams);
        })
        .catch(error => {
          console.error('Error getting picklist:', error);
        });
    }
  }, []);

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
            {item}
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
      ? ' This will overwrite the picklist ' +
        presetPicklist.name +
        ' by ' +
        presetPicklist.created_by +
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
      padding: '5%',
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
      marginRight: '60%',
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
      <Pressable onPress={() => setDraggingActive(!dragging_active)}>
        <Text
          style={{
            color: dragging_active ? colors.primary : colors.text,
            fontSize: 30,
          }}>
          {dragging_active ? 'Reordering Active' : 'Reordering Inactive'}
        </Text>
      </Pressable>
      {presetPicklist ? (
        <View>
          <Text style={styles.name_input}>{presetPicklist.name}</Text>
          <Text style={{color: 'gray'}}>By {presetPicklist.created_by}</Text>
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
      <StandardModal title={'Add Teams'} visible={teamAddingModalVisible}>
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
          <Text style={{color: 'white', fontSize: 20}}>Cancel</Text>
        </TouchableOpacity>

        {/*}*/}
        {/*<StandardButton*/}
        {/*  color={'red'}*/}
        {/*  text={'Cancel'}*/}
        {/*  isLoading={false}*/}
        {/*  onPress={() => setTeamAddingModalVisible(false)}*/}
        {/*/>*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // add a gap between items
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
                size={40}
                fillColor="blue"
                unfillColor="#FFFFFF"
                text={String(item)}
                textStyle={styles.team_item}
                isChecked={teams_list.includes(item)}
                onPress={() => {
                  // console.log(item);
                  // if (isChecked) {
                  //   addTeam(item);
                  //   console.log('adding team ' + item);
                  // } else {
                  //   removeTeam(item);
                  //   console.log('removing team ' + item);
                  // }
                  console.log('checkbox press detected');
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
              <Pressable style={styles.team_item_in_list}>
                <Text style={{color: 'gray'}}>
                  {teams_list.indexOf(item) + 1}
                </Text>
                <Text style={styles.team_number_displayed}>{item}</Text>
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
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
            padding: '5%',
            borderRadius: 10,
            alignItems: 'center',
            flex: 1,
          }}
          onPress={() => {
            setTeamAddingModalVisible(true);
          }}>
          <Text style={{color: 'white', fontSize: 20}}>Add Team</Text>
        </Pressable>
        <Pressable
          onPress={() => prepareUpload()}
          style={{
            backgroundColor:
              teams_list === presetPicklist?.teams ? 'red' : 'black',
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
              fill="white"
              d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
            />
            <Path
              fill={'white'}
              d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

export default PicklistCreator;
