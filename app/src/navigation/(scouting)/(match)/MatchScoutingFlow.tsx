import { Alert, StyleSheet, View } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import { useEffect, useReducer, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import Confetti from "react-native-confetti";
import { useCurrentCompetitionMatches } from "@/lib/hooks/useCurrentCompetitionMatches";
import type { RootStackScreenProps } from "@/navigation";
import { Form } from "@/lib/forms";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { useCurrentCompetition } from "@/lib/hooks/useCurrentCompetition";
import { ScoutingFlowTab } from "@/navigation/(scouting)/components/ScoutingFlowTab";
import { MatchInformation } from "@/navigation/(scouting)/components/MatchInformation";
import { FormView } from "@/components/FormView";
import { Arrays } from "@/lib/util/Arrays";
import { Alliance, Orientation } from "@/frc/common/common";
import * as Reefscape from "@/frc/reefscape";
import { AutoAction, AutoState } from "@/frc/reefscape";
import { FormHelper } from "@/lib/FormHelper";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { UIText } from "@/ui/components/UIText";
import { HeaderTimer } from "@/navigation/(scouting)/components/HeaderTimer";
import { UITabView } from "@/ui/components/UITabView";

export interface MatchScoutingFlowProps extends RootStackScreenProps<"Match"> {}

export function MatchScoutingFlow({ navigation }: MatchScoutingFlowProps) {
    "use no memo";

    const { competition, online } = useCurrentCompetition();
    const { getTeamsForMatch } = useCurrentCompetitionMatches();
    const [match, setMatch] = useState<number | null>(null);
    const teamsForMatch = match === null || match > 400 ? [] : getTeamsForMatch(match);
    const [team, setTeam] = useState<number | null>(null);

    const formStructure = competition?.form ?? null;
    const formSections = formStructure === null ? [] : Form.splitSections(formStructure);

    const [currentTab, setCurrentTab] = useState("Setup");

    const [orientation, setOrientation] = useState<Orientation>(Orientation.leftRed);
    const [alliance, setAlliance] = useState<Alliance>(Alliance.red);

    const [autoState, autoReducer] = useReducer(AutoAction.reduce, AutoState());
    const [sectionData, setSectionData] = useState<Form.Data[]>([]);

    const confettiRef = useRef<Confetti>(null);
    const autoModalRef = useRef<UISheetModal>(null);
    const timerRef = useRef<HeaderTimer>(null);

    function resetResponses() {
        setSectionData(formSections.length === 0 ? [] : Form.initialize(formSections));
    }
    function reset() {
        setMatch(null);
        setTeam(null);
        resetResponses();
    }

    useEffect(() => {
        resetResponses();
    }, [formStructure]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderTimer ref={timerRef} />,
        });
    }, [navigation]);

    async function submitForm() {
        if (competition === null || formStructure === null) return;

        if (match === null || match > 400) {
            await AsyncAlert.alert("Invalid Match Number", "Please enter a valid match number");
            return;
        }
        if (team === null) {
            await AsyncAlert.alert("Invalid Team Number", "Please enter a valid team number");
            return;
        }

        let missing = Form.checkRequired(formSections, sectionData);
        if (missing) {
            Alert.alert(
                "Required Question: " + missing.question + " not filled out",
                "Please fill out all questions denoted with an asterisk",
            );
            return;
        }

        let dataToSubmit = {
            data: Form.packSectionData(sectionData),
            timelineData: [], // TODO: either implement this or purge it
            autoPath: autoState.path,

            matchNumber: match,
            teamNumber: team,
            competitionId: competition.id,
            competitionName: competition.name,
        };

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
                    (a: { matchNumber: number; team: string | null; }) =>
                        !(
                            a.matchNumber === match &&
                            (a.team === null || parseInt(a.team.substring(3)) === team)
                        ),
                );
                await AsyncStorage.setItem("scout-assignments", JSON.stringify(newAssignments));
            }
        } else {
            try {
                await MatchReportsDB.createOnlineScoutReport(dataToSubmit);
                Toast.show({
                    type: "success",
                    text1: "Scouting report submitted!",
                    visibilityTime: 3000,
                });
                reset();

                confettiRef.current?.startConfetti();
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error submitting your scouting report.");
            }
        }

        navigation.goBack();
    }

    if (competition === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <UIText>There is no competition happening currently.</UIText>

                {!online && (
                    <UIText>To check for competitions, please connect to the internet.</UIText>
                )}
            </View>
        );
    }

    return <>
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 114,
                pointerEvents: "none",
                width: "100%",
                height: "100%",
            }}
        >
            <Confetti ref={confettiRef} timeout={10} duration={3000} />
        </View>

        <UITabView
            currentKey={currentTab}
            onTabChange={(tab) => {
                setCurrentTab(tab);
                if (tab.includes("Auto")) {
                    autoModalRef.current?.present();
                }
            }}
        >
            <UITabView.Tab tabKey="Setup" title="Setup">
                <ScoutingFlowTab
                    title={competition.name}
                    buttonText={"Next"}
                    onNext={() => setCurrentTab(`Form/${formSections[0].title}`)}
                >
                    <MatchInformation
                        match={match}
                        setMatch={setMatch}
                        team={team}
                        setTeam={setTeam}
                        orientation={orientation}
                        setOrientation={setOrientation}
                        alliance={alliance}
                        setAlliance={setAlliance}
                        teamsForMatch={teamsForMatch}
                    />
                </ScoutingFlowTab>
            </UITabView.Tab>

            {formSections.map(({ title, items }, i) => {
                const isLast = i === formSections.length - 1;

                return (
                    <UITabView.Tab key={`Form/${title}`} tabKey={`Form/${title}`} title={title}>
                        <ScoutingFlowTab
                            title={title}
                            buttonText={isLast ? "Submit" : "Next"}
                            onNext={
                                isLast
                                    ? submitForm
                                    : () => setCurrentTab(`Form/${formSections[i + 1].title}`)
                            }
                        >
                            <FormView
                                items={items}
                                data={sectionData[i]}
                                onInput={(data) => setSectionData(Arrays.set(sectionData, i, data))}
                            />
                        </ScoutingFlowTab>
                    </UITabView.Tab>
                );
            })}
        </UITabView>

        <UISheetModal ref={autoModalRef}>
            <Reefscape.AutoModal
                orientation={orientation}
                alliance={alliance}
                state={autoState}
                dispatch={autoReducer}
            />
        </UISheetModal>
    </>;
}
