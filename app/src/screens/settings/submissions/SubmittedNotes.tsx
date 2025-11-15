import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { UISegmentedControl } from "../../../ui/input/pickers/UISegmentedControl";
import { FormHelper } from "../../../FormHelper";
import { NotesDB, type NoteWithMatch, type OfflineNote } from "../../../database/ScoutNotes";
import { NoteList } from "../../../components/NoteList";
import { CompetitionsDB } from "../../../database/Competitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import { Color } from "../../../lib/color";

export function SubmittedNotes() {
    const { colors } = useTheme();

    const [onlineNotes, setOnlineNotes] = useState<NoteWithMatch[]>([]);
    const [offlineNotes, setOfflineNotes] = useState<OfflineNote[]>([]);
    const [selectedTheme, setSelectedTheme] = useState("Offline");
    const [loading, setLoading] = useState(false);

    async function fetchOfflineNotes() {
        const allOffline: OfflineNote[] = await FormHelper.getOfflineNotes();
        setOfflineNotes(allOffline);
    }

    async function fetchOnlineNotes() {
        const reports = await NotesDB.getNotesForSelf();
        setOnlineNotes(reports);
    }

    function fetchAllNotes() {
        setLoading(true);
        return Promise.all([fetchOfflineNotes(), fetchOfflineNotes()]).then(() => setLoading(false));
    }

    useEffect(() => void fetchAllNotes(), []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
                    <View style={{ marginBottom: 16 }}>
                        <UISegmentedControl
                            selected={selectedTheme}
                            options={[{ title: "Offline" }, { title: "In Database" }]}
                            onPress={(option) => {
                                switch (option) {
                                    case "Offline":
                                        setSelectedTheme("Offline");
                                        setLoading(true);
                                        fetchOfflineNotes().then(() => setLoading(false));
                                        break;
                                    case "In Database":
                                        setSelectedTheme("In Database");
                                        setLoading(true);
                                        fetchOnlineNotes().then(() => setLoading(false));
                                        break;
                                }
                            }}
                        />
                    </View>

                    {loading && <ActivityIndicator animating={loading} size={"large"} />}

                    {selectedTheme === "Offline" && offlineNotes.length === 0 && (
                        <View
                            style={{
                                padding: 20,
                                borderRadius: 10,
                                alignContent: "center",
                                backgroundColor: colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    textAlign: "center",
                                    fontSize: 20,
                                    fontWeight: "bold",
                                }}
                            >
                                No offline reports!
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    textAlign: "center",
                                    fontSize: 15,
                                }}
                            >
                                Great job keeping your data up-to-date.
                            </Text>
                        </View>
                    )}

                    {selectedTheme === "Offline" && offlineNotes.length !== 0 && (
                        <>
                            <UIButton
                                color={Color.rgb(255, 0, 0)}
                                style={UIButtonStyle.fill}
                                size={UIButtonSize.xl}
                                text={"Push offline to database"}
                                onPress={async () => {
                                    const internetResponse = await CompetitionsDB.getCurrentCompetition()
                                        .then(() => true)
                                        .catch(() => false);

                                    if (!internetResponse) {
                                        Alert.alert(
                                            "No internet connection",
                                            "Please connect to the internet to push offline reports"
                                        );
                                        return;
                                    }

                                    setLoading(true);
                                    const promises = [];
                                    for (const note of offlineNotes) {
                                        promises.push(
                                            NotesDB.createOfflineNote(note)
                                                .then(() =>
                                                    FormHelper.deleteOfflineNote(note.created_at, note.team_number)
                                                )
                                                .catch((err) => {
                                                    console.log(err);
                                                    Alert.alert(
                                                        "Error",
                                                        "An error occurred while pushing offline reports"
                                                    );
                                                })
                                        );
                                    }
                                    await Promise.all(promises);
                                    await fetchOnlineNotes();
                                    await fetchOfflineNotes();
                                    setLoading(false);
                                }}
                            />
                            <NoteList notes={offlineNotes} />
                        </>
                    )}

                    {selectedTheme === "In Database" && <NoteList notes={onlineNotes} />}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
