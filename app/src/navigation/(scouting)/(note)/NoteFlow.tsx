import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useEffect, useState } from "react";
import { NoteInputModal } from "./NoteInputModal";
import Toast from "react-native-toast-message";
import Confetti from "react-native-confetti";
import { useCurrentCompetitionMatches } from "@/lib/hooks/useCurrentCompetitionMatches";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Alliance } from "@/frc/common/common";
import { UIText } from "@/ui/components/UIText";
import { UICard } from "@/ui/components/UICard";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";
import { useMutation } from "@tanstack/react-query";
import { noteMutations } from "@/lib/mutations/notes";

export function NoteScreen() {
    const [match, setMatch] = useState<number | null>(null);
    const [matchNumberValid, setMatchNumberValid] = useState<boolean>(false);
    const safe = useSafeAreaInsets();

    const [alliances, setAlliances] = useState<{ red: number[]; blue: number[] }>({
        red: [],
        blue: [],
    });
    const [selectedAlliance, setSelectedAlliance] = useState<Alliance>(Alliance.red);

    const [noteContents, setNoteContents] = useState<Record<string, string>>({});

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confettiView, setConfettiView] = useState<any>(null);

    const { competitionId, getTeamsForMatch } = useCurrentCompetitionMatches();
    const createNote = useMutation(noteMutations.create);

    useEffect(() => {
        if (match === null) return;

        const teams = getTeamsForMatch(match);
        if (teams.length !== 6) setMatchNumberValid(false);
        else {
            setAlliances({
                red: teams.slice(0, 3),
                blue: teams.slice(3, 6),
            });
            setMatchNumberValid(true);
        }
    }, [match]);

    useEffect(() => {
        if (selectedAlliance === null) return;

        const newNoteContents = Object.fromEntries(
            alliances[selectedAlliance].map((team) => [team, ""]),
        );
        setNoteContents(newNoteContents);
    }, [alliances, selectedAlliance]);

    const startConfetti = () => {
        console.log("starting confetti");
        confettiView.startConfetti();
    };

    const submitNote = async () => {
        setIsLoading(true);
        if (competitionId === null) throw new Error("No active competition");

        const promises = [];
        for (const team of Object.keys(noteContents)) {
            if (noteContents[team] === "") {
                continue;
            }
            promises.push(
                createNote.mutateAsync({
                    content: noteContents[team],
                    teamNumber: Number(team),
                    matchNumber: Number(match),
                    competitionId,
                }),
            );
        }
        await Promise.all(promises);
        if (promises.length > 0) {
            Toast.show({
                type: "success",
                text1: "Note submitted!",
                visibilityTime: 3000,
            });
            startConfetti();
        }
        clearAllFields();
        setIsLoading(false);
        setModalVisible(false);
    };

    const clearAllFields = () => {
        setMatch(0);
        setNoteContents({});
    };

    if (competitionId === -1) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5%",
                }}
            >
                <UIText size={30} bold>
                    A competition must be running to submit notes!
                </UIText>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View
                style={{
                    zIndex: 100,
                    // allow touch through
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
                <Confetti ref={setConfettiView} timeout={10} duration={3000} />
            </View>

            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1, padding: 16 }}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        keyboardVerticalOffset={2 * safe.top}
                    >
                        <UICard title={"Information"}>
                            <UICard.NumberInput
                                label={"Match Number"}
                                placeholder="000"
                                max={999}
                                value={match}
                                onInput={setMatch}
                                error={
                                    match === null
                                        ? null
                                        : match === 0
                                          ? "Match number cannot be 0"
                                          : match > 400
                                            ? "Match number cannot be greater than 400"
                                            : null
                                }
                            />
                            <UICard.AllianceChooser
                                label={"Alliance"}
                                alliance={selectedAlliance}
                                setAlliance={setSelectedAlliance}
                            />
                        </UICard>

                        <View style={{ flex: 1 }} />

                        <UIButton
                            style={UIButtonStyle.fill}
                            size={UIButtonSize.xl}
                            text={"Next"}
                            onPress={() => {
                                if (matchNumberValid) {
                                    setModalVisible(true);
                                } else {
                                    Alert.alert(
                                        "Match number invalid",
                                        "Match number invalid. Please check if the match number you entered is correct.",
                                    );
                                }
                            }}
                            disabled={match === null || selectedAlliance === null}
                        />
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableWithoutFeedback>

            {modalVisible && (
                <NoteInputModal
                    onSubmit={submitNote}
                    isLoading={isLoading}
                    selectedAlliance={selectedAlliance!}
                    noteContents={noteContents}
                    setNoteContents={setNoteContents}
                />
            )}
        </SafeAreaProvider>
    );
}
