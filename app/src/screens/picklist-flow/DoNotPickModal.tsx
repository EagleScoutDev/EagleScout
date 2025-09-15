import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { PicklistTeam } from '../../database/Picklists';
import Svg, { Path } from 'react-native-svg';
import { StandardButton } from '../../components/StandardButton';
import { TeamAddingModal } from './TeamAddingModal';
import type { SimpleTeam } from '../../lib/TBAUtils';

export interface DoNotPickModalProps {
    visible: boolean;
    setVisible: (arg0: boolean) => void;
    teams: PicklistTeam[] | undefined;
    teamsAtCompetition: SimpleTeam[];
    numbersToNames: Map<number, string>;
    addToDNP: (team: SimpleTeam) => void;
}
export function DoNotPickModal({
    visible,
    setVisible,
    teams,
    teamsAtCompetition,
    numbersToNames,
    addToDNP,
}: DoNotPickModalProps) {
    const { colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [addingTeams, setAddingTeams] = useState<boolean>(false);

    const addOrRemoveTeam = (team: SimpleTeam) => {
        console.log('Adding team to DNP:', team, teams);
        addToDNP(team);
    };

    const addOrRemovePicklistTeam = (team: PicklistTeam) => {
        // wacky ts workaround because im too lazy to recreate a SimpleTeam
        addToDNP(team as unknown as SimpleTeam);
    };

    return (
        <Modal
            visible={visible}
            animationType={'slide'}
            onDismiss={() => setVisible(false)}
            onRequestClose={() => setVisible(false)}
            presentationStyle={'pageSheet'}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.card,
                }}>
                <View
                    style={{
                        padding: '5%',
                        borderRadius: 10,
                    }}>
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 30,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>
                        Do Not Pick
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 10,
                            // flex: 1,
                            paddingHorizontal: '2%',
                            marginBottom: '8%',
                            marginTop: '4%',
                        }}>
                        <Svg width={'20'} height="20" viewBox="0 0 16 16">
                            <Path
                                fill={'gray'}
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                            />
                        </Svg>
                        <TextInput
                            style={{
                                marginHorizontal: '4%',
                                height: 40,
                                color: colors.text,
                                flex: 1,
                            }}
                            onChangeText={text => setSearchTerm(text)}
                            value={searchTerm}
                            placeholderTextColor={'gray'}
                            placeholder={'Search'}
                            onEndEditing={() => {
                                console.log('onEndEditing');
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderColor: colors.border,
                            paddingVertical: '2%',
                        }}>
                        <Text
                            style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>
                            Team
                        </Text>
                        <Text
                            style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>
                            Notes
                        </Text>
                    </View>
                    <FlatList
                        data={teams
                            ?.filter(a => a.dnp)
                            .filter(a => a.team_number.toString().includes(searchTerm))
                            .sort((a, b) => a.team_number - b.team_number)}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        Alert.alert(
                                            `Would you like to remove Team ${item.team_number} from the Do Not Pick list?`,
                                            '',
                                            [
                                                {
                                                    text: 'No',
                                                    onPress: () => { },
                                                },
                                                {
                                                    text: 'Yes',
                                                    isPreferred: true,
                                                    onPress: () => {
                                                        addOrRemovePicklistTeam(item);
                                                    },
                                                },
                                            ],
                                        );
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 1,
                                        borderColor: colors.border,
                                        paddingVertical: '2%',
                                    }}>
                                    <Text style={{ color: colors.text, fontSize: 20 }}>
                                        {item.team_number}
                                        {numbersToNames.size === 0 ? '' : ' '}
                                        {numbersToNames.get(item.team_number)}
                                    </Text>
                                    <Text style={{ color: colors.text, fontSize: 20 }}>
                                        {item.notes}
                                    </Text>
                                </Pressable>
                            );
                        }}
                    />
                    <StandardButton
                        color={colors.primary}
                        width={'100%'}
                        text={'Add teams to Do Not Pick'}
                        onPress={() => {
                            // setVisible(false);
                            setAddingTeams(true);
                        }}
                    />
                </View>
            </View>
            <TeamAddingModal
                visible={addingTeams}
                setVisible={setAddingTeams}
                teams_list={teams!}
                teamsAtCompetition={teamsAtCompetition}
                addOrRemoveTeam={addOrRemoveTeam}
            />
        </Modal>
    );
};
