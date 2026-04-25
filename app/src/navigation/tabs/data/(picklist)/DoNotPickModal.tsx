import { useState } from "react";
import * as Bs from "@/ui/icons";
import { Alert, FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { TeamAddingModal } from "./TeamAddingModal";
import type { PicklistTeam } from "@/lib/db/models/Picklist";
import { StandardButton } from "@/ui/StandardButton";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import type { TBATeam } from "@/lib/db/tba";

export interface DoNotPickModalProps {
    visible: boolean;
    setVisible: (arg0: boolean) => void;
    teams: PicklistTeam[] | undefined;
    teamsAtCompetition: TBATeam[];
    numbersToNames: Map<number, string>;
    addToDNP: (team: PicklistTeam) => void;
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

    const addOrRemoveTeam = (team: TBATeam) => {
        console.log("Adding team to DNP:", team, teams);
        addToDNP({
            dnp: true,
            notes: "",
            tags: [],
            teamNumber: team.team_number,
        });
    };

    const addOrRemovePicklistTeam = (team: PicklistTeam) => {
        addToDNP(team);
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
                    backgroundColor: colors.bg1.hex,
                }}
            >
                <View
                    style={{
                        padding: "5%",
                        borderRadius: 10,
                    }}
                >
                    <UIText size={30} bold color={colors.danger} style={{ textAlign: "center" }}>
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
                                color: colors.fg.hex,
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
                            borderColor: colors.border.hex,
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
                            .filter((a) => a.teamNumber.toString().includes(searchTerm))
                            .sort((a, b) => a.teamNumber - b.teamNumber)}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        Alert.alert(
                                            `Would you like to remove Team ${item.teamNumber} from the Do Not Pick list?`,
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
                                            ],
                                        );
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        borderBottomWidth: 1,
                                        borderColor: colors.border.hex,
                                        paddingVertical: "2%",
                                    }}
                                >
                                    <UIText size={20}>
                                        {item.teamNumber}
                                        {numbersToNames.size === 0 ? "" : " "}
                                        {numbersToNames.get(item.teamNumber)}
                                    </UIText>
                                    <UIText size={20}>{item.notes}</UIText>
                                </Pressable>
                            );
                        }}
                    />
                    <StandardButton
                        color={colors.primary.hex}
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
                teamsList={teams!}
                teamsAtCompetition={teamsAtCompetition}
                addOrRemoveTeam={addOrRemoveTeam}
            />
        </Modal>
    );
}
