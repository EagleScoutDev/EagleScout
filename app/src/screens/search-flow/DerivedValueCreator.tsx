import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import StandardButton from '../../components/StandardButton';
import {useTheme} from '@react-navigation/native';
import {getIdealTextColor} from '../../lib/ColorReadability';
import {DerivedValueCreatorModal} from './DerivedValueCreatorModal';
import CompetitionsDB from '../../database/Competitions';

export const DerivedValueCreator = ({
  competitionId,
}: {
  competitionId: number;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {colors} = useTheme();
  const [formStructure, setFormStructure] = useState<any[] | null>(null);
  useEffect(() => {
    CompetitionsDB.getCompetitionById(competitionId).then(competition => {
      if (!competition) {
        return;
      }
      setFormStructure(competition.form);
    });
  }, [competitionId]);
  const formFieldsMemo = useMemo(
    () =>
      formStructure
        ? formStructure
            .map((field, index) => ({
              type: field.type,
              text: field.question,
              index: index,
            }))
            .filter(field => field.type === 'number')
            .map(field => ({
              text: field.text,
              index: field.index,
            }))
        : [],
    [formStructure],
  );

  return (
    <>
      <View
        style={{
          marginTop: '10%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <StandardButton
          text={'Create Derived Value'}
          textColor={getIdealTextColor(colors.primary)}
          color={colors.primary}
          onPress={() => {
            setModalVisible(true);
          }}
          disabled={false}
        />
      </View>
      <DerivedValueCreatorModal
        isOpen={modalVisible}
        onSubmit={fields => {
          console.log('Derived value fields', fields);
          setModalVisible(false);
        }}
        formFields={formFieldsMemo}
      />
    </>
  );
};
