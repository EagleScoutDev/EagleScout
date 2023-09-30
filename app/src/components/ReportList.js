import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {useEffect, useState} from 'react';
import ScoutViewer from './modals/ScoutViewer';
import {useTheme} from '@react-navigation/native';

function ReportList({forms}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenScoutForm, setChosenScoutForm] = useState(null);
  const [sort, setSort] = useState('');
  const [dataCopy, setDataCopy] = useState([]);
  const {colors} = useTheme();

  useEffect(() => {
    setDataCopy(forms);
  }, [forms]);

  if (forms == null) {
    return (
      <View>
        <Text style={{paddingHorizontal: '10%'}}>Waiting for input...</Text>
      </View>
    );
  }

  if (forms.length === 0) {
    return (
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
    );
  }

  if (modalVisible) {
    return (
      <ScoutViewer
        visible={modalVisible}
        setVisible={setModalVisible}
        data={chosenScoutForm}
        // TODO: add accurate competition name
        chosenComp={chosenScoutForm.competitionName}
      />
    );
  } else {
    return (
      <KeyboardAvoidingView behavior={'height'} style={{flex: 1}}>
        <FlatList
          data={dataCopy}
          // add a header
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
                      return a.match_number - b.match_umber;
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
          // keyExtractor={item => item.id}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default ReportList;
