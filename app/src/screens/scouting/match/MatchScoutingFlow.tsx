import { Alert, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormHelper } from "../../../FormHelper";
import Toast from "react-native-toast-message";
import { type CompetitionReturnData, CompetitionsDB } from "../../../database/Competitions";
import { MatchReportsDB } from "../../../database/ScoutMatchReports";
import { Gamification } from "./Gamification";
import Confetti from "react-native-confetti";
import { useCurrentCompetitionMatches } from "../../../lib/react/hooks/useCurrentCompetitionMatches.ts";
import { Alliance, Orientation } from "../../../games/common";
import type { ScoutMenuScreenProps } from "../ScoutingFlow";
import { Form } from "../../../lib/forms";

export interface MatchScoutingFlowProps extends ScoutMenuScreenProps<"Match"> {}
export function MatchScoutingFlow({ navigation, route }: MatchScoutingFlowProps) {
    const defaultValues = useMemo(() => {
        return {
            radio: "",
            checkboxes: [],
            textbox: "",
            number: 0,
            slider: 0,
        };
    }, []);

    const { colors } = useTheme();
    const [match, setMatch] = useState<number | null>(null);
    const [team, setTeam] = useState<number | null>(null);
    const [competition, setCompetition] = useState<CompetitionReturnData | null>(null);

    const formStructure = competition?.form ?? null;
    const formSections = useMemo(
        () => (formStructure === null ? null : Form.splitSections(formStructure)),
        [formStructure]
    );

    const [autoPath, setAutoPath] = useState([]);
    const [formData, setFormData] = useState<Form.Data>([]);

    const [startRelativeTime, setStartRelativeTime] = useState(-1);
    const [timeline, setTimeline] = useState([]);
    const [fieldOrientation, setFieldOrientation] = useState<Orientation>(Orientation.red);
    const [selectedAlliance, setSelectedAlliance] = useState<Alliance>(Alliance.red);

    const [isOffline, setIsOffline] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const confetti = useRef<Confetti>(null);

    const { competitionId, matches, getTeamsForMatch } = useCurrentCompetitionMatches();
    const [teamsForMatch, setTeamsForMatch] = useState([]);
    useEffect(() => {
        if (!match || match > 400) {
            return;
        }
        const teams = getTeamsForMatch(Number(match));
        if (teams.length > 0) {
            setTeamsForMatch(teams);
        }
    }, [match, competitionId, matches]);

    function checkRequiredFields(tempArray) {
        for (let i = 0; i < formStructure.length; i++) {
            let item = formStructure[i];
            let value = tempArray[i];

            if (!item.required) continue;
            if (value === "" || value == null) {
                Alert.alert(
                    "Required Question: " + item.question + " not filled out",
                    "Please fill out all questions denoted with an asterisk"
                );
                return false;
            }
        }
        return true;
    }

    const initForm = useCallback(
        (form) => {
            let tempArray = new Array(form.length);
            for (let i = 0; i < form.length; i++) {
                if (form[i].type === "heading") {
                    tempArray[i] = null;
                } else if (form[i].type === "radio") {
                    tempArray[i] = form[i].defaultIndex;
                } else if (form[i].type === "checkbox") {
                    tempArray[i] = form[i].checkedByDefault;
                } else {
                    tempArray[i] = defaultValues[form[i].type];
                }
            }
            setFormData(tempArray);
        },
        [defaultValues]
    );

    const loadFormStructure = useCallback(async () => {
        let dbRequestWorked;
        let competition: CompetitionReturnData | null = null;
        try {
            competition = await CompetitionsDB.getCurrentCompetition();
            dbRequestWorked = true;
        } catch (e) {
            dbRequestWorked = false;
        }

        if (dbRequestWorked) {
            if (competition != null) {
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY, JSON.stringify(competition));
            }
        } else {
            const storedComp = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
            if (storedComp != null) {
                competition = JSON.parse(storedComp);
            }
        }
        setIsOffline(!dbRequestWorked);
        console.log("LOADINGCOMPS");

        if (competition !== null) {
            setCompetition(competition);
            initForm(competition.form);
        } else {
            setCompetition(null);
        }
    }, []);

    const submitForm = async () => {
        if (match > 400 || !match) {
            Alert.alert("Invalid Match Number", "Please enter a valid match number");
            navigation.navigate("Match");
            return;
        }

        if (!team) {
            Alert.alert("Invalid Team Number", "Please enter a valid team number");
            navigation.navigate("Match");
            return;
        }
        setIsSubmitting(true);

        // array containing the raw values of the form
        let tempArray = [...formData];

        if (!checkRequiredFields(tempArray)) {
            setIsSubmitting(false);
            return;
        }

        let dataToSubmit = {
            data: tempArray,
            timelineData: Object.fromEntries(timeline.entries()),
            autoPath,
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
            Toast.show({
                type: "success",
                text1: "Saved offline successfully!",
                visibilityTime: 3000,
            });
            const currentAssignments = await AsyncStorage.getItem("scout-assignments");
            if (currentAssignments != null) {
                const newAssignments = JSON.parse(currentAssignments).filter(
                    (a) => !(a.matchNumber === match && (a.team === null || a.team.substring(3) === team))
                );
                await AsyncStorage.setItem("scout-assignments", JSON.stringify(newAssignments));
            }
            setMatch(null);
            setTeam(null);
            setAutoPath([]);
            initForm(formStructure);

            confetti.current?.startConfetti();
            navigation.navigate("Match");
        } else {
            try {
                await MatchReportsDB.createOnlineScoutReport(dataToSubmit);
                Toast.show({
                    type: "success",
                    text1: "Scouting report submitted!",
                    visibilityTime: 3000,
                });
                setMatch(null);
                setTeam(null);
                resetTimer();
                setAutoPath([]);
                initForm(formStructure);
                confetti.current?.startConfetti();
                navigation.navigate("Match");
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "There was an error submitting your scouting report.");
            }
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        return navigation.addListener("focus", () => {
            if (route.params != null) {
                const { team: paramsTeam, match: paramsMatch } = route.params;
                console.log("team: ", paramsTeam);
                paramsTeam != null ? setTeam(paramsTeam.toString()) : setTeam("");
                paramsMatch != null ? setMatch(paramsMatch.toString()) : setMatch("");
                //navigation.setParams({team: undefined, params: undefined});
                navigation.setParams({ team: undefined, match: undefined });
            }
        });
    }, [navigation, route.params]);

    useEffect(() => {
        loadFormStructure().catch(console.error);
    }, [loadFormStructure]);

    if (competition === null) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: colors.text }}>There is no competition happening currently.</Text>

                {isOffline && <Text>To check for competitions, please connect to the internet.</Text>}
            </View>
        );
    }

    return (
        <>
            <View
                style={{
                    zIndex: 100,
                    pointerEvents: "none",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <Confetti ref={confetti} timeout={10} duration={3000} />
            </View>
            <Gamification
                match={match}
                setMatch={setMatch}
                team={team}
                setTeam={setTeam}
                alliance={selectedAlliance}
                orientation={fieldOrientation}
                setOrientation={setFieldOrientation}
                teamsForMatch={teamsForMatch}
                colors={colors}
                competition={competition}
                formSections={formSections}
                formData={formData}
                setFormData={setFormData}
                startRelativeTime={startRelativeTime}
                setStartRelativeTime={setStartRelativeTime}
                timeline={timeline}
                setTimeline={setTimeline}
                setAlliance={setSelectedAlliance}
                autoPath={autoPath}
                setAutoPath={setAutoPath}
                submitForm={submitForm}
                isSubmitting={isSubmitting}
            />
        </>
    );
}
