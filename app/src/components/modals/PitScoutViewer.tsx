import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import PitReportsDB, {
    type PitReportReturnData,
} from '../../database/ScoutPitReports';
import RadioButtons from '../form/RadioButtons';
import { Checkboxes } from '../form/Checkboxes';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListSeparator = () => <View style={{ width: 10 }} />;

export const PitScoutViewer = ({
    visible,
    setVisible,
    data,
}: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    data: PitReportReturnData;
}) => {
    const { colors } = useTheme();
    const [sections, setSections] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
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
                    title: item.text,
                    questions: [],
                };
            } else {
                if (currentSection) {
                    item.indice = currentIndice;
                    item.data = data.data[currentIndice];
                    item.isEven = currentIndice % 2 === 0;
                    currentSection.questions.push(item);
                    currentIndice++;
                }
            }
        }
        newStructure.push(currentSection);
        return newStructure;
    };
    useEffect(() => {
        if (!data) {
            return;
        }
        console.log(
            JSON.stringify(data),
            JSON.stringify(transformStructure(data.formStructure)),
        );
        setSections(transformStructure(data.formStructure));
        PitReportsDB.getImagesForReport(data.teamNumber, data.reportId).then(
            images => {
                setImages(images);
            },
        );
    }, [data]);
    const styles = StyleSheet.create({
        container: {
            alignSelf: 'center',
            backgroundColor: colors.background,
            padding: '5%',
            // marginTop: '8%',
            height: '100%',
            width: '100%',
        },
        team_title: {
            fontSize: 30,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 5,
        },
        report_info: {
            textAlign: 'center',
            color: colors.text,
        },
        section_title: {
            // set the color to be the opposite of the background
            color: colors.text,
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            margin: '6%',
            textDecorationLine: 'underline',
        },
        no_info: {
            color: colors.notification,
            fontWeight: 'bold',
            flexWrap: 'wrap',
            fontSize: 15,
            flex: 1,
        },
        question: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            // wrap text if it's too long
            flex: 1,
            flexWrap: 'wrap',
            paddingBottom: 5,
        },
        image_list: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        image: {
            width: 200,
            height: 250,
        },
    });
    if (!data) {
        return <></>;
    }
    // @ts-ignore
    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            presentationStyle={'overFullScreen'}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '5%',
                        }}>
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={{
                                flex: 1,
                                alignItems: 'flex-end',
                            }}>
                            <X
                                style={{
                                    padding: '2%',
                                    width: 40,
                                    height: 40,
                                    fill: colors.notification,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View
                            style={{
                                borderRadius: 10,
                                padding: '5%',
                            }}>
                            <Text style={styles.team_title}>Team #{data.teamNumber}</Text>
                            <Text style={styles.report_info}>By: {data.submittedName}</Text>
                            <Text style={styles.report_info}>
                                {data.createdAt.toLocaleString()}
                            </Text>
                        </View>
                        {sections.map((sec, index) => (
                            <View key={index}>
                                <Text style={styles.section_title}>{sec.title}</Text>
                                {sec.questions.map(field => (
                                    <View
                                        style={{
                                            flexDirection:
                                                field.type === 'radio' ||
                                                    field.type === 'textbox' ||
                                                    field.type === 'checkboxes'
                                                    ? 'column'
                                                    : 'row',
                                            justifyContent: 'space-between',
                                            backgroundColor: field.isEven
                                                ? colors.border
                                                : 'transparent',
                                            padding: 10,
                                            margin: 5,
                                            borderRadius: 10,
                                        }}>
                                        <Text style={styles.question}>{field.question}</Text>
                                        {field.type === 'radio' && (
                                            <View>
                                                <RadioButtons
                                                    title={''}
                                                    colors={colors}
                                                    options={field.options}
                                                    value={field.options[field.data]}
                                                    disabled={true}
                                                />
                                            </View>
                                        )}
                                        {field.type === 'checkboxes' && (
                                            <>
                                                <Checkboxes
                                                    title={''}
                                                    disabled={true}
                                                    colors={colors}
                                                    options={field.options}
                                                    value={data.data[field.indice]}
                                                />
                                            </>
                                        )}
                                        {field.type !== 'radio' && field.type !== 'checkboxes' && (
                                            <Text
                                                style={{
                                                    color: colors.primary,
                                                    fontWeight: 'bold',
                                                    flexWrap: 'wrap',
                                                    fontSize: 15,
                                                    flex: 1,
                                                    textAlign:
                                                        field.type === 'textbox' ? 'left' : 'center',
                                                    alignSelf:
                                                        field.type === 'textbox' ? 'flex-start' : 'center',
                                                }}>
                                                {field.data.toString()}
                                            </Text>
                                        )}
                                        {(field.data == null || field.data === '') && (
                                            <Text style={styles.no_info}>N/A</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                        <Text style={styles.section_title}>Images</Text>
                        <FlatList
                            style={styles.image_list}
                            ItemSeparatorComponent={ListSeparator}
                            data={images}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.image} />
                            )}
                            // keyExtractor={item => item}
                            horizontal={true}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};
