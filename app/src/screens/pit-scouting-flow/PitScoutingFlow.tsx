import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import PitScoutingCamera from './PitScoutingCamera';
import FormSection from '../../components/form/FormSection';
import FormComponent from '../../components/form/FormComponent';
import StandardButton from '../../components/StandardButton';
import TeamInformation from '../../components/form/TeamInformation';
import CompetitionsDB from '../../database/Competitions';
import FormHelper from '../../FormHelper';
import PitScoutReports, {
  PitScoutReportWithoutId,
} from '../../database/PitScoutReports';
import ScoutReportsDB from '../../database/ScoutReports';

const ListSeparator = () => <View style={{width: 10}} />;

export default function PitScoutingFlow() {
  const {colors} = useTheme();
  const [images, setImages] = useState<string[]>(['plus']);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [team, setTeam] = useState('');
  const [formData, setFormData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStructure, setFormStructure] = useState<any[]>([]);
  const [competitionLoading, setCompetitionLoading] = useState(true);
  const [currentCompetition, setCurrentCompetition] = useState<any>();

  const defaultValues = useMemo(() => {
    return {
      radio: '',
      checkbox: [],
      textbox: '',
      number: 0,
      slider: 0,
    };
  }, []);

  const initializeValues = useCallback(
    (transformedStructure: any) => {
      const newFormData: {
        question: string;
        type: string;
        value: any;
      }[] = [];
      for (const section of transformedStructure) {
        for (const question of section.questions) {
          if (question.type === 'heading') {
            continue;
          }
          // @ts-ignore
          newFormData.push(defaultValues[question.type]);
        }
      }
      setFormData(newFormData);
    },
    [defaultValues],
  );

  const transformStructure = (structure: any[]) => {
    const newStructure: any[] = [];
    let currentSection: {
      title: string;
      questions: any[];
    } | null = null;
    let currentIndice = 0;
    for (const item of structure) {
      if (item.type === 'heading') {
        if (currentSection) {
          newStructure.push(currentSection);
        }
        currentSection = {
          title: item.title,
          questions: [],
        };
      } else {
        if (currentSection) {
          item.indice = currentIndice;
          currentSection.questions.push(item);
          currentIndice++;
        }
      }
    }
    newStructure.push(currentSection);
    return newStructure;
  };
  useEffect(() => {
    CompetitionsDB.getCurrentCompetition().then(competition => {
      if (!competition) {
        return;
      }
      const transformedStructure = transformStructure(
        competition.pitScoutFormStructure,
      );
      setFormStructure(transformedStructure);
      initializeValues(transformedStructure);
      setCompetitionLoading(false);
      setCurrentCompetition(competition);
    });
  }, [initializeValues]);
  const checkRequiredFields = () => {
    for (const section of formStructure) {
      for (const question of section.questions) {
        if (
          question.required &&
          formData[question.indice] === defaultValues[question.type] &&
          question.type !== 'number'
        ) {
          Alert.alert(
            'Required Question: ' + question.question + ' not filled out',
            'Please fill out all questions denoted with an asterisk',
          );
          return false;
        }
      }
    }
    return true;
  };
  const submitForm = async () => {
    setIsSubmitting(true);
    console.log('Submitting form', formData);
    if (team === '') {
      Alert.alert('Invalid Team Number', 'Please enter a valid team number');
      setIsSubmitting(false);
      return;
    }
    if (!checkRequiredFields()) {
      setIsSubmitting(false);
      return;
    }
    const data: PitScoutReportWithoutId = {
      data: formData,
      teamNumber: parseInt(team, 10),
      competitionId: currentCompetition!.id,
    };
    const googleResponse = await fetch('https://google.com').catch(() => {});
    if (!googleResponse) {
      FormHelper.savePitFormOffline(
        data,
        images.filter(item => item !== 'plus'),
      ).then(() => {
        Toast.show({
          type: 'success',
          text1: 'Saved offline successfully!',
          visibilityTime: 3000,
        });
        setTeam('');
        setFormData([]);
        setImages(['plus']);
        setIsSubmitting(false);
      });
    } else {
      PitScoutReports.createOnlinePitScoutReport(
        data,
        images.filter(item => item !== 'plus'),
      )
        .then(() => {
          setIsSubmitting(false);
          setTeam('');
          initializeValues(formStructure);
          setImages(['plus']);
          Toast.show({
            type: 'success',
            text1: 'Submitted successfully!',
            visibilityTime: 3000,
          });
        })
        .catch(err => {
          setIsSubmitting(false);
          console.log(err);
          Toast.show({
            type: 'error',
            text1: 'Error submitting form',
            visibilityTime: 3000,
          });
        });
    }
  };
  return (
    <ScrollView>
      <Text
        style={{
          color: colors.text,
          textAlign: 'center',
          paddingBottom: 15,
          fontWeight: 'bold',
          fontSize: 30,
          marginTop: 20,
        }}>
        Pit Scouting Report
      </Text>
      <TeamInformation team={team} setTeam={setTeam} />
      {!competitionLoading &&
        formData.length !== 0 &&
        formStructure.map((section, i) => (
          <FormSection colors={colors} title={section.title} key={i}>
            {section.questions.map((item: any, j) => (
              <>
                {/* @ts-ignore */}
                <FormComponent
                  key={j}
                  item={item}
                  arrayData={formData}
                  setArrayData={setFormData}
                />
              </>
            ))}
          </FormSection>
        ))}
      <FormSection colors={colors} title={'Attach Images'}>
        <FlatList
          style={styles.imageList}
          ItemSeparatorComponent={ListSeparator}
          data={images}
          renderItem={({item}) => {
            if (item === 'plus') {
              return (
                <Pressable onPress={() => setCameraOpen(true)}>
                  <View style={styles.plusButton}>
                    <Text>+</Text>
                  </View>
                </Pressable>
              );
            }
            return <Image source={{uri: item}} style={styles.image} />;
          }}
          keyExtractor={item => item}
          horizontal={true}
        />
      </FormSection>
      {cameraOpen && (
        <Modal animationType="slide" visible={cameraOpen}>
          <PitScoutingCamera
            onPhotoTaken={photoData => {
              setImages(['plus', photoData, ...images.slice(1)]);
              setCameraOpen(false);
            }}
            onCancel={() => setCameraOpen(false)}
          />
        </Modal>
      )}
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

const styles = StyleSheet.create({
  imageList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 200,
    height: 250,
  },
  plusButton: {
    width: 200,
    height: 250,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
