import {Text, ScrollView, View} from 'react-native';
import FormSection from '../../components/form/FormSection';
import React from 'react';
import FormComponent from '../../components/form/FormComponent';
import MatchInformation from '../../components/form/MatchInformation';
import StandardButton from '../../components/StandardButton';

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
}) {
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

      {/*
       * The 'data' variable used here is a dictionary
       * Each key in the dictionary is a header
       * Each value is an array of questions
       */}
      {data &&
        Object.entries(data).map(([key, value], index) => {
          return (
            <FormSection colors={colors} title={key} key={key.length}>
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
