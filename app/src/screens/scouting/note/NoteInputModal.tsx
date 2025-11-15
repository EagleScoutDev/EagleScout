import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { KeyboardAvoidingView, Modal, SafeAreaView, TextInput, View } from "react-native";
import { SegmentedTeamSelector } from "./SegmentedTeamSelector";
import { NoteFAB } from "./NoteFAB";
import { useHeaderHeight } from "@react-navigation/elements";

export interface NoteInputModalProps {
    onSubmit: () => void;
    isLoading: boolean;
    selectedAlliance: "red" | "blue";
    noteContents: Record<string, string>;
    setNoteContents: (contents: { [key: string]: string }) => void;
}
export function NoteInputModal({
    onSubmit,
    isLoading,
    selectedAlliance,
    noteContents,
    setNoteContents,
}: NoteInputModalProps) {
    const height = useHeaderHeight();
    const [localContent, setLocalContent] = useState<string>("");
    const [currentTeam, setCurrentTeam] = useState<number>(Number(Object.keys(noteContents)[0]) || 0);
    const { colors } = useTheme();
    return (
        <Modal
            visible={true}
            animationType={"slide"}
            presentationStyle={"overFullScreen"}
            style={{
                flex: 1,
                height: "100%",
            }}
        >
            <SafeAreaView style={{ flex: 1, height: "100%", backgroundColor: colors.card }}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        height: "100%",
                    }}
                    keyboardVerticalOffset={height}
                    behavior={"padding"}
                >
                    <SegmentedTeamSelector
                        color={selectedAlliance}
                        teams={Object.keys(noteContents).map((key) => parseInt(key))}
                        selectedTeam={currentTeam}
                        setSelectedTeam={(team: number) => {
                            setCurrentTeam(team);
                            setLocalContent(noteContents[team]);
                        }}
                        completed={Object.keys(noteContents).map((key) => noteContents[parseInt(key)].length > 0)}
                    />
                    <View
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                padding: "5%",
                                zIndex: 1,
                            }}
                        >
                            <TextInput
                                multiline={true}
                                style={{ flex: 1, color: colors.text, fontSize: 20 }}
                                onChangeText={(text) => {
                                    setLocalContent(text);
                                    setNoteContents({
                                        ...noteContents,
                                        [currentTeam]: text,
                                    });
                                }}
                                value={localContent}
                                placeholder={"Start writing..."}
                                placeholderTextColor={"grey"}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-end",
                        }}
                    >
                        <NoteFAB
                            onSubmitPress={onSubmit}
                            isLoading={isLoading}
                            contentPresent={Object.keys(noteContents).some(
                                (key) => noteContents[parseInt(key)].length > 0
                            )}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
