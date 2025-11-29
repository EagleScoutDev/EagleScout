import { useEffect, useState } from "react";
import { UIText } from "../../../ui/UIText";
import { Alert, View } from "react-native";

import Toast from "react-native-toast-message";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { TeamInformation } from "../components/TeamInformation";
import { CompetitionsDB } from "../../../database/Competitions";
import { PitReportsDB, type PitReportWithoutId } from "../../../database/ScoutPitReports";
import { FormHelper } from "../../../FormHelper";
import type { ScoutMenuScreenProps } from "../ScoutingFlow";
import { ScoutingFlowTab } from "../components/ScoutingFlowTab";
import { Form } from "../../../lib/forms";
import { FormView } from "../../../forms/FormView";
import { useCurrentCompetition } from "../../../lib/hooks/useCurrentCompetition";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert";
import { Arrays } from "../../../lib/util/Arrays";
import { PitScoutingImageList } from "./PitScoutingImageList";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

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
            data: Form.packSectionData(sectionData),
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
                <UIText>There is no competition happening currently.</UIText>

                {!online && <UIText>To check for competitions, please connect to the internet.</UIText>}
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: colors.bg0.hex,
                        },
                        tabBarLabelStyle: {
                            color: colors.fg.hex,
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
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
