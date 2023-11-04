import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  FlatList,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import StandardButton from '../components/StandardButton';
import PicklistsDB, {SimpleTeam} from '../database/Picklists';
import StandardModal from '../components/modals/StandardModal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Svg, {Path} from 'react-native-svg';

function PicklistCreator() {
  const {colors} = useTheme();

  const [name, setName] = useState<string | undefined>(undefined);
  const [possibleTeams, setPossibleTeams] = useState<number[]>([]);
  const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
  const [filter_by_added, setFilterByAdded] = useState(false);
  const [teams_list, setTeamsList] = useState<number[]>([]);

  const [dragging_active, setDraggingActive] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    PicklistsDB.getTeamsAtCompetition('2023cc')
      .then(teams => {
        // set teams to just the numbers of the returned teams
        console.info(teams);
        setPossibleTeams(teams.map(team => team.team_number));
      })
      .catch(error => {
        console.error('Error getting teams at competition:', error);
      });
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
    console.log('saving picklist to db');
    PicklistsDB.createPicklist(name ?? '', teams_list).then(r => {
      console.log('response after submitting picklist to db: ' + r);
    });
  };

  const renderItemStandard = ({item}) => {
    return (
      <Pressable style={styles.team_item_in_list}>
        <Text style={{color: 'gray'}}>{teams_list.indexOf(item) + 1}</Text>
        <Text style={styles.team_number_displayed}>{item}</Text>
      </Pressable>
    );
  };

  const addTeam = (team: number) => {
    if (teams_list.includes(team)) {
      return;
    }
    setTeamsList(prevTeams => [...prevTeams, team]);
  };

  const removeTeam = (team: number) => {
    setTeamsList(prevTeams => prevTeams.filter(t => t !== team));
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
      <TextInput
        style={styles.name_input}
        onPressIn={() => setName('')}
        onChangeText={text => {
          setName(text);
        }}
        value={name}
        defaultValue={'Enter Name'}
      />
      <StandardModal title={'Add Teams'} visible={teamAddingModalVisible}>
        <StandardButton
          color={'red'}
          text={'Cancel'}
          onPress={() => setTeamAddingModalVisible(false)}
        />
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
                onPress={isChecked => {
                  // console.log(item);
                  if (isChecked) {
                    addTeam(item);
                    console.log('adding team ' + item);
                  } else {
                    removeTeam(item);
                    console.log('removing team ' + item);
                  }
                }}
              />
            );
          }}
        />
      </StandardModal>
      <StandardModal title={'Share'} visible={shareModalVisible}>
        <StandardButton
          color={'red'}
          text={'Cancel'}
          onPress={() => setShareModalVisible(false)}
        />
        <StandardButton
          color={'blue'}
          text={'Save'}
          onPress={() => {
            console.log('saving');
            console.info(teams_list);
            savePicklistToDB();
          }}
        />
        <StandardButton
          color={'blue'}
          text={'Publish to Team'}
          onPress={() => {}}
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
          renderItem={renderItemStandard}
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
          onPress={() => setShareModalVisible(true)}
          style={{
            backgroundColor: 'black',
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
              d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
            />
          </Svg>
        </Pressable>
      </View>
      {/*<StandardButton*/}
      {/*  color={'blue'}*/}
      {/*  text={'Clear'}*/}
      {/*  onPress={() => setTeamsList([])}*/}
      {/*/>*/}
      {/*<StandardButton color={'blue'} text={'Save'} onPress={() => {}} />*/}
      {/*<StandardButton color={'blue'} text={'Publish'} onPress={() => {}} />*/}
    </View>
  );
}

export default PicklistCreator;
