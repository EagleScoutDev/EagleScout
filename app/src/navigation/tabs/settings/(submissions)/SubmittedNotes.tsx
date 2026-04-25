import { useEffect, useState } from "react";
import { NotesDB, type NoteWithMatch } from "@/lib/db/models/ScoutNote";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { NoteList } from "@/components/NoteList";

export function SubmittedNotes({ route }: SettingsTabScreenProps<"Scout/ViewNotes">) {
    const { competitionId } = route.params;

    const [onlineNotes, setOnlineNotes] = useState<NoteWithMatch[]>([]);

    async function refresh() {
        setOnlineNotes(await NotesDB.getNotesForSelf(competitionId));
    }
    useEffect(() => void refresh(), [competitionId]);

    return (
        <SafeAreaProvider>
            <NoteList notes={onlineNotes} />
        </SafeAreaProvider>
    );
}
