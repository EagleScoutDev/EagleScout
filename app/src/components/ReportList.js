import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import ScoutViewer from './modals/ScoutViewer';
import {useTheme} from '@react-navigation/native';
import {ChevronDown, ChevronUp} from '../SVGIcons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function CompetitionFlatList({
  compName,
  data,
  setChosenScoutForm,
  setModalVisible,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sort, setSort] = useState('');
  const [dataCopy, setDataCopy] = useState(data);
  const {colors} = useTheme();

  const onPress = () => {
    setIsCollapsed(!isCollapsed);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleSort = (sortName, sortFunc) => {
    if (sort === sortName) {
      setSort('');
      setDataCopy(data);
    } else {
      setSort(sortName);
      setDataCopy(dataCopy.sort(sortFunc));
    }
  };

  return (
    <FlatList
      data={data}
      style={{
        paddingBottom: 20,
      }}
      ListHeaderComponent={() => (
        <View>
          <TouchableOpacity onPress={onPress}>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 30,
                  fontWeight: 'bold',
                }}>
                {compName}
              </Text>
              {isCollapsed ? (
                <ChevronUp width={30} height={30} />
              ) : (
                <ChevronDown width={30} height={30} />
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              display: isCollapsed ? 'none' : 'flex',
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              paddingHorizontal: 20,
              paddingBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flex: 1.5,
                borderRadius: 15,
              }}
              onPress={() =>
                handleSort('team', (a, b) => a.teamNumber - b.teamNumber)
              }>
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
              onPress={() =>
                handleSort('match', (a, b) => a.matchNumber - b.matchNumber)
              }>
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
              onPress={() =>
                handleSort(
                  'date',
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                )
              }>
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
        </View>
      )}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => {
            setChosenScoutForm(item);
            setModalVisible(true);
          }}
          style={{
            display: isCollapsed ? 'none' : 'flex',
          }}>
          <View
            style={{
              display: item.isCollapsed ? 'none' : 'flex',
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
  );
}

function ReportList({forms}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenScoutForm, setChosenScoutForm] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const {colors} = useTheme();

  useEffect(() => {
    const comps = {};
    for (const form of forms) {
      if (!comps[form.competitionName]) {
        comps[form.competitionName] = [];
      }
      comps[form.competitionName].push(form);
    }
    setDataCopy(
      Object.keys(comps).map(comp => ({
        title: comp,
        data: comps[comp],
      })),
    );
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

  return (
    <KeyboardAvoidingView behavior={'height'} style={{flex: 1}}>
      <FlatList
        data={dataCopy}
        renderItem={({item, index, separators}) => (
          <CompetitionFlatList
            compName={item.title}
            data={item.data}
            setChosenScoutForm={item => {
              console.log('set scout form', item);
              setChosenScoutForm(item);
            }}
            setModalVisible={setModalVisible}
          />
        )}
        keyExtractor={item => item.index}
      />
      {modalVisible && (
        <ScoutViewer
          visible={modalVisible}
          setVisible={setModalVisible}
          data={chosenScoutForm}
          // TODO: add accurate competition name
          chosenComp={chosenScoutForm.competitionName}
        />
      )}
    </KeyboardAvoidingView>
  );
}

export default ReportList;
