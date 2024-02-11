import StandardModal from '../../../components/modals/StandardModal';
import StandardButton from '../../../components/StandardButton';
import {Text, StyleSheet} from 'react-native';
import Heading from './questions/Heading';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Radio from './questions/Radio';
import Number from './questions/Number';
import TextQuestion from './questions/TextBox';

const NewQuestionModal = ({visible, setVisible, onSubmit, styles}) => {
  const [headingModalVisible, setHeadingModalVisible] = useState(false);
  const [radioModalVisible, setRadioModalVisible] = useState(false);
  const [numberModalVisible, setNumberModalVisible] = useState(false);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [radioKey, setRadioKey] = useState(0);
  const [numberKey, setNumberKey] = useState(1);
  const [textKey, setTextKey] = useState(2);
  const [headingKey, setHeadingKey] = useState(3);
  const [nextKey, setNextKey] = useState(4);

  return (
    <>
      <StandardModal
        title="New question"
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          What type of question do you want to add?
        </Text>
        <StandardButton
          text={'Heading'}
          onPress={() => {
            setHeadingKey(nextKey);
            setNextKey(nextKey + 1);
            setVisible(false);
            setHeadingModalVisible(true);
          }}
          color={'blue'}
        />
        <StandardButton
          text={'Radio'}
          onPress={() => {
            setRadioKey(nextKey);
            setNextKey(nextKey + 1);
            setVisible(false);
            setRadioModalVisible(true);
          }}
          color={'red'}
        />
        <StandardButton
          text={'Number'}
          onPress={() => {
            setNumberKey(nextKey);
            setNextKey(nextKey + 1);
            setVisible(false);
            setNumberModalVisible(true);
          }}
          color={'green'}
        />
        <StandardButton
          text={'Text'}
          onPress={() => {
            setTextKey(nextKey);
            setNextKey(nextKey + 1);
            setVisible(false);
            setTextModalVisible(true);
          }}
          color={'orange'}
        />
        <StandardButton
          text={'Cancel'}
          onPress={() => {
            setVisible(false);
          }}
          color={'gray'}
        />
      </StandardModal>
      <Heading
        visible={headingModalVisible}
        setVisible={setHeadingModalVisible}
        styles={styles}
        onSubmit={onSubmit}
        key={headingKey}
      />
      <Radio
        visible={radioModalVisible}
        setVisible={setRadioModalVisible}
        styles={styles}
        key={radioKey}
        onSubmit={onSubmit}
      />
      <Number
        visible={numberModalVisible}
        setVisible={setNumberModalVisible}
        styles={styles}
        onSubmit={onSubmit}
        key={numberKey}
      />
      <TextQuestion
        visible={textModalVisible}
        setVisible={setTextModalVisible}
        styles={styles}
        onSubmit={onSubmit}
        key={textKey}
      />
    </>
  );
};

export default NewQuestionModal;
