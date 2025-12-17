import { FlatList, TextInput, View } from "react-native";
import { useState } from "react";
import { type NoteWithMatch, type OfflineNote } from "../database/ScoutNotes";
import { UIText } from "../ui/UIText.tsx";
import { useTheme } from "../lib/contexts/ThemeContext.ts";

export interface NoteListProps {
    notes: (NoteWithMatch | OfflineNote)[];
}
export function NoteList({ notes }: NoteListProps) {
    "use memo";

    const { colors } = useTheme();

    const [searchTerm, setSearchTerm] = useState("");
    const filteredNotes =
        searchTerm === ""
            ? notes
            : notes.filter(
                  (note) =>
                      note.match_number?.toString().includes(searchTerm) ||
                      note.team_number.toString().includes(searchTerm) ||
                      note.content.toLowerCase().includes(searchTerm.toLowerCase())
              );

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                placeholder={"Search"}
                placeholderTextColor={colors.fg.level(1).hex}
                onChangeText={(text) => setSearchTerm(text)}
                style={{
                    borderWidth: 1,
                    borderColor: colors.border.hex,
                    borderRadius: 10,
                    padding: 8,
                    margin: 16,
                    marginBottom: 8,
                    color: colors.fg.hex,
                }}
            />

            <FlatList
                data={filteredNotes}
                contentInsetAdjustmentBehavior={"automatic"}
                contentContainerStyle={{ padding: 16, paddingTop: 8 }}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: colors.bg1.hex,
                            borderWidth: 1,
                            borderColor: colors.border.hex,
                            borderRadius: 10,
                            padding: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                justifyContent: "space-between",
                                marginBottom: 4,
                            }}
                        >
                            <UIText bold>
                                Team {item.team_number} in Match {item.match_number}
                                {"competition_name" in item ? ` of ${item.competition_name}` : ""}
                            </UIText>
                            <UIText>{"scouter_name" in item ? `${item.scouter_name}` : ""}</UIText>
                        </View>

                        <UIText>{item.content}</UIText>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View
                        style={{
                            backgroundColor: colors.bg1.hex,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: colors.border.hex,
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                    >
                        <UIText>No notes found for this match.</UIText>
                    </View>
                )}
            />
        </View>
    );
}
