import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import ColorPicker, { HueSlider } from "reanimated-color-picker";
import type { PicklistTeam } from "../../../../database/Picklists";
import { TagsDB, type TagStructure } from "../../../../database/Tags";
import type { Setter } from "../../../../lib/react/types";

export interface TagsModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    picklist_id: number;
    selected_team: PicklistTeam | null;
    addTag: (team: PicklistTeam, tag_id: number) => void;
    removeTag: (team: PicklistTeam, tag_id: number) => void;
    issueDeleteCommand: (tag_id: number) => void;
}
export function TagsModal({
    visible,
    setVisible,
    picklist_id,
    selected_team,
    addTag,
    removeTag,
    issueDeleteCommand,
}: TagsModalProps) {
    const { colors } = useTheme();
    const [listOfTags, setListOfTags] = useState<TagStructure[]>([]);

    const [newTagName, setNewTagName] = useState("");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [deletionActive, setDeletionActive] = useState(false);
    const [selectedTag, setSelectedTag] = useState<TagStructure | null>(null);

    const onSelectColor = ({ hex }) => {
        console.log("Selected color: ", hex);
        TagsDB.updateColorOfTag(selectedTag!.id!, hex).then(() => {
            TagsDB.getTagsForPicklist(picklist_id).then((tags) => {
                setListOfTags(tags);
            });
        });
        setSelectedTag(null);
    };

    const attemptDeleteTag = (tag: TagStructure) => {
        Alert.alert(
            `Delete "${tag.name}"?`,
            "Are you sure you want to delete this tag? This action is irreversible.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        if (tag.id !== null) {
                            issueDeleteCommand(Number.parseInt(tag.id ?? "", 10));
                            setVisible(false);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const onTagPress = (item: TagStructure) => {
        if (selected_team === null) {
            return;
        }
        console.log("tag id: ", item.id);
        // print type of tag id
        console.log("tag id type: ", typeof item.id);
        if (selectedTags.includes(Number.parseInt(item.id ?? "", 10))) {
            setSelectedTags(selectedTags.filter((tag_id) => tag_id !== Number.parseInt(item.id ?? "", 10)));
            removeTag(selected_team!, Number.parseInt(item.id ?? "", 10));
        } else {
            setSelectedTags([...selectedTags, Number.parseInt(item.id ?? "", 10)]);
            addTag(selected_team!, Number.parseInt(item.id ?? "", 10));
        }
    };

    useEffect(() => {
        console.log("picklist_id: ", picklist_id);
        if (picklist_id !== -1) {
            TagsDB.getTagsForPicklist(picklist_id).then((tags) => {
                setListOfTags(tags);
            });
        }
    }, [picklist_id, visible]);

    useEffect(() => {
        if (selected_team !== null) {
            setSelectedTags(selected_team.tags);
        }
    }, [visible]);

    return (
        <Modal onRequestClose={() => setVisible(false)} transparent={true} animationType={"fade"} visible={visible}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            >
                <View
                    style={{
                        backgroundColor: colors.card,
                        padding: "5%",
                        margin: "5%",
                        marginVertical: "30%",
                        borderRadius: 10,
                        minWidth: "90%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "5%",
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 20,
                                fontWeight: "bold",
                                flex: 1,
                            }}
                        >
                            {selected_team !== null ? "Tags for Team " + selected_team.team_number : "Tags"}
                        </Text>
                        {selected_team === null && (
                            <Pressable onPress={() => setDeletionActive((prev) => !prev)} style={{ flex: 0.2 }}>
                                <Text
                                    style={{
                                        color: deletionActive ? colors.primary : colors.text,
                                    }}
                                >
                                    Edit
                                </Text>
                            </Pressable>
                        )}
                        <Pressable onPress={() => setVisible(false)}>
                            <Text style={{ color: colors.text }}>Close</Text>
                        </Pressable>
                    </View>
                    {listOfTags.length > 0 && (
                        <FlatList
                            style={{ flex: 1 }}
                            data={listOfTags}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.id ?? ""}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    {selected_team !== null && (
                                        <View style={{ flex: 0.1 }}>
                                            {selectedTags.includes(Number.parseInt(item.id ?? "", 10)) && (
                                                <Svg
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    strokeWidth={1}
                                                    stroke="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <Path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                </Svg>
                                            )}
                                        </View>
                                    )}
                                    <Pressable
                                        onPress={() => onTagPress(item)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: colors.background,
                                            padding: "5%",
                                            margin: "2%",
                                            borderRadius: 10,
                                            flexDirection: "column",
                                            justifyContent: "space-between",

                                            borderWidth: 1,
                                            borderColor:
                                                selected_team !== null
                                                    ? selectedTags.includes(Number.parseInt(item.id ?? "", 10))
                                                        ? colors.primary
                                                        : colors.border
                                                    : colors.border,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ color: colors.text, flex: 1 }}>{item.name}</Text>
                                            {!deletionActive && (
                                                <Pressable
                                                    onPress={() => {
                                                        if (item.id === selectedTag?.id) {
                                                            setSelectedTag(null);
                                                        } else {
                                                            if (item.id !== null) {
                                                                setSelectedTag(item);
                                                            } else {
                                                                setSelectedTag(null);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: item.color,
                                                        borderWidth: 1,
                                                        borderColor: colors.border,
                                                        borderRadius: 100,
                                                        width: 20,
                                                        height: 20,
                                                        marginHorizontal: 10,
                                                    }}
                                                />
                                            )}
                                            {deletionActive && (
                                                <Pressable onPress={() => attemptDeleteTag(item)}>
                                                    <Text style={{ color: colors.notification }}>Delete</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                        {selectedTag?.id === item.id && (
                                            <ColorPicker
                                                value={item.color === "" || !item.color ? "#FF0000" : item.color}
                                                onComplete={onSelectColor}
                                                style={{ marginHorizontal: "4%", paddingVertical: "4%" }}
                                            >
                                                <HueSlider />
                                            </ColorPicker>
                                        )}
                                    </Pressable>
                                </View>
                            )}
                        />
                    )}
                    {/*{selected_team === null && (*/}
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: colors.border,
                            paddingTop: "5%",
                        }}
                    >
                        <TextInput
                            style={{
                                color: colors.text,
                                backgroundColor: colors.background,
                                padding: "5%",
                                borderRadius: 10,
                                minWidth: "100%",
                            }}
                            placeholder={"Tag Name"}
                            placeholderTextColor={"gray"}
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />
                        <Pressable
                            disabled={newTagName === ""}
                            onPress={() => {
                                TagsDB.createTag(picklist_id, newTagName).then(() => {
                                    TagsDB.getTagsForPicklist(picklist_id).then((tags) => {
                                        setListOfTags(tags);
                                        setNewTagName("");
                                    });
                                });
                            }}
                            style={{
                                backgroundColor: newTagName === "" ? "gray" : colors.primary,
                                padding: "5%",
                                borderRadius: 10,
                                marginTop: "5%",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Create Tag
                            </Text>
                        </Pressable>
                    </View>
                    {/*)}*/}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
