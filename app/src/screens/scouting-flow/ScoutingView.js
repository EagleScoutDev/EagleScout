import {Pressable, Text, ScrollView, View, Modal} from 'react-native';
import FormSection from '../../components/form/FormSection';
import React, {useState} from 'react';
import FormComponent from '../../components/form/FormComponent';
import MatchInformation from '../../components/form/MatchInformation';
import StandardButton from '../../components/StandardButton';
import CrescendoTeleopModal from '../../components/games/crescendo/CrescendoTeleopModal';
import CrescendoAutoModal from '../../components/games/crescendo/CrescendoAutoModal';

function ScoutingView({
  match,
  setMatch,
  team,
  setTeam,
  teamsForMatch,
  colors,
  styles,
  competition,
  data,
  arrayData,
  setArrayData,
  submitForm,
  isSubmitting,
  startRelativeTime,
  setStartRelativeTime,
  timeline,
  setTimeline,
  onLabelPress,
  onLabelUndo,
  fieldOrientation,
  setFieldOrientation,
  selectedAlliance,
  setSelectedAlliance,
}) {
  const [activeModal, setActiveModal] = useState('');

  return (
    <ScrollView>
      {/*<Text*/}
      {/*  style={{*/}
      {/*    color: colors.text,*/}
      {/*    textAlign: 'center',*/}
      {/*    paddingBottom: 15,*/}
      {/*    fontWeight: 'bold',*/}
      {/*    fontSize: 30,*/}
      {/*    marginTop: 20,*/}
      {/*    // marginVertical: 20,*/}
      {/*  }}>*/}
      {/*  Scouting Report*/}
      {/*</Text>*/}
      {competition != null && (
        <Text
          style={{
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            marginVertical: 20,
          }}>
          {competition.name}
        </Text>
      )}
      <MatchInformation
        match={match}
        setMatch={setMatch}
        team={team}
        setTeam={setTeam}
        teamsForMatch={teamsForMatch}
      />
      <CrescendoAutoModal
        isActive={activeModal === 'Auto'}
        setIsActive={() => setActiveModal('')}
        fieldOrientation={fieldOrientation}
        setFieldOrientation={setFieldOrientation}
        selectedAlliance={selectedAlliance}
        setSelectedAlliance={setSelectedAlliance}
      />
      <CrescendoTeleopModal
        timeline={timeline}
        setTimeline={setTimeline}
        startRelativeTime={startRelativeTime}
        setStartRelativeTime={setStartRelativeTime}
        isActive={activeModal === 'Teleop'}
        setIsActive={() => setActiveModal('')}
        onLabelPress={onLabelPress}
        onLabelUndo={onLabelUndo}
      />
      {/*
       * The 'data' variable used here is a dictionary
       * Each key in the dictionary is a header
       * Each value is an array of questions
       */}
      {data &&
        Object.entries(data).map(([key, value], index) => {
          return (
            <FormSection
              colors={colors}
              title={key}
              key={key.length}
              modalAttached={key === 'Teleop' || key === 'Auto'}
              onModalPress={() => setActiveModal(key)}>
              {value.map((item, vIndex) => {
                return (
                  <View style={{marginVertical: '5%'}}>
                    <FormComponent
                      key={item.question}
                      colors={colors}
                      item={item}
                      styles={styles}
                      arrayData={arrayData}
                      setArrayData={setArrayData}
                    />
                  </View>
                );
              })}
            </FormSection>
          );
        })}
      <StandardButton
        text={'Submit'}
        color={colors.primary}
        width={'85%'}
        isLoading={isSubmitting}
        onPress={submitForm}
      />
      <View style={{marginBottom: 300}} />
    </ScrollView>
  );
}

export default ScoutingView;
