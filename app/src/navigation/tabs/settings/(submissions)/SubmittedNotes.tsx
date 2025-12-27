import { View } from "react-native";
import { useEffect, useState } from "react";
import { NotesDB, type NoteWithMatch, type OfflineNote } from "@/lib/database/ScoutNotes";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Toast from "react-native-toast-message";
import { FormHelper } from "@/lib/FormHelper";
import { AsyncAlert } from "@/lib/util/react/AsyncAlert";
import { NoteList } from "@/components/NoteList";
import { UICard } from "@/ui/components/UICard";
import { UIText } from "@/ui/components/UIText";
import { UIButton, UIButtonSize, UIButtonStyle } from "@/ui/components/UIButton";

const Tab = createMaterialTopTabNavigator<SubmittedNotesParamList>();
type SubmittedNotesParamList = {
    Sent: undefined;
    Offline: undefined;
};

export function SubmittedNotes({ route }: SettingsTabScreenProps<"Scout/ViewNotes">) {
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
