import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { EnableScoutAssignmentsModal } from "../../../components/modals/EnableScoutAssignmentsModal";
import { useEffect, useState } from "react";
import { CompetitionsDB, ScoutAssignmentsConfig } from "../../../database/Competitions";
import { NoInternet } from "../../../ui/NoInternet";
import { useTheme } from "@react-navigation/native";
import type { ScoutAssignmentsScreenProps } from "./ScoutAssignments";

export interface ScoutAssignmentsMainProps extends ScoutAssignmentsScreenProps<"Main"> {}
export function ScoutAssignmentsMain({ navigation }: ScoutAssignmentsMainProps) {
    const [chosenComp, setChosenComp] = useState(null);
    const [enableScoutAssignmentsVisible, setEnableScoutAssignmentsVisible] = useState(false);
    const { colors } = useTheme();
    const [internetError, setInternetError] = useState(false);
    const [competitionList, setCompetitionList] = useState([]);

    const getCompetitions = async () => {
        try {
            const data = await CompetitionsDB.getCompetitions();
            // sort the data by start time
            data.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
            setCompetitionList(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
    };

    useEffect(() => {
        getCompetitions().catch(console.error);
    }, []);

    if (internetError) {
        return <NoInternet colors={colors} onRefresh={getCompetitions()} />;
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                {/*TODO: Make this bigger*/}
                <View
                    style={{
                        alignSelf: "center",
                        backgroundColor: colors.background,
                        height: "100%",
                        borderRadius: 10,
                        padding: "10%",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 25,
                            fontWeight: "bold",
                            marginBottom: 20,
                            color: colors.text,
                            textDecorationStyle: "solid",
                            textDecorationLine: "underline",
                            textDecorationColor: colors.border,
                        }}
                    >
                        Choose a Competition
                    </Text>
                    <ScrollView>
                        {competitionList.map((comp, index) => (
                            <TouchableOpacity
                                key={comp.id}
                                onPress={() => {
                                    setChosenComp(comp);
                                    console.log(comp);
                                    if (comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.DISABLED) {
                                        setEnableScoutAssignmentsVisible(true);
                                    } else {
                                        navigation.navigate("Spreadsheet", {
                                            competition: comp,
                                        });
                                    }
                                }}
                                style={{
                                    padding: 20,
                                    borderRadius: 10,
                                    backgroundColor: index % 2 === 0 ? colors.border : colors.background,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        fontSize: 16,
                                    }}
                                >
                                    {comp.name} ({new Date(comp.startTime).getFullYear()})
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <EnableScoutAssignmentsModal
                visible={enableScoutAssignmentsVisible}
                setVisible={setEnableScoutAssignmentsVisible}
                competition={chosenComp}
                onRefresh={() => getCompetitions().catch(console.error)}
            />
        </>
    );
}
