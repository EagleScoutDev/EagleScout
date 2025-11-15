import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { TeamInformation } from "../components/TeamInformation.tsx";
import { CompetitionsDB } from "../../../database/Competitions";
import { PitReportsDB, type PitReportWithoutId } from "../../../database/ScoutPitReports";
import { FormHelper } from "../../../FormHelper";
import type { ScoutMenuScreenProps } from "../ScoutingFlow";
import { ScoutingFlowTab } from "../components/ScoutingFlowTab.tsx";
import { Form } from "../../../lib/forms";
import { FormView } from "../../../forms/FormView.tsx";
import { useCurrentCompetition } from "../../../lib/hooks/useCurrentCompetition.ts";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert.ts";
import { Arrays } from "../../../lib/util/Arrays.ts";
import { PitScoutingImageList } from "./PitScoutingImageList.tsx";

const Tab = createMaterialTopTabNavigator();
export type PitFlowScreenProps<K extends keyof PitFlowParamList> = MaterialTopTabScreenProps<PitFlowParamList, K>;
export type PitFlowParamList = {
    Match: undefined;
    [k: `Form/${string}`]: undefined;
    Images: undefined;
};

export interface PitFlowProps extends ScoutMenuScreenProps<"Pit"> {}
export function PitScoutingFlow({ navigation }: PitFlowProps) {
    "use memo";

    const theme = useTheme();
    const colors = theme.colors;

    const { competition, online } = useCurrentCompetition();
    const formStructure = competition?.pitScoutFormStructure ?? null;
    const formSections = formStructure === null ? [] : Form.splitSections(formStructure);

    const [images, setImages] = useState<string[]>(["plus"]);
    const [team, setTeam] = useState<number | null>(null);
    const [sectionData, setSectionData] = useState<any[]>([]);

    function reset() {
        setTeam(null);
        setImages(["plus"]);
        resetResponses();
    }
    function resetResponses() {
        setSectionData(formSections === null ? [] : Form.initialize(formSections));
    }
    useEffect(() => void resetResponses(), [formStructure]);

    async function submitForm() {
        if (competition === null || formStructure === null) return;

        if (team === null) {
            await AsyncAlert.alert("Invalid Team Number", "Please enter a valid team number");
            navigation.navigate("Match");
            return;
        }

        let missing = Form.checkRequired(formSections, sectionData);
        if (missing) {
            Alert.alert(
                "Required Question: " + missing.question + " not filled out",
                "Please fill out all questions denoted with an asterisk"
            );
            return;
        }

        const data: PitReportWithoutId = {
            data: sectionData.flat(),
            teamNumber: team,
            competitionId: competition.id,
        };
        const internetResponse = await CompetitionsDB.getCurrentCompetition()
            .then(() => true)
            .catch(() => false);
        if (!internetResponse) {
            await FormHelper.savePitFormOffline(
                data,
                images.filter((item) => item !== "plus")
            );
            reset();

            Toast.show({
                type: "success",
                text1: "Saved offline successfully!",
                visibilityTime: 3000,
            });
        } else {
            try {
                await PitReportsDB.createOnlinePitScoutReport(
                    data,
                    images.filter((item) => item !== "plus")
                );
                reset();

                Toast.show({
                    type: "success",
                    text1: "Submitted successfully!",
                    visibilityTime: 3000,
                });
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error submitting your pit report.");
            }
        }
    }

    if (competition === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: colors.text }}>There is no competition happening currently.</Text>

                {!online && <Text>To check for competitions, please connect to the internet.</Text>}
            </View>
        );
    }

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: colors.background,
                    },
                    tabBarLabelStyle: {
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: "bold",
                    },
                }}
            >
                <Tab.Screen
                    name={"Match"}
                    options={{
                        title: "Match",
                    }}
                    children={({ navigation }) => (
                        <ScoutingFlowTab
                            title={competition ? `${competition.name}` : "Pit Scouting"}
                            buttonText={"Next"}
                            onNext={() => navigation.navigate({ screen: `Form/${formSections[0].title}` })}
                        >
                            <TeamInformation team={team} setTeam={setTeam} />
                        </ScoutingFlowTab>
                    )}
                />
                {formSections?.map((section, i) => (
                    <Tab.Screen
                        key={section.title}
                        name={`Form/${section.title}`}
                        options={{
                            title: section.title,
                        }}
                        children={({ navigation }) => (
                            <ScoutingFlowTab
                                buttonText={"Next"}
                                title={section.title}
                                onNext={() => {
                                    navigation.navigate({
                                        screen:
                                            i === formSections.length - 1
                                                ? "Images"
                                                : `Form/${formSections[i + 1].title}`,
                                    });
                                }}
                            >
                                <FormView
                                    items={section.items}
                                    data={sectionData[i]}
                                    onInput={(data) => setSectionData(Arrays.set(sectionData, i, data))}
                                />
                            </ScoutingFlowTab>
                        )}
                    />
                ))}
                <Tab.Screen name={"Images"}>
                    {() => (
                        <ScoutingFlowTab title={"Images"} buttonText="Submit" onNext={submitForm}>
                            <PitScoutingImageList images={images} setImages={setImages} />
                        </ScoutingFlowTab>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </>
    );
}
