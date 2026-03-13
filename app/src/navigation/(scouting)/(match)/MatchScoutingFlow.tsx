import { Alert, StyleSheet, View } from "react-native";
import AsyncStorage from "expo-sqlite/kv-store";
import { useEffect, useRef, useState } from "react";
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
import { Arrays } from "@/lib/util/Arrays";
import { Alliance, Orientation } from "@/frc/common/common";
import * as Rebuilt from "@/frc/rebuilt";
import { AutoAction, AutoState, type LinkName } from "@/frc/rebuilt";
import { FormHelper } from "@/lib/FormHelper";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { UIText } from "@/ui/components/UIText";
import { HeaderTimer } from "../components/HeaderTimer";
import { UITabView } from "@/ui/components/UITabView";
import { FormView } from "@/components/FormView";

export interface MatchScoutingFlowProps extends RootStackScreenProps<"Match"> {}

export function MatchScoutingFlow({ navigation }: MatchScoutingFlowProps) {
    "use no memo"; // TODO: fix this
    const log = (...args: unknown[]) => console.log("[MatchScoutingFlow]", ...args);

    const { competition, online } = useCurrentCompetition();
    const { getTeamsForMatch } = useCurrentCompetitionMatches();
    const [match, setMatch] = useState<number | null>(null);
    const teamsForMatch = match === null || match > 400 ? [] : getTeamsForMatch(match);
    const [team, setTeam] = useState<number | null>(null);

    const formStructure = competition?.form ?? null;
    const formSections = formStructure === null ? [] : Form.splitSections(formStructure);

    const [currentTab, setCurrentTab] = useState("Setup");
    const [sectionData, setSectionData] = useState<Form.Data[]>([]);

    const [orientation, setOrientation] = useState<Orientation>(Orientation.leftRed);
    const [alliance, setAlliance] = useState<Alliance>(Alliance.red);

    const [autoState, setAutoState] = useState<AutoState>(AutoState());
    function autoReducer(
        action:
            | AutoAction
            | { type: "undo" }
            | { type: "update_link"; linkName: LinkName; value: number },
    ) {
        const result = AutoAction.reduce(autoState, action, formSections, sectionData);
        setAutoState(result.state);
        if (result.formData) {
            setSectionData(result.formData);
        }
    }

    function updateSectionData(sectionIndex: number, newData: Form.Data) {
        const newSectionData = Arrays.set(sectionData, sectionIndex, newData);
        setSectionData(newSectionData);

        // Dispatch update_link actions for any linked fields that changed
        const items = formSections[sectionIndex].items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (typeof item.link_to === "string" && sectionData[sectionIndex]?.[i] !== newData[i]) {
                const value = newData[i];
                if (typeof value === "number") {
                    autoReducer({ type: "update_link", linkName: item.link_to as LinkName, value });
                }
            }
        }
    }

    const useConfetti = useRef<Confetti>(null);
    const autoModalRef = useRef<UISheetModal>(null);
    const timerRef = useRef<HeaderTimer>(null);

    function reset() {
        setMatch(null);
        setTeam(null);
        resetResponses();
    }
    function resetResponses() {
        setSectionData(formSections === null ? [] : Form.initialize(formSections));
    }
    useEffect(() => void resetResponses(), [formStructure]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderTimer ref={timerRef} />,
        });
    }, [navigation]);

    useEffect(() => {
        log("currentTab", currentTab);
        if (!currentTab.startsWith("Form/")) return;
        const index = Number.parseInt(currentTab.slice("Form/".length), 10);
        if (Number.isNaN(index)) return;
        const title = formSections[index]?.title ?? "";
        if (title.includes("Auto")) {
            log("presenting auto modal", { index, title });
            autoModalRef.current?.present();
        }
    }, [currentTab, formSections]);

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
                    (a) =>
                        !(
                            a.matchNumber === match &&
                            (a.team === null || a.team.substring(3) === team)
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

                useConfetti.current?.startConfetti();
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
                <UIText>There is no competition happening currently.</UIText>

                {!online && (
                    <UIText>To check for competitions, please connect to the internet.</UIText>
                )}
            </View>
        );
    }

    const hasFormSections = formSections.length > 0;
    const firstFormTabKey = hasFormSections ? "Form/0" : null;
    const formTabKey = (index: number) => `Form/${index}`;

    return (
        <>
            <View
                style={{
                    ...StyleSheet.absoluteFill,
                    zIndex: 114,
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Confetti ref={useConfetti} timeout={10} duration={3000} />
            </View>

            <UITabView
                currentKey={currentTab}
                onTabChange={(tab) => {
                    log("tab change", { from: currentTab, to: tab });
                    setCurrentTab(tab);
                }}
            >
                <UITabView.Tab tabKey="Setup" title="Setup">
                    <ScoutingFlowTab
                        title={competition ? `${competition.name}` : "Match Report"}
                        buttonText={hasFormSections ? "Next" : "Submit"}
                        onNext={() => {
                            if (firstFormTabKey) {
                                log("setup next", { to: firstFormTabKey });
                                setCurrentTab(firstFormTabKey);
                            } else {
                                log("setup submit (no form sections)");
                                void submitForm();
                            }
                        }}
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
                    const data = sectionData[i] ?? Form.initialize([formSections[i]])[0];

                    return (
                        <UITabView.Tab key={formTabKey(i)} tabKey={formTabKey(i)} title={title}>
                            <ScoutingFlowTab
                                title={title}
                                buttonText={isLast ? "Submit" : "Next"}
                                onNext={
                                    isLast
                                        ? () => {
                                              void submitForm();
                                          }
                                        : () => {
                                              const next = formTabKey(i + 1);
                                              setCurrentTab(next);
                                          }
                                }
                            >
                                <FormView
                                    items={items}
                                    data={data}
                                    onInput={(newData) => updateSectionData(i, newData)}
                                />
                            </ScoutingFlowTab>
                        </UITabView.Tab>
                    );
                })}
            </UITabView>

            <UISheetModal ref={autoModalRef}>
                <Rebuilt.AutoModal
                    orientation={orientation}
                    alliance={alliance}
                    state={autoState}
                    dispatch={autoReducer}
                />
            </UISheetModal>
        </>
    );
}
