import { Alert, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useReducer, useRef, useState } from "react";
import { FormHelper } from "../../../FormHelper";
import Toast from "react-native-toast-message";
import { CompetitionsDB } from "../../../database/Competitions";
import { MatchReportsDB } from "../../../database/ScoutMatchReports";
import Confetti from "react-native-confetti";
import { useCurrentCompetitionMatches } from "../../../lib/hooks/useCurrentCompetitionMatches.ts";
import type { ScoutMenuScreenProps } from "../ScoutingFlow";
import { Form } from "../../../lib/forms";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert.ts";
import { useCurrentCompetition } from "../../../lib/hooks/useCurrentCompetition.ts";
import { ScoutingFlowTab } from "../components/ScoutingFlowTab.tsx";
import { MatchInformation } from "../components/MatchInformation.tsx";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { FormView } from "../../../forms/FormView.tsx";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";
import { Arrays } from "../../../lib/util/Arrays.ts";
import { Alliance, Orientation } from "../../../frc/common/common.ts";
import * as Reefscape from "../../../frc/reefscape";
import { AutoAction, AutoState } from "../../../frc/reefscape";
import { produce } from "immer";

export interface MatchScoutingFlowProps extends ScoutMenuScreenProps<"Match"> {}
const Tab = createMaterialTopTabNavigator<MatchScoutingParamList>();
export type MatchScoutingScreenProps<K extends keyof MatchScoutingParamList> = MaterialTopTabScreenProps<
    MatchScoutingParamList,
    K
>;
export type MatchScoutingParamList = {
    Setup: undefined;
    [k: `Form/${string}`]: undefined;
};

export function MatchScoutingFlow({ navigation }: MatchScoutingFlowProps) {
    "use memo";

    const { colors } = useTheme();
    const { competition, online } = useCurrentCompetition();
    const { getTeamsForMatch } = useCurrentCompetitionMatches();
    const [match, setMatch] = useState<number | null>(null);
    const teamsForMatch = match === null || match > 400 ? [] : getTeamsForMatch(match);
    const [team, setTeam] = useState<number | null>(null);

    const formStructure = competition?.form ?? null;
    const formSections = formStructure === null ? [] : Form.splitSections(formStructure);
    const autoSection = formSections?.find((s) => s.title === "Auto");

    const [sectionData, setSectionData] = useState<Form.Data[]>([]);

    const [orientation, setOrientation] = useState<Orientation>(Orientation.leftRed);
    const [alliance, setAlliance] = useState<Alliance>(Alliance.red);

    const [autoState, autoReducer] = useReducer(AutoAction.reduce, AutoState());

    const confetti = useRef<Confetti>(null);
    const autoModalRef = useRef<UISheetModal>(null);

    function reset() {
        setMatch(null);
        setTeam(null);
        resetResponses();
    }
    function resetResponses() {
        setSectionData(formSections === null ? [] : Form.initialize(formSections));
    }
    useEffect(() => void resetResponses(), [formStructure]);

    // TODO: THIS IS AN EXTREMELY STUPID AND DANGEROUS HACK TO
    //       COMPLY WITH THE OLD 2025 REEFSCAPE LINK SYSTEM!!!
    //       PLEASE REMOVE THIS FOR 2026 REBUILT!!!!!!!!!!!!!!
    //region Synchronize link data with form data
    useEffect(() => {
        let changed = false;
        let x = produce(autoState, (draft) => {
            for (let si = 0; si < formSections.length; si++) {
                let items = formSections[si].items;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (typeof item.link_to !== "string") continue;

                    if (draft.stats[item.link_to] !== (draft.stats[item.link_to] = sectionData[si][i])) {
                        changed = true;
                    }
                }
            }
        });
        if (changed) autoReducer({ type: "stupid", state: x });
    }, [sectionData]);
    useEffect(() => {
        let changed = false;
        let x = produce(sectionData, (draft) => {
            for (let si = 0; si < formSections.length; si++) {
                let items = formSections[si].items;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (typeof item.link_to !== "string") continue;

                    if (draft[si][i] !== (draft[si][i] = autoState.stats[item.link_to])) {
                        changed = true;
                    }
                }
            }
        });
        if (changed) setSectionData(x);
    }, [autoState]);
    //endregion

    async function submitForm() {
        if (competition === null || formStructure === null) return;

        if (match === null || match > 400) {
            await AsyncAlert.alert("Invalid Match Number", "Please enter a valid match number");
            navigation.navigate("Match");
            return;
        }
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

        let dataToSubmit = {
            data: sectionData.flat(),
            timelineData: [], // TODO: either implement this or purge it
            autoPath: autoState.path,

            matchNumber: match,
            teamNumber: team,
            competitionId: competition.id,
            competitionName: competition.name,
        };

        console.log("a")
        const internetResponse = await CompetitionsDB.getCurrentCompetition()
            .then(() => true)
            .catch(() => false);
        if (!internetResponse) {
            await FormHelper.saveFormOffline({
                ...dataToSubmit,
                form: formStructure,
                formId: competition?.formId,
            });
            reset();

            Toast.show({
                type: "success",
                text1: "Saved offline successfully!",
                visibilityTime: 3000,
            });

            const currentAssignments = await AsyncStorage.getItem("scout-assignments");
            if (currentAssignments !== null) {
                const newAssignments = JSON.parse(currentAssignments).filter(
                    (a) => !(a.matchNumber === match && (a.team === null || a.team.substring(3) === team))
                );
                await AsyncStorage.setItem("scout-assignments", JSON.stringify(newAssignments));
            }
        } else {
            console.log("b")
            try {
                await MatchReportsDB.createOnlineScoutReport(dataToSubmit);
                Toast.show({
                    type: "success",
                    text1: "Scouting report submitted!",
                    visibilityTime: 3000,
                });
                reset();

                confetti.current?.startConfetti();
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error submitting your scouting report.");
            }
        }

        navigation.navigate("Match");
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
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    zIndex: 114,
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Confetti ref={confetti} timeout={10} duration={3000} />
            </View>

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
                <Tab.Screen name={"Setup"}>
                    {({ navigation }) => (
                        <ScoutingFlowTab
                            title={competition ? `${competition.name}` : "Match Report"}
                            buttonText={"Next"}
                            onNext={() => navigation.navigate(`Form/${formSections[0].title}`)}
                        >
                            <MatchInformation
                                match={match}
                                setMatch={setMatch}
                                team={team}
                                setTeam={setTeam}
                                teamsForMatch={teamsForMatch}
                                orientation={orientation}
                                setOrientation={setOrientation}
                                alliance={alliance}
                                setAlliance={setAlliance}
                            />
                        </ScoutingFlowTab>
                    )}
                </Tab.Screen>
                {formSections?.map(({ title, items }, i) => {
                    const isLast = i === formSections.length - 1;

                    return (
                        <Tab.Screen
                            key={title}
                            name={`Form/${title}`}
                            options={{
                                title: title,
                            }}
                            listeners={{
                                tabPress: () => {
                                    if (title === "Auto") autoModalRef.current?.present();
                                },
                            }}
                        >
                            {({ navigation }) => (
                                <ScoutingFlowTab
                                    title={title}
                                    buttonText={isLast ? "Submit" : "Next"}
                                    onNext={
                                        isLast
                                            ? submitForm
                                            : () => navigation.navigate(`Form/${formSections[i + 1].title}`)
                                    }
                                >
                                    <FormView
                                        items={items}
                                        data={sectionData[i]}
                                        onInput={(data) => setSectionData(Arrays.set(sectionData, i, data))}
                                    />
                                </ScoutingFlowTab>
                            )}
                        </Tab.Screen>
                    );
                })}
            </Tab.Navigator>

            {autoSection && (
                <UISheetModal
                    ref={autoModalRef}
                    enablePanDownToClose
                    handleComponent={null}
                    onDismiss={() => autoModalRef.current?.dismiss()}
                >
                    <Reefscape.AutoModal
                        orientation={orientation}
                        alliance={alliance}
                        state={autoState}
                        dispatch={autoReducer}
                    />
                </UISheetModal>
            )}
        </>
    );
}
