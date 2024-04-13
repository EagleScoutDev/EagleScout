import {useTheme} from '@react-navigation/native';
import {FlatList, Modal, Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CompetitionsDB from '../../database/Competitions';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Slider from '@react-native-community/slider';

const QuestionFormulaCreator = ({
  visible,
  setVisible,
  chosenQuestionIndices,
  setChosenQuestionIndices,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chosenQuestionIndices: number[];
  setChosenQuestionIndices: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const {colors} = useTheme();
  // const [chosenQuestionIndices, setChosenQuestionIndices] = useState<number[]>(
  //   [],
  // );
  // const [numberQuestions, setNumberQuestions] = React.useState<Object[]>([]);
  const [currForm, setCurrForm] = useState<Array<Object>>();

  useEffect(() => {
    setChosenQuestionIndices([]);
  }, []);

  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(competition => {
      if (!competition) {
        return;
      }
      console.log('active competition found for formula creator');

      setCurrForm(competition.form);
    });
  }, []);

  return (
    <Modal
      presentationStyle={'pageSheet'}
      visible={visible}
      animationType={'slide'}
      onRequestClose={() => {
        if (chosenQuestionIndices.length === 0) {
          setVisible(false);
        }
      }}>
      <View style={{backgroundColor: colors.card, flex: 1}}>
        <Text
          style={{
            color: colors.text,
            textAlign: 'center',
            fontSize: 20,
            marginTop: '4%',
          }}>
          Choose Questions
        </Text>
        {chosenQuestionIndices.length > 0 && (
          <Pressable
            style={{position: 'absolute', right: '4%', top: '2%'}}
            onPress={() => {
              console.log('saving');
              setVisible(false);
            }}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Save
            </Text>
          </Pressable>
        )}
        {chosenQuestionIndices.length === 0 ? (
          <Text
            style={{
              color: 'gray',
              textAlign: 'center',
              fontSize: 16,
              marginTop: '1%',
              marginBottom: '2%',
            }}>
            Pick at least one to get started.
          </Text>
        ) : (
          <View style={{marginVertical: '4%'}} />
        )}
        <FlatList
          data={currForm}
          renderItem={({item, index}) => {
            if (item.type === 'heading') {
              return (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginVertical: '4%',
                    marginLeft: '4%',
                  }}
                  key={index}>
                  {item.title}
                </Text>
              );
            }
            if (item.type === 'number') {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: '1%',
                    alignItems: 'center',
                    marginHorizontal: '4%',
                  }}>
                  <BouncyCheckbox
                    fillColor={'blue'}
                    text={item.question}
                    isChecked={chosenQuestionIndices.includes(index)}
                    textStyle={{color: colors.text, textDecorationLine: 'none'}}
                    onPress={isChecked => {
                      if (isChecked) {
                        setChosenQuestionIndices([
                          ...chosenQuestionIndices,
                          index,
                        ]);
                      } else {
                        setChosenQuestionIndices(
                          chosenQuestionIndices.filter(i => i !== index),
                        );
                      }
                    }}
                  />
                </View>
              );
            }
            return null;
          }}
        />
      </View>
    </Modal>
  );
};

export default QuestionFormulaCreator;
