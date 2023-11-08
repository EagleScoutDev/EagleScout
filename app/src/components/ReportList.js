import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import ScoutViewer from './modals/ScoutViewer';
import {useTheme} from '@react-navigation/native';
import ScoutReportsDB from '../database/ScoutReports';

function ReportList({team_number}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenScoutForm, setChosenScoutForm] = useState(null);
  const [sort, setSort] = useState('');
  const [dataCopy, setDataCopy] = useState([]);
  const {colors} = useTheme();

  useEffect(() => {
    if (/^\d+$/.test(team_number) && Number(team_number) < 100000) {
      ScoutReportsDB.getReportsForTeam(Number(team_number))
        .then(results => {
          setDataCopy([...results]); // Spread into a new array to trigger re-render
          console.log(results.length);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, []);

  // Render ScoutViewer modal if it's visible
  if (modalVisible && chosenScoutForm) {
    return (
      <ScoutViewer
        visible={modalVisible}
        setVisible={setModalVisible}
        data={chosenScoutForm}
        chosenComp={chosenScoutForm.competitionName}
      />
    );
  }

  // Main ReportList component rendering
  return (
    <KeyboardAvoidingView behavior={'height'} style={{flex: 1}}>
      {dataCopy && dataCopy.length === 0 && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.card,
            width: '80%',
            alignSelf: 'center',
            borderRadius: 15,
            padding: 20,
          }}>
          <Text
            style={{
              paddingHorizontal: '10%',
              color: 'red',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            No reports found.
          </Text>
        </View>
      )}

      {dataCopy && dataCopy.length > 0 && (
        <FlatList
          data={
            sort
              ? [...dataCopy].sort((a, b) => {
                  if (sort === 'team') {
                    return a.team - b.team;
                  } else if (sort === 'match') {
                    return a.match_number - b.match_number;
                  } else if (sort === 'date') {
                    return new Date(a.created_at) - new Date(b.created_at);
                  }
                })
              : dataCopy
          }
          ListHeaderComponent={() => (
            <View
              style={{
                // backgroundColor: colors.card,
                width: '90%',
                alignSelf: 'center',
                borderRadius: 15,
                padding: 20,
                // marginVertical: 10,
                // borderWidth: 1,
                // borderColor: colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1.5,
                  borderRadius: 15,
                }}
                onPress={() => {
                  setSort('team');
                  setDataCopy(
                    dataCopy.sort((a, b) => {
                      return a.team - b.team;
                    }),
                  );
                }}>
                <Text
                  style={{
                    color: sort === 'team' ? colors.primary : colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Team
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  setSort('match');
                  setDataCopy(
                    dataCopy.sort((a, b) => {
                      return a.match_number - b.match_number;
                    }),
                  );
                }}>
                <Text
                  style={{
                    color: sort === 'match' ? colors.primary : colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Match
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 2,
                  borderRadius: 15,
                }}
                onPress={() => {
                  setSort('date');
                  setDataCopy(
                    dataCopy.sort((a, b) => {
                      return new Date(a.created_at) - new Date(b.created_at);
                    }),
                  );
                }}>
                <Text
                  style={{
                    color: sort === 'date' ? colors.primary : colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Date
                </Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({item, index, separators}) => (
            <TouchableOpacity
              onPress={() => {
                setChosenScoutForm(item);
                setModalVisible(true);
              }}>
              <View
                style={{
                  backgroundColor: colors.card,
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: 15,
                  padding: 20,
                  marginVertical: 5,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 1.5,
                  }}>
                  {item.teamNumber}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  {item.matchNumber}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 2,
                    textAlign: 'right',
                  }}>
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          // keyExtractor={item => item.id.toString()} // Updated keyExtractor
        />
      )}
    </KeyboardAvoidingView>
  );
}

export default ReportList;
