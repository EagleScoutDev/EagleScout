import { useState } from "react";
import { UIText } from "../../../../ui/UIText";
import { Alert, FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { StandardButton } from "../../../../ui/StandardButton";
import type { PicklistTeam, SimpleTeam } from "../../../../database/Picklists";
import { TeamAddingModal } from "./TeamAddingModal";
import * as Bs from "../../../../ui/icons";
import { Color } from "../../../../lib/color.ts";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [addingTeams, setAddingTeams] = useState<boolean>(false);

    const addOrRemoveTeam = (team: SimpleTeam) => {
        console.log("Adding team to DNP:", team, teams);
        addToDNP(team);
    };

    const addOrRemovePicklistTeam = (team: PicklistTeam) => {
        // wacky ts workaround because im too lazy to recreate a SimpleTeam
        addToDNP(team as unknown as SimpleTeam);
    };

    return (
        <Modal
            visible={visible}
            animationType={"slide"}
            onDismiss={() => setVisible(false)}
            onRequestClose={() => setVisible(false)}
            presentationStyle={"pageSheet"}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.card,
                }}
            >
                <View
                    style={{
                        padding: "5%",
                        borderRadius: 10,
                    }}
                >
                    <UIText size={30} bold color={Color.parse(colors.notification)} style={{ textAlign: "center" }}>
                        Do Not Pick
                    </UIText>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 10,
                            // flex: 1,
                            paddingHorizontal: "2%",
                            marginBottom: "8%",
                            marginTop: "4%",
                        }}
                    >
                        <Bs.Search size="20" fill="gray" />
                        <TextInput
                            style={{
                                marginHorizontal: "4%",
                                height: 40,
                                color: colors.text,
                                flex: 1,
                            }}
                            onChangeText={(text) => setSearchTerm(text)}
                            value={searchTerm}
                            placeholderTextColor={"gray"}
                            placeholder={"Search"}
                            onEndEditing={() => {
                                console.log("onEndEditing");
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: colors.border,
                            paddingVertical: "2%",
                        }}
                    >
                        <UIText size={20} bold>
                            Team
                        </UIText>
                        <UIText size={20} bold>
                            Notes
                        </UIText>
                    </View>
                    <FlatList
                        data={teams
                            ?.filter((a) => a.dnp)
                            .filter((a) => a.team_number.toString().includes(searchTerm))
                            .sort((a, b) => a.team_number - b.team_number)}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        Alert.alert(
                                            `Would you like to remove Team ${item.team_number} from the Do Not Pick list?`,
                                            "",
                                            [
                                                {
                                                    text: "No",
                                                    onPress: () => {},
                                                },
                                                {
                                                    text: "Yes",
                                                    isPreferred: true,
                                                    onPress: () => {
                                                        addOrRemovePicklistTeam(item);
                                                    },
                                                },
                                            ]
                                        );
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        borderBottomWidth: 1,
                                        borderColor: colors.border,
                                        paddingVertical: "2%",
                                    }}
                                >
                                    <UIText size={20}>
                                        {item.team_number}
                                        {numbersToNames.size === 0 ? "" : " "}
                                        {numbersToNames.get(item.team_number)}
                                    </UIText>
                                    <UIText size={20}>{item.notes}</UIText>
                                </Pressable>
                            );
                        }}
                    />
                    <StandardButton
                        color={colors.primary}
                        width={"100%"}
                        text={"Add teams to Do Not Pick"}
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
}
