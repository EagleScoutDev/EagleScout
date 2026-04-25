import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { NoteList } from "@/components/NoteList";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export function SubmittedNotes({ route }: SettingsTabScreenProps<"Scout/ViewNotes">) {
    const { competitionId } = route.params;

    const { data: onlineNotes = [] } = useQuery(queries.notes.forSelf({ competitionId }));

    return (
        <SafeAreaProvider>
            <NoteList notes={onlineNotes} />
        </SafeAreaProvider>
    );
}
