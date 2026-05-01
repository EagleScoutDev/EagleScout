import { Alert, FlatList, Modal, Pressable, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import type { PicklistTeam } from "@/lib/db/models/Picklist";
import type { Setter } from "@/lib/util/react/types";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import type { TBATeam } from "@/lib/db/tba";

export interface TeamAddingModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    teamsList: PicklistTeam[];
    teamsAtCompetition: TBATeam[];
    addOrRemoveTeam: (team: TBATeam) => void;
}
export function TeamAddingModal({
    visible,
    setVisible,
    teamsList,
    teamsAtCompetition,
    addOrRemoveTeam,
}: TeamAddingModalProps) {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onDismiss={() => {
                setVisible(false);
            }}
            onRequestClose={() => {
                setVisible(false);
            }}
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
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <Pressable
                        onPress={() => {
                            Alert.alert("Would you like to add all teams?", "", [
                                {
                                    text: "No",
                                    onPress: () => {},
                                },
                                {
                                    text: "Yes",
                                    isPreferred: true,
                                    onPress: () => {
                                        for (let i = 0; i < teamsAtCompetition.length; i++) {
                                            addOrRemoveTeam(teamsAtCompetition[i]);
                                        }
                                        setVisible(false);
                                    },
                                },
                            ]);
                        }}
                    >
                        <Bs.CheckTwoCircle
                            size="24"
                            fill={
                                teamsList.length === teamsAtCompetition.length
                                    ? "gray"
                                    : colors.primary.hex
                            }
                        />
                    </Pressable>
                    <UIText size={20} bold style={{ marginVertical: "2%" }}>
                        List of Teams
                    </UIText>
                    <Pressable
                        onPress={() => {
                            setVisible(false);
                        }}
                    >
                        <Bs.XLg width="16" height="16" fill="gray" />
                    </Pressable>
                </View>
                <FlatList
                    style={{
                        marginTop: "5%",
                        marginLeft: "5%",
                    }}
                    data={teamsAtCompetition}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={{
                                    minWidth: "80%",
                                }}
                            >
                                <BouncyCheckbox
                                    size={30}
                                    fillColor={colors.primary.hex}
                                    unFillColor="#FFFFFF"
                                    text={item.team_number.toString()}
                                    textStyle={{
                                        color: colors.fg.hex,
                                        padding: "2%",
                                        fontSize: 20,
                                        textDecorationLine: "none",
                                    }}
                                    isChecked={teamsList.some(
                                        (team) => team.teamNumber === item.team_number,
                                    )}
                                    onPress={() => {
                                        addOrRemoveTeam(item);
                                    }}
                                />
                            </View>
                        );
                    }}
                />
            </View>
        </Modal>
    );
}
