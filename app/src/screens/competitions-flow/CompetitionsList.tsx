import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { NoInternet } from '../../components/NoInternet';
import EditCompetitionModal from '../../components/modals/EditCompetitionModal';
import CompetitionsDB from '../../database/Competitions';

const DEBUG = true;

const CompetitionsList = ({ setChosenComp }) => {
    const { colors } = useTheme();
    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState([]);
    useState(false);
    const [editCompetitionModalVisible, setEditCompetitionModalVisible] =
        useState(false);

    const [competitionToEdit, setCompetitionToEdit] = useState(null);

    const getCompetitions = async () => {
        if (DEBUG) {
            console.log('Starting to look for competitions');
        }

        try {
            const data = await CompetitionsDB.getCompetitions();
            // sort the data by start time
            data.sort((a, b) => {
                return new Date(a.startTime) - new Date(b.startTime);
            });
            setCompetitionList(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
    };

    useEffect(() => {
        getCompetitions().then(r => { });
    }, []);

    if (internetError) {
        return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
    }

    return (
        <View style={{ flex: 1 }}>
            {/*TODO: Make this bigger*/}
            <View
                style={{
                    alignSelf: 'center',
                    backgroundColor: colors.background,
                    height: '100%',
                    borderRadius: 10,
                    padding: '10%',
                    width: '100%',
                }}>
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        marginBottom: 20,
                        color: colors.text,
                        textDecorationStyle: 'solid',
                        textDecorationLine: 'underline',
                        textDecorationColor: colors.border,
                    }}>
                    Competitions
                </Text>
                {competitionList.length === 0 && (
                    <Text style={{ color: colors.text }}>
                        No competitions found.
                    </Text>
                )}
                <ScrollView>
                    {competitionList.map((comp, index) => (
                        <TouchableOpacity
                            key={comp.id}
                            onPress={() => {
                                setCompetitionToEdit(comp);
                                setEditCompetitionModalVisible(true);
                            }}
                            style={{
                                padding: 20,
                                borderRadius: 10,
                                backgroundColor:
                                    index % 2 === 0 ? colors.border : colors.background,
                            }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: 16,
                                }}>
                                {comp.name} ({new Date(comp.startTime).getFullYear()})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {competitionToEdit != null && editCompetitionModalVisible && (
                <EditCompetitionModal
                    setVisible={setEditCompetitionModalVisible}
                    onRefresh={getCompetitions}
                    tempComp={competitionToEdit}
                />
            )}
        </View>
    );
};

export default CompetitionsList;
