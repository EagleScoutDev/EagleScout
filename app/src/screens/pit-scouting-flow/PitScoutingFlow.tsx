import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PitScoutingCamera from './PitScoutingCamera';
import {useTheme} from '@react-navigation/native';
import FormSection from '../../components/form/FormSection';
import FormComponent from '../../components/form/FormComponent';
import StandardButton from '../../components/StandardButton';
import TeamInformation from '../../components/form/TeamInformation';
import CompetitionsDB from '../../database/Competitions';

export default function PitScoutingFlow() {
  const {colors} = useTheme();
  const [images, setImages] = useState<string[]>(['plus']);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [team, setTeam] = useState('');
  const [formData, setFormData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStructure, setFormStructure] = useState<any[]>([]);
  const [competitionLoading, setCompetitionLoading] = useState(true);
  const transformStructure = (structure: any[]) => {
    const newStructure: any[] = [];
    let currentSection: {
      title: string;
      questions: any[];
    } | null = null;
    for (const item of structure) {
      if (item.type === 'heading') {
        if (currentSection) {
          newStructure.push(currentSection);
        }
        currentSection = {
          title: item.text,
          questions: [],
        };
      } else {
        if (currentSection) {
          currentSection.questions.push(item);
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
      setFormStructure(transformStructure(competition.pitScoutFormStructure));
      setCompetitionLoading(false);
    });
  }, []);
  const submitForm = () => {
    setIsSubmitting(true);
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
        formStructure.map(section => (
          <FormSection
            colors={colors}
            title={section.title}
            key={section.title.length}>
            {section.questions.map((item: any) => (
              <>
                {/* @ts-ignore */}
                <FormComponent
                  key={item.question}
                  colors={colors}
                  item={item}
                  styles={styles}
                  arrayData={formData}
                  setArrayData={setFormData}
                />
              </>
            ))}
          </FormSection>
        ))}
      <FormSection colors={colors} title={'Attach Images'} disabled={false}>
        <FlatList
          style={styles.imageList}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
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
    paddingLeft: 10,
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
