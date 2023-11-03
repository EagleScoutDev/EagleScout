import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FullScreenIncrementer from '../../components/form/FullScreenIncrementer';
import FormSection from '../../components/form/FormSection';
import React, {useState, useEffect} from 'react';
import FormComponent from '../../components/form/FormComponent';
import StandardButton from '../../components/StandardButton';
import MatchInformation from '../../components/form/MatchInformation';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// TODO: add three lines to open drawer
const Tab = createMaterialTopTabNavigator();

function Gamification({
  teleop_scored,
  setTeleop_scored,
  auto_scored,
  setAuto_scored,
  match,
  setMatch,
  team,
  setTeam,
  colors,
  styles,
  navigation,
  competition,
  data,
  arrayData,
  setArrayData,
  submitForm,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // set arraydata to a copy of the arraydata, and
    // set the index of 10 in the array to the cube count
    if (arrayData === undefined || arrayData.length === 0) {
      console.log('arrayData is undefined or empty');
      return;
    }
    console.log('auto_scored: ', JSON.stringify(auto_scored));
    console.log('teleop_scored: ', JSON.stringify(teleop_scored));

    setArrayData(b => {
      let a = [...b];
      console.log(arrayData);
      a[2] =
        auto_scored.cones.filter(c => c === 'low').length +
        auto_scored.cubes.filter(c => c === 'low').length;
      a[3] =
        auto_scored.cones.filter(c => c === 'mid').length +
        auto_scored.cubes.filter(c => c === 'mid').length;
      a[4] =
        auto_scored.cones.filter(c => c === 'high').length +
        auto_scored.cubes.filter(c => c === 'high').length;

      a[7] =
        teleop_scored.cones.filter(c => c === 'low').length +
        teleop_scored.cubes.filter(c => c === 'low').length;
      a[8] =
        teleop_scored.cones.filter(c => c === 'mid').length +
        teleop_scored.cubes.filter(c => c === 'mid').length;
      a[9] =
        teleop_scored.cones.filter(c => c === 'high').length +
        teleop_scored.cubes.filter(c => c === 'high').length;
      // a[AUTO_SCORED_INDEX] =
      //   auto_scored.cones.length + auto_scored.cubes.length;
      // a[TELEOP_SCORED_INDEX] =
      //   teleop_scored.cones.length + teleop_scored.cubes.length;
      return a;
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  return (
    <>
      <Tab.Navigator
        // change the position to be on the bottom
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.background,
            marginTop: '10%',
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          // make the distance between each tab smaller
          tabBarGap: 0,
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}>
        <Tab.Screen
          name={'Match'}
          options={{
            headerTintColor: colors.text,
            tabBarLabelStyle: {
              fontSize: 7.5,
              fontWeight: 'bold',
            },

            tabBarStyle: {
              backgroundColor: colors.background,
              paddingTop: '10%',
            },
          }}
          children={() => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                  }}>
                  {competition != null && (
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: 'bold',
                        fontSize: 20,
                        textAlign: 'center',
                        margin: '5%',
                      }}>
                      {competition.name}
                    </Text>
                  )}
                  <MatchInformation
                    match={match}
                    setMatch={setMatch}
                    team={team}
                    setTeam={setTeam}
                    disabled={true}
                  />
                </View>
                <View style={{width: '100%', marginBottom: '5%'}}>
                  <StandardButton
                    text={'Next'}
                    onPress={() => navigation.navigate(Object.keys(data)[0])}
                    color={colors.primary}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        {data &&
          Object.entries(data).map(([key, value], index) => {
            return (
              <Tab.Screen
                key={key}
                name={key}
                options={{
                  // change font color in header
                  headerTintColor: colors.text,
                  tabBarLabelStyle: {
                    fontSize: 7.5,
                    fontWeight: 'bold',
                  },

                  tabBarStyle: {
                    backgroundColor: colors.background,
                    paddingTop: '10%',
                  },
                }}
                children={() => (
                  // <KeyboardAvoidingView behavior={'height'}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {auto_scored !== undefined &&
                      teleop_scored !== undefined && (
                        <Modal
                          visible={modalVisible}
                          transparent={true}
                          animationType={'slide'}>
                          <FullScreenIncrementer
                            setVisible={setModalVisible}
                            cones={
                              index === 0
                                ? auto_scored.cones
                                : teleop_scored.cones
                            }
                            cubes={
                              index === 0
                                ? auto_scored.cubes
                                : teleop_scored.cubes
                            }
                            setScored={
                              index === 0 ? setAuto_scored : setTeleop_scored
                            }
                          />
                        </Modal>
                      )}
                    {/*if the index is 1 or 2, add a button to activate a modal*/}
                    {(index === 0 || index === 1) && (
                      <View style={{width: '100%'}}>
                        <StandardButton
                          text={'Show Modal'}
                          width={'85%'}
                          onPress={() => {
                            console.log('show modal visible pressed');
                            console.log(
                              'autoscored: ',
                              JSON.stringify(auto_scored),
                            );
                            console.log(
                              'teleopscored: ',
                              JSON.stringify(teleop_scored),
                            );
                            setModalVisible(true);
                          }}
                          color={'green'}
                        />
                      </View>
                    )}
                    <FormSection colors={colors} title={''} key={key.length}>
                      {value.map((item, vIndex) => {
                        return (
                          <FormComponent
                            key={item.question}
                            colors={colors}
                            item={item}
                            styles={styles}
                            arrayData={arrayData}
                            setArrayData={setArrayData}
                          />
                        );
                      })}
                    </FormSection>
                    {/*if the index is not the last one, add a button that navigates users to the next tab*/}
                    {index !== Object.keys(data).length - 1 && (
                      <View style={{width: '100%', marginBottom: '5%'}}>
                        <StandardButton
                          text={'Next'}
                          width={'85%'}
                          onPress={() =>
                            navigation.navigate(Object.keys(data)[index + 1])
                          }
                          color={colors.primary}
                        />
                      </View>
                    )}
                    {/*  if the index is the last one, show a touchable opacity*/}
                    {index === Object.keys(data).length - 1 && (
                      <View style={{width: '100%', marginBottom: '50%'}}>
                        <StandardButton
                          text={'Submit'}
                          width={'85%'}
                          color={colors.primary}
                          onPress={submitForm}
                        />
                      </View>
                    )}
                  </ScrollView>
                  // </KeyboardAvoidingView>
                )}
              />
            );
          })}
      </Tab.Navigator>
    </>
  );
}

export default Gamification;
