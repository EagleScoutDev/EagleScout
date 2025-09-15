import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Keyboard,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { type Theme, useNavigation, useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import PitScoutingCamera from './PitScoutingCamera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TeamInformation from '../../../components/form/TeamInformation';
import StandardButton from '../../../components/StandardButton';
import CompetitionsDB from '../../../database/Competitions';
import PitScoutReports, { type PitScoutReportWithoutId } from '../../../database/ScoutPitReports';
import FormHelper from '../../../FormHelper';
import FormSection from '../../../components/form/FormSection';
import FormComponent from '../../../components/form/FormComponent';

const Tab = createMaterialTopTabNavigator();

const ListSeparator = () => <View style={{ width: 10 }} />;

export function PitScoutingFlow() {
    const navigation = useNavigation();
    const theme = useTheme();
    const colors = theme.colors;
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [images, setImages] = useState<string[]>(['plus']);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [team, setTeam] = useState('');
    const [formData, setFormData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStructure, setFormStructure] = useState<any[]>([]);
    const [currentCompetition, setCurrentCompetition] = useState<any>();

    const [isOffline, setIsOffline] = useState(false);
    const [noActiveCompetition, setNoActiveCompetition] = useState(false);

    const defaultValues = useMemo(() => {
        return {
            radio: '',
            checkboxes: [],
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
    const initializeStructureFromCompetition = useCallback(
        (competition: any) => {
            const transformedStructure = transformStructure(
                competition.pitScoutFormStructure,
            );
            setFormStructure(transformedStructure);
            initializeValues(transformedStructure);
            setCurrentCompetition(competition);
        },
        [initializeValues],
    );
    useEffect(() => {
        CompetitionsDB.getCurrentCompetition()
            .then(async competition => {
                if (!competition) {
                    setNoActiveCompetition(true);
                    return;
                }
                setNoActiveCompetition(false);
                await AsyncStorage.setItem(
                    FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
                    JSON.stringify(competition),
                );
                initializeStructureFromCompetition(competition);
            })
            .catch(async e => {
                if (e.message && e.message.includes('Network request failed')) {
                    setIsOffline(true);
                }
                const storedComp = await FormHelper.readAsyncStorage(
                    FormHelper.ASYNCSTORAGE_COMPETITION_KEY,
                );
                if (storedComp != null) {
                    const competition = JSON.parse(storedComp);
                    initializeStructureFromCompetition(competition);
                } else {
                    setNoActiveCompetition(true);
                }
            });
    }, [initializeStructureFromCompetition]);
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
        const googleResponse = await fetch('https://google.com').catch(() => { });
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
    if (noActiveCompetition) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.text}>
                    There is no competition happening currently.
                </Text>

                {isOffline && (
                    <Text>
                        To check for competitions, please connect to the internet.
                    </Text>
                )}
            </View>
        );
    }
    return (
        <>
            <Tab.Navigator
                // change the position to be on the bottom
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.background,
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
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: 'bold',
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
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
                                    {currentCompetition != null && (
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontWeight: 'bold',
                                                fontSize: 20,
                                                textAlign: 'center',
                                                margin: '5%',
                                            }}>
                                            {currentCompetition.name} - Pit Scouting
                                        </Text>
                                    )}
                                    <TeamInformation team={team} setTeam={setTeam} />
                                </View>
                                <View style={{ width: '100%', marginBottom: '5%' }}>
                                    <StandardButton
                                        text={'Next'}
                                        onPress={() => {
                                            navigation.navigate(formStructure[0].title);
                                        }}
                                        color={colors.primary}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
                {formStructure &&
                    formStructure.map(({ title: key, questions: value }, index) => {
                        return (
                            <Tab.Screen
                                key={key}
                                name={key}
                                options={{
                                    // change font color in header
                                    tabBarLabelStyle: {
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    },

                                    tabBarStyle: {
                                        backgroundColor: colors.background,
                                    },
                                }}
                                children={() => (
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        <View
                                            style={{
                                                marginHorizontal: '5%',
                                            }}>
                                            <FormSection colors={colors} title={''} key={key.length} onModalPress={undefined}>
                                                {value.map(item => {
                                                    return (
                                                        <View
                                                            key={item.question}
                                                            style={{
                                                                marginVertical: '5%',
                                                            }}>
                                                            <FormComponent
                                                                key={item.question}
                                                                colors={colors}
                                                                item={item}
                                                                styles={styles}
                                                                arrayData={formData}
                                                                setArrayData={setFormData}
                                                            />
                                                        </View>
                                                    );
                                                })}
                                            </FormSection>
                                        </View>
                                        <View style={{ width: '100%', marginBottom: '5%' }}>
                                            <StandardButton
                                                text={'Next'}
                                                width={'85%'}
                                                onPress={() => {
                                                    if (index === formStructure.length - 1) {
                                                        navigation.navigate('Images');
                                                        return;
                                                    }
                                                    navigation.navigate(formStructure[index + 1].title);
                                                }}
                                                color={colors.primary}
                                            />
                                        </View>
                                    </ScrollView>
                                    // </KeyboardAvoidingView>
                                )}
                            />
                        );
                    })}
                <Tab.Screen
                    name={'Images'}
                    options={{
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: 'bold',
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                    children={() => (
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <View
                                style={{
                                    marginHorizontal: '5%',
                                }}>
                                <FormSection colors={theme.colors} title={'Attach Images'}>
                                    <FlatList
                                        style={styles.imageList}
                                        ItemSeparatorComponent={ListSeparator}
                                        data={images}
                                        renderItem={({ item }) => {
                                            if (item === 'plus') {
                                                return (
                                                    <Pressable onPress={() => setCameraOpen(true)}>
                                                        <View style={styles.plusButton}>
                                                            <Text style={styles.plusText}>+</Text>
                                                        </View>
                                                    </Pressable>
                                                );
                                            }
                                            return (
                                                <View>
                                                    <Pressable
                                                        style={styles.deleteContainer}
                                                        onPress={() => {
                                                            setImages(images.filter(i => i !== item));
                                                        }}>
                                                        <View style={styles.deleteButton}>
                                                            <TrashCan
                                                                color={colors.text}
                                                                style={{
                                                                    width: 20,
                                                                    height: 20,
                                                                }}
                                                            />
                                                        </View>
                                                    </Pressable>
                                                    <Image source={{ uri: item }} style={styles.image} />
                                                </View>
                                            );
                                        }}
                                        keyExtractor={item => item}
                                        horizontal={true}
                                    />
                                </FormSection>
                                <View style={{ width: '100%' }}>
                                    <StandardButton
                                        text={'Submit'}
                                        width={'85%'}
                                        color={colors.primary}
                                        isLoading={isSubmitting}
                                        onPress={submitForm}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    )}
                />
            </Tab.Navigator>

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
        </>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        heading: {
            color: colors.text,
            textAlign: 'center',
            paddingBottom: 15,
            fontWeight: 'bold',
            fontSize: 30,
            marginTop: 20,
        },
        imageList: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        image: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
        },
        plusButton: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
        },
        plusText: {
            fontSize: 50,
            color: colors.text,
        },
        deleteContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
        },
        deleteButton: {
            backgroundColor: colors.card,
            padding: 10,
            borderRadius: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: colors.text,
        },
        centeredContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        bottomMargin: { marginBottom: 300 },
    });
