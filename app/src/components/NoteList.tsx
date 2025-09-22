import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { type NoteWithMatch, type OfflineNote } from "../database/ScoutNotes.ts";
import * as Bs from "../ui/icons";

export enum FilterType {
    // todo: allow note list to accept and display team #
    // to do this, accept param for display=['team_number', 'match_number']
    // TEAM_NUMBER,
    MATCH_NUMBER,
    TEXT,
}

export const NoteList = ({ notes, onClose }: { notes: (NoteWithMatch | OfflineNote)[]; onClose?: () => void }) => {
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
        container: {
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: colors.background,
            paddingBottom: "10%",
            paddingHorizontal: "5%",
            paddingVertical: "5%",
            height: "50%",
        },
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2%",
                }}
            >
                <TextInput
                    placeholder={"Search"}
                    placeholderTextColor={colors.text}
                    onChangeText={(text) => setSearchTerm(text)}
                    style={{
                        color: colors.text,
                        backgroundColor: colors.card,
                        paddingHorizontal: "5%",
                        paddingVertical: "2%",
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 10,
                        marginLeft: "5%",
                        marginRight: "2%",
                        flex: 1,
                    }}
                />
                <Pressable
                    onPress={() => {
                        setFilterModalVisible(true);
                    }}
                    style={{
                        padding: "2%",
                        marginRight: "2%",
                    }}
                >
                    <Bs.ArrowDownUp size="20" fill="gray" />
                </Pressable>
                {onClose && (
                    <Pressable
                        onPress={onClose}
                        style={{
                            padding: "2%",
                            marginRight: "2%",
                        }}
                    >
                        <Bs.XLg size="20" fill="gray" />
                    </Pressable>
                )}
            </View>
            {filteredNotes.length > 0 && (
                <FlatList
                    data={filteredNotes}
                    renderItem={({ item }) => (
                        <Pressable
                            style={{
                                backgroundColor: colors.card,
                                padding: "5%",
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 10,
                                margin: "5%",
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: colors.text, fontWeight: "bold" }}>
                                    Match {item.match_number} - Team {item.team_number}
                                    {item.competition_name ? ` - ${item.competition_name}` : ""}
                                    {item.scouter_name ? ` - By: ${item.scouter_name}` : ""}
                                </Text>
                            </View>
                            <Text style={{ color: colors.text }}>{item.content}</Text>
                        </Pressable>
                    )}
                />
            )}
            {filteredNotes.length === 0 && (
                <View
                    style={{
                        backgroundColor: colors.card,
                        padding: "5%",
                        borderRadius: 10,
                        margin: "5%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: colors.text }}>No notes found for this match.</Text>
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
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: "bold",
                                fontSize: 24,
                                marginBottom: "5%",
                            }}
                        >
                            Filter By
                        </Text>
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
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 18,
                                }}
                            >
                                Match/Team
                            </Text>
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
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 18,
                                }}
                            >
                                Text
                            </Text>
                        </Pressable>
                    </View>
                </Modal>
            )}
        </View>
    );
};
