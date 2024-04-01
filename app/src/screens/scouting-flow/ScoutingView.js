import {Text, ScrollView, View} from 'react-native';
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
  fieldOrientation,
  setFieldOrientation,
  selectedAlliance,
  setSelectedAlliance,
  autoPath,
  setAutoPath,
}) {
  const [activeModal, setActiveModal] = useState('');

  return (
    <ScrollView>
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
        selectedAlliance={selectedAlliance}
        setSelectedAlliance={setSelectedAlliance}
        fieldOrientation={fieldOrientation}
        setFieldOrientation={setFieldOrientation}
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
        arrayData={arrayData}
        setArrayData={setArrayData}
        form={data && data['Auto']}
      />
      <CrescendoTeleopModal
        timeline={timeline}
        setTimeline={setTimeline}
        startRelativeTime={startRelativeTime}
        setStartRelativeTime={setStartRelativeTime}
        isActive={activeModal === 'Teleop'}
        setIsActive={() => setActiveModal('')}
        arrayData={arrayData}
        setArrayData={setArrayData}
        form={data && data['Teleop']}
      />
      {data &&
        Object.entries(data).map(([header, questions]) => (
          <FormSection
            colors={colors}
            title={header}
            key={header}
            modalAttached={header === 'Teleop' || header === 'Auto'}
            onModalPress={() => setActiveModal(header)}>
            {questions.map(item => (
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
            ))}
          </FormSection>
        ))}
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
