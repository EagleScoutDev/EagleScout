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
import Competitions from '../database/Competitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormHelper from '../FormHelper';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function CompetitionFlatList({
  compName,
  data,
  overrideCollapsed,
  isCurrentlyRunning,
  setChosenScoutForm,
  setChosenScoutFormIndex,
  setChosenCompetitionIndex,
  setModalVisible,
  displayHeader,
}) {
  const [isCollapsed, setIsCollapsed] = useState(overrideCollapsed);
  const [sort, setSort] = useState('');
  const [dataCopy, setDataCopy] = useState(data);
  const {colors} = useTheme();

  useEffect(() => {
    setIsCollapsed(overrideCollapsed);
    console.log(isCollapsed);
  }, [overrideCollapsed]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isCollapsed]);

  const onPress = () => {
    setIsCollapsed(!isCollapsed);
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
          {displayHeader && (
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
                    color: isCurrentlyRunning ? colors.primary : colors.text,
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
          )}
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
      renderItem={({item, index, separators}) => (
        <TouchableOpacity
          onPress={() => {
            setChosenScoutForm(item);
            setChosenScoutFormIndex(index);
            setChosenCompetitionIndex();
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

function ReportList({
  reports,
  isOffline,
  expandable = true,
  displayHeaders = true,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenScoutForm, setChosenScoutForm] = useState(null);
  const [chosenScoutFormIndex, setChosenScoutFormIndex] = useState(null);
  const [chosenCompetitionIndex, setChosenCompetitionIndex] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const [isCollapsedAll, setIsCollapsedAll] = useState(false);
  const [firstIsCollapsedAll, setFirstIsCollapsedAll] = useState(true);
  const {colors} = useTheme();

  useEffect(() => {
    if (!reports) {
      return;
    }

    const effect = async () => {
      let currComp;
      if (!isOffline) {
        currComp = await Competitions.getCurrentCompetition();
      } else {
        const currCompObj = await AsyncStorage.getItem(
          FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
        );
        if (currCompObj != null) {
          currComp = JSON.parse(currCompObj);
        }
      }
      const comps = {};
      for (const report of reports) {
        if (!comps[report.competitionName]) {
          comps[report.competitionName] = [];
        }
        comps[report.competitionName].push(report);
      }
      setDataCopy(
        Object.keys(comps)
          .map(comp => ({
            title: comp,
            data: comps[comp],
            // currently checks by name, but might want to change to ID in future if needed.
            isCurrentlyRunning: currComp && comp === currComp.name,
          }))
          .sort((a, b) => (a.isCurrentlyRunning ? -1 : 1)),
      );
    };
    effect().catch(console.log);
  }, [isOffline, reports]);

  /**
   * Locally updates the dataCopy array with the new data, so we don't have to re-fetch the db after a report edit
   * @param newData - the new data to update the array with
   */
  const updateFormData = newData => {
    const newForms = [...dataCopy];
    console.log('datacopoy');
    console.log(dataCopy);
    console.log(chosenScoutFormIndex);
    newForms[chosenCompetitionIndex].data[chosenScoutFormIndex].data = newData;
    setDataCopy(newForms);
  };

  if (!reports || reports.length === 0) {
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
          marginTop: 20,
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
      {expandable && (
        <TouchableOpacity
          onPress={() => {
            setIsCollapsedAll(!isCollapsedAll);
            setFirstIsCollapsedAll(false);
          }}
          style={{
            alignSelf: 'flex-end',
            // backgroundColor: colors.primary,
            paddingHorizontal: 10,
            // borderRadius: 10,
          }}>
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 17,
            }}>
            {isCollapsedAll ? 'Expand All' : 'Collapse All'}
          </Text>
        </TouchableOpacity>
      )}
      {/* instead of a FlatList, use a view to avoid the weird error when removing from DOM */}
      <View
        style={{
          paddingBottom: 20,
        }}>
        {dataCopy.map((item, index) => (
          <CompetitionFlatList
            key={item.index}
            compName={item.title}
            data={item.data}
            isCurrentlyRunning={item.isCurrentlyRunning}
            overrideCollapsed={
              // if expandable is false, keep all to be defaultly open
              !expandable
                ? false
                : (firstIsCollapsedAll && !item.isCurrentlyRunning) ||
                  isCollapsedAll
            }
            setChosenScoutForm={chosenForm => {
              console.log('set scout form', chosenForm);
              setChosenScoutForm(chosenForm);
            }}
            setChosenScoutFormIndex={setChosenScoutFormIndex}
            setChosenCompetitionIndex={() => {
              setChosenCompetitionIndex(index);
            }}
            setModalVisible={setModalVisible}
            displayHeader={displayHeaders}
          />
        ))}
      </View>
      {modalVisible && (
        <ScoutViewer
          visible={modalVisible}
          setVisible={setModalVisible}
          data={chosenScoutForm}
          updateFormData={updateFormData}
          // TODO: add accurate competition name
          chosenComp={chosenScoutForm.competitionName}
          isOfflineForm={isOffline}
        />
      )}
    </KeyboardAvoidingView>
  );
}

export default ReportList;
