import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { type NoteWithMatch, type OfflineNote } from "../database/ScoutNotes";
import * as Bs from "../ui/icons";
import { UIButton } from "../ui/UIButton";
import { UIText } from "../ui/UIText.tsx";

export enum FilterType {
    // todo: allow note list to accept and display team #
    // to do this, accept param for display=['team_number', 'match_number']
    // TEAM_NUMBER,
    MATCH_NUMBER,
    TEXT,
}

export function NoteList({ notes, onClose }: { notes: (NoteWithMatch | OfflineNote)[]; onClose?: () => void }) {
    const { colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredNotes, setFilteredNotes] = useState<(NoteWithMatch | OfflineNote)[]>(notes);
    const [filterBy, setFilterBy] = useState<FilterType>(FilterType.TEXT);
    const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredNotes(notes);
            return;
        }
        const filtered = notes.filter((note) => {
            if (filterBy === FilterType.MATCH_NUMBER) {
                return (
                    note.match_number?.toString().includes(searchTerm) ||
                    note.team_number.toString().includes(searchTerm)
                );
            }
            return note.content.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredNotes(filtered);
    }, [searchTerm]);

    const styles = StyleSheet.create({
        filterOption: {
            backgroundColor: colors.card,
            padding: "3%",
            paddingHorizontal: "5%",
            borderRadius: 10,
            margin: "1%",
            borderWidth: 2,
            borderColor: colors.border,
        },
    });

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
            >
                <TextInput
                    placeholder={"Search"}
                    placeholderTextColor={colors.text}
                    onChangeText={(text) => setSearchTerm(text)}
                    style={{
                        color: colors.text,
                        backgroundColor: colors.card,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 10,
                        flex: 1,
                    }}
                />
                <UIButton onPress={() => setFilterModalVisible(true)} icon={Bs.ArrowDownUp} />
                {onClose && <UIButton onPress={onClose} icon={Bs.XLg} />}
            </View>
            {filteredNotes.length > 0 && (
                <FlatList
                    contentContainerStyle={{
                        gap: 8,
                    }}
                    data={filteredNotes}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 10,
                                padding: 16,
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <UIText bold>Match {item.match_number}</UIText>
                                    <UIText bold>Team {item.team_number}</UIText>
                                    <UIText>{item.competition_name ? ` - ${item.competition_name}` : ""}</UIText>
                                    <UIText>{item.scouter_name ? ` - By: ${item.scouter_name}` : ""}</UIText>
                                </View>
                            </View>
                            <UIText>{item.content}</UIText>
                        </View>
                    )}
                />
            )}
            {filteredNotes.length === 0 && (
                <View
                    style={{
                        backgroundColor: colors.card,
                        padding: "5%",
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <UIText>No notes found for this match.</UIText>
                </View>
            )}
            {filterModalVisible && (
                <Modal presentationStyle={"overFullScreen"} animationType={"fade"} transparent={true}>
                    <View
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            flex: 1,
                        }}
                        onTouchEnd={() => setFilterModalVisible(false)}
                    />
                    <View style={styles.container}>
                        <UIText size={24} bold style={{ marginBottom: "5%" }}>
                            Filter By
                        </UIText>
                        <Pressable
                            onPress={() => {
                                setFilterBy(FilterType.MATCH_NUMBER);
                                setFilterModalVisible(false);
                            }}
                            style={{
                                ...styles.filterOption,
                                borderColor: filterBy === FilterType.MATCH_NUMBER ? colors.primary : colors.background,
                            }}
                        >
                            <UIText size={18}>Match/Team</UIText>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setFilterBy(FilterType.TEXT);
                                setFilterModalVisible(false);
                            }}
                            style={{
                                ...styles.filterOption,
                                borderColor: filterBy === FilterType.TEXT ? colors.primary : colors.background,
                            }}
                        >
                            <UIText size={18}>Text</UIText>
                        </Pressable>
                    </View>
                </Modal>
            )}
        </View>
    );
}
