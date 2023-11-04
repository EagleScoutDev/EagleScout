import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Switch,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import StandardButton from '../components/StandardButton';
import PicklistsDB, {SimpleTeam} from '../database/Picklists';
import StandardModal from '../components/modals/StandardModal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

function PicklistCreator() {
  const {colors} = useTheme();

  const [name, setName] = React.useState(undefined);
  const [possibleTeams, setPossibleTeams] = React.useState<SimpleTeam[]>([]);

  const [teamAddingModalVisible, setTeamAddingModalVisible] =
    React.useState(true);

  // const [teams, setTeams] = React.useState<SimpleTeam[]>([]);
  const [teams_list, setTeamsList] = React.useState<SimpleTeam[]>([]);

  const [filter_by_added, setFilterByAdded] = React.useState(false);

  useEffect(() => {
    PicklistsDB.getTeamsAtCompetition('2023cc').then(teams => {
      setPossibleTeams(teams);
    });
  }, []);

  function addTeam(team: SimpleTeam) {
    if (teams_list.includes(team)) {
      return;
    }
    setTeamsList([...teams_list, team]);
  }

  function removeTeam(team: SimpleTeam) {
    if (!teams_list.includes(team)) {
      return;
    }
    setTeamsList(teams_list.filter(t => t !== team));
  }

  const styles = StyleSheet.create({
    name_input: {
      height: '20%',
      // borderColor: 'gray',
      // borderWidth: 1,
      color: colors.text,
      fontSize: 30,
      // monospaced font
      // list all available fonts
      // https://reactnative.dev/docs/text-style-props#fontfamily
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
      // take up the max width
      minWidth: '80%',
      textDecorationLine: 'none',
    },
  });

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.text,
        }}>
        PicklistCreator
      </Text>
      <TextInput
        style={styles.name_input}
        onPressIn={() => setName('')}
        onChangeText={text => {
          setName(text);
        }}
        value={name}
        defaultValue={'Enter Name'}
      />
      {teams_list.map(team => {
        return (
          <Text
            style={{
              color: colors.text,
            }}>
            {team.team_number}
          </Text>
        );
      })}
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
                text={String(item.team_number)}
                textStyle={styles.team_item}
                isChecked={teams_list.includes(item)}
                onPress={isChecked => {
                  // console.log(item);
                  if (isChecked) {
                    addTeam(item);
                    console.log('adding team ' + item.team_number);
                  } else {
                    removeTeam(item);
                    console.log('removing team ' + item.team_number);
                  }
                }}
              />
            );
          }}
        />
      </StandardModal>
      <StandardButton
        color={'blue'}
        text={'Add Team'}
        onPress={() => {
          setTeamAddingModalVisible(true);
        }}
      />
      <StandardButton
        color={'blue'}
        text={'Clear'}
        onPress={() => setTeamsList([])}
      />
      <StandardButton color={'blue'} text={'Save'} onPress={() => {}} />
      <StandardButton color={'blue'} text={'Publish'} onPress={() => {}} />
    </View>
  );
}

export default PicklistCreator;
