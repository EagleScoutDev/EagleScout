import {Pressable, Text, ScrollView, View, Modal} from 'react-native';
import FormSection from '../../components/form/FormSection';
import React, {useState, useRef} from 'react';
import FormComponent from '../../components/form/FormComponent';
import MatchInformation from '../../components/form/MatchInformation';
import StandardButton from '../../components/StandardButton';
import CrescendoTeleopModal from '../../components/games/crescendo/CrescendoTeleopModal';
import CrescendoAutoModal from '../../components/games/crescendo/CrescendoAutoModal';
import {getActionForLink} from '../../components/games/crescendo/CrescendoActions';

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
  autoPath,
  setAutoPath,
}) {
  const [activeModal, setActiveModal] = useState('');
  const teleopModalRef = useRef();
  const autoModalRef = useRef();

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
        autoPath={autoPath}
        setAutoPath={setAutoPath}
        onLabelChange={(label, change) => {
          console.log(data);
          const linkedItem = data['Auto'].find(item => item.link_to === label);
          console.log(linkedItem);
          if (linkedItem) {
            const prevCount = arrayData[linkedItem.indice];
            const newCount = prevCount + change;
            setArrayData({
              ...arrayData,
              [linkedItem.indice]: newCount,
            });
          }
        }}
        ref={autoModalRef}
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
        ref={teleopModalRef}
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
                      setArrayData={newData => {
                        console.log('change item', item);
                        if (item.link_to) {
                          const prevCount = arrayData[item.indice];
                          const newCount = newData[item.indice];
                          console.log('prevCount', prevCount);
                          console.log('newCount', newCount);
                          if (key === 'Teleop') {
                            teleopModalRef.current.changeActionCount(
                              getActionForLink(item.link_to),
                              newCount - prevCount,
                            );
                          } else if (key === 'Auto') {
                            autoModalRef.current.changeActionCount(
                              getActionForLink(item.link_to),
                              newCount - prevCount,
                            );
                          }
                        }
                        setArrayData(newData);
                      }}
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
