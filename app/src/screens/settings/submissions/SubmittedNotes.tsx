import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SegmentedOption } from "../../../ui/input/pickers/SegmentedOption";
import { StandardButton } from "../../../ui/StandardButton";
import { FormHelper } from "../../../FormHelper";
import { NotesDB, type NoteWithMatch, type OfflineNote } from "../../../database/ScoutNotes";
import { NoteList } from "../../../components/NoteList.tsx";
import { CompetitionsDB } from "../../../database/Competitions";

export const SubmittedNotes = () => {
    const [notes, setNotes] = useState<NoteWithMatch[]>([]);
    const [offlineNotes, setOfflineNotes] = useState<OfflineNote[]>([]);
    const { colors } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState("Offline");
    const [loading, setLoading] = useState(false);

    async function getOfflineNotes() {
        const allOffline: OfflineNote[] = await FormHelper.getOfflineNotes();
        setOfflineNotes(allOffline);
    }

    async function getOnlineNotes() {
        const reports = await NotesDB.getNotesForSelf();
        setNotes(reports);
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getOfflineNotes();
            await getOnlineNotes();
            setLoading(false);
        })();
    }, []);

    const styles = StyleSheet.create({
        segmented_picker_container: {
            flexDirection: "row",
            margin: 20,
            backgroundColor: colors.border,
            padding: 2,
            borderRadius: 10,
            alignContent: "center",
        },
        loading_indicator: {
            flexDirection: "row",
            margin: 20,
            alignSelf: "center",
            padding: 2,
            borderRadius: 10,
            alignContent: "center",
        },
        offline_card: {
            margin: 20,
            backgroundColor: colors.border,
            padding: 20,
            borderRadius: 10,
            alignContent: "center",
        },
        offline_text: {
            textAlign: "center",
            fontSize: 20,
            color: "green",
            fontWeight: "bold",
        },
        offline_subtext: {
            textAlign: "center",
            fontSize: 15,
            color: "gray",
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.segmented_picker_container}>
                <SegmentedOption
                    colors={colors}
                    title="Offline"
                    selected={selectedTheme}
                    onPress={() => {
                        setSelectedTheme("Offline");
                        setLoading(true);
                        getOfflineNotes().then(() => setLoading(false));
                    }}
                />
                <SegmentedOption
                    colors={colors}
                    title="In Database"
                    selected={selectedTheme}
                    onPress={() => {
                        setSelectedTheme("In Database");
                        setLoading(true);
                        getOnlineNotes().then(() => setLoading(false));
                    }}
                />
            </View>

            {loading && (
                <View style={styles.loading_indicator}>
                    <ActivityIndicator animating={loading} size="large" color={"red"} />
                </View>
            )}

            {selectedTheme === "Offline" && offlineNotes && offlineNotes.length === 0 && (
                <View style={styles.offline_card}>
                    <Text style={styles.offline_text}>No offline reports!</Text>
                    <Text style={styles.offline_subtext}>Great job keeping your data up-to-date.</Text>
                </View>
            )}

            {selectedTheme === "Offline" && offlineNotes && offlineNotes.length !== 0 && (
                <View style={{ flex: 1 }}>
                    <StandardButton
                        color={"red"}
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
                                        .then(() => FormHelper.deleteOfflineNote(note.created_at, note.team_number))
                                        .catch((err) => {
                                            console.log(err);
                                            Alert.alert("Error", "An error occurred while pushing offline reports");
                                        })
                                );
                            }
                            await Promise.all(promises);
                            await getOnlineNotes();
                            await getOfflineNotes();
                            setLoading(false);
                        }}
                    />
                    <NoteList notes={offlineNotes} />
                </View>
            )}

            {selectedTheme === "In Database" && (
                <View style={{ flex: 1 }}>
                    <NoteList notes={notes} />
                </View>
            )}
        </SafeAreaView>
    );
};
