import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    TextInput,
    View,
} from "react-native";
import { useState } from "react";
import ColorPicker, { HueSlider } from "reanimated-color-picker";
import type { PicklistTeam, Tag } from "@/lib/db/models/Picklist";
import type { Setter } from "@/lib/util/react/types";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { tagMutations } from "@/lib/mutations/tags";

export interface TagsModalProps {
    visible: boolean;
    setVisible: Setter<boolean>;
    picklistId: number;
    selectedTeam: PicklistTeam | null;
    addTag: (team: PicklistTeam, tag_id: number) => void;
    removeTag: (team: PicklistTeam, tag_id: number) => void;
    issueDeleteCommand: (tag_id: number) => void;
}
export function TagsModal({
    visible,
    setVisible,
    picklistId,
    selectedTeam,
    addTag,
    removeTag,
    issueDeleteCommand,
}: TagsModalProps) {
    const { colors } = useTheme();
    const queryClient = useQueryClient();

    const { data: listOfTags = [] } = useQuery(
        queries.tags.forPicklist({ picklistId: picklistId }),
    );

    const [newTagName, setNewTagName] = useState("");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [deletionActive, setDeletionActive] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const updateTagColor = useMutation(tagMutations.updateColor);
    const createTag = useMutation(tagMutations.create);

    const onSelectColor = async ({ hex }: { hex: string }) => {
        console.log("Selected color: ", hex);
        try {
            await updateTagColor.mutateAsync({ tagId: Number(selectedTag!.id!), color: hex });
            setSelectedTag(null);
        } catch (error) {
            console.error(error);
        }
    };

    const attemptDeleteTag = (tag: Tag) => {
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
                            issueDeleteCommand(tag.id);
                            setVisible(false);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const onTagPress = (item: Tag) => {
        if (selectedTeam === null) {
            return;
        }
        console.log("tag id: ", item.id);
        // print type of tag id
        console.log("tag id type: ", typeof item.id);
        if (selectedTags.includes(item.id, 10)) {
            setSelectedTags(selectedTags.filter((tag_id) => tag_id !== item.id));
            removeTag(selectedTeam!, item.id);
        } else {
            setSelectedTags([...selectedTags, item.id]);
            addTag(selectedTeam!, item.id);
        }
    };

    if (selectedTeam !== null && visible) {
        if (JSON.stringify(selectedTags) !== JSON.stringify(selectedTeam.tags ?? [])) {
            setSelectedTags(selectedTeam.tags ?? []);
        }
    }

    return (
        <Modal
            onRequestClose={() => setVisible(false)}
            transparent={true}
            animationType={"fade"}
            visible={visible}
        >
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
                        backgroundColor: colors.bg1.hex,
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
                        <UIText size={20} bold style={{ flex: 1 }}>
                            {selectedTeam !== null
                                ? "Tags for Team " + selectedTeam.teamNumber
                                : "Tags"}
                        </UIText>
                        {selectedTeam === null && (
                            <Pressable
                                onPress={() => setDeletionActive((prev) => !prev)}
                                style={{ flex: 0.2 }}
                            >
                                <UIText
                                    style={{
                                        color: deletionActive ? colors.primary.hex : colors.fg.hex,
                                    }}
                                >
                                    Edit
                                </UIText>
                            </Pressable>
                        )}
                        <Pressable onPress={() => setVisible(false)}>
                            <UIText>Close</UIText>
                        </Pressable>
                    </View>
                    {listOfTags.length > 0 && (
                        <FlatList
                            style={{ flex: 1 }}
                            data={listOfTags}
                            scrollEnabled={true}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    {selectedTeam !== null && (
                                        <View style={{ flex: 0.1 }}>
                                            {selectedTags.includes(item.id) && (
                                                <Bs.CheckLg size="16" fill="currentColor" />
                                            )}
                                        </View>
                                    )}
                                    <Pressable
                                        onPress={() => onTagPress(item)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: colors.bg0.hex,
                                            padding: "5%",
                                            margin: "2%",
                                            borderRadius: 10,
                                            flexDirection: "column",
                                            justifyContent: "space-between",

                                            borderWidth: 1,
                                            borderColor:
                                                selectedTeam !== null
                                                    ? selectedTags.includes(item.id)
                                                        ? colors.primary.hex
                                                        : colors.border.hex
                                                    : colors.border.hex,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <UIText style={{ flex: 1 }}>{item.name}</UIText>
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
                                                        borderColor: colors.border.hex,
                                                        borderRadius: 100,
                                                        width: 20,
                                                        height: 20,
                                                        marginHorizontal: 10,
                                                    }}
                                                />
                                            )}
                                            {deletionActive && (
                                                <Pressable onPress={() => attemptDeleteTag(item)}>
                                                    <UIText color={colors.danger}>Delete</UIText>
                                                </Pressable>
                                            )}
                                        </View>
                                        {selectedTag?.id === item.id && (
                                            <ColorPicker
                                                value={
                                                    item.color === "" || !item.color
                                                        ? "#FF0000"
                                                        : item.color
                                                }
                                                onComplete={onSelectColor}
                                                style={{
                                                    marginHorizontal: "4%",
                                                    paddingVertical: "4%",
                                                }}
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
                            borderTopColor: colors.border.hex,
                            paddingTop: "5%",
                        }}
                    >
                        <TextInput
                            style={{
                                color: colors.fg.hex,
                                backgroundColor: colors.bg0.hex,
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
                            onPress={async () => {
                                try {
                                    await createTag.mutateAsync({
                                        picklistId: picklistId,
                                        name: newTagName,
                                    });
                                    setNewTagName("");
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                            style={{
                                backgroundColor: newTagName === "" ? "gray" : colors.primary.hex,
                                padding: "5%",
                                borderRadius: 10,
                                marginTop: "5%",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <UIText
                                bold
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                Create Tag
                            </UIText>
                        </Pressable>
                    </View>
                    {/*)}*/}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
