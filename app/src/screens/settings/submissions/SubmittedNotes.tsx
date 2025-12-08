import { View } from "react-native";
import { UIText } from "../../../ui/UIText";
import { useEffect, useState } from "react";
import { FormHelper } from "../../../FormHelper";
import { NotesDB, type NoteWithMatch, type OfflineNote } from "../../../database/ScoutNotes";
import { NoteList } from "../../../components/NoteList";
import { CompetitionsDB } from "../../../database/Competitions";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UIButton, UIButtonSize, UIButtonStyle } from "../../../ui/UIButton";
import type { SettingsMenuScreenProps } from "../SettingsMenu";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AsyncAlert } from "../../../lib/util/react/AsyncAlert.ts";
import { UICard } from "../../../ui/UICard.tsx";
import Toast from "react-native-toast-message";

const Tab = createMaterialTopTabNavigator<SubmittedNotesParamList>();
type SubmittedNotesParamList = {
    Sent: undefined;
    Offline: undefined;
};

export function SubmittedNotes({ route }: SettingsMenuScreenProps<"Scout/ViewNotes">) {
    const { competitionId } = route.params;

    const [onlineNotes, setOnlineNotes] = useState<NoteWithMatch[]>([]);
    const [offlineNotes, setOfflineNotes] = useState<OfflineNote[]>([]);

    async function refresh() {
        setOfflineNotes(await FormHelper.getOfflineNotes());
        setOnlineNotes(await NotesDB.getNotesForCompetition(competitionId));
    }
    useEffect(() => void refresh(), [competitionId]);

    async function publish() {
        const internetResponse = await CompetitionsDB.getCurrentCompetition()
            .then(() => true)
            .catch(() => false);
        if (!internetResponse) {
            await AsyncAlert.alert("No internet connection", "Please connect to the internet to push offline reports");
            return;
        }

        const failed = [];
        for (const note of offlineNotes) {
            try {
                await NotesDB.createOfflineNote(note);
                await FormHelper.deleteOfflineNote(note.created_at, note.team_number);
            } catch (error) {
                console.error(error);
                failed.push(note);
            }
        }

        await refresh();

        Toast.show({
            type: "success",
            text1: `Successfully uploaded ${offlineNotes.length - failed.length}/${offlineNotes.length} reports.`,
            visibilityTime: 3000,
        });
    }

    return (
        <SafeAreaProvider>
            <Tab.Navigator>
                <Tab.Screen name={"Sent"} options={{ title: "In Database" }}>
                    {() => <NoteList notes={onlineNotes} />}
                </Tab.Screen>

                <Tab.Screen name={"Offline"} options={{ title: "Offline" }}>
                    {() => (
                        <View style={{ flex: 1 }}>
                            <View style={{ padding: 16 }}>
                                {offlineNotes.length === 0 ? (
                                    <UICard>
                                        <View style={{ alignItems: "center" }}>
                                            <UIText size={20} bold>
                                                No offline notes!
                                            </UIText>
                                            <UIText size={15}>Great job keeping your data up-to-date.</UIText>
                                        </View>
                                    </UICard>
                                ) : (
                                    <UIButton
                                        style={UIButtonStyle.fill}
                                        size={UIButtonSize.xl}
                                        text={"Push offline to database"}
                                        onPress={publish}
                                    />
                                )}
                            </View>

                            {offlineNotes.length > 0 && <NoteList notes={offlineNotes} />}
                        </View>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}
