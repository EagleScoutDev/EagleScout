import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    UIManager,
    View,
} from "react-native";
import DraggableFlatList, {
    type RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { TeamAddingModal } from "./TeamAddingModal";
import { TagsModal } from "./TagsModal";
import { TagColorChangeModal } from "./TagColorChangeModal";
import { DoNotPickModal } from "./DoNotPickModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Haptics from "expo-haptics";
import { type Picklist, type PicklistTeam, type Tag } from "@/lib/db/models/Picklist";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "../index";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { Color } from "@/ui/lib/color";
import { UITextInput } from "@/ui/components/UITextInput";
import { useRootNavigation } from "@/navigation/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { picklistMutations } from "@/lib/mutations/picklists";
import { tagMutations } from "@/lib/mutations/tags";
import type { TBATeam } from "@/lib/db/tba";

export interface PicklistCreatorParams {
    picklistId: number;
    currentCompID: number;
}
export interface PicklistCreatorProps extends DataTabScreenProps<"Picklists/Create"> {}
export function PicklistCreator({ route, navigation }: PicklistCreatorProps) {
    const { colors } = useTheme();
    const rootNavigation = useRootNavigation();

    const [name, setName] = useState<string | undefined>(undefined);

    const [teamNumberToNameMap, setTeamNumberToNameMap] = useState<Map<number, string>>(new Map());

    const [draggingActive, setDraggingActive] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
    const [createTagModal, setCreateTagModal] = useState(false);
    const [showDNPModal, setShowDNPModal] = useState(false);

    const [teamsList, setTeamsList] = useState<PicklistTeam[]>([]);

    const { picklistId, currentCompID } = route.params;

    const [presetPicklist, setPresetPicklist] = useState<Picklist>();

    const [removedTeams, setRemovedTeams] = useState<PicklistTeam[]>([]);

    const [selectedTeam, setSelectedTeam] = useState<PicklistTeam | null>(null);

    const [uniqueTags, setUniqueTags] = useState<Set<number>>(new Set());
    const [filteredTags, setFilteredTags] = useState<Set<number>>(new Set());
    const [tagColorChangeModalVisible, setTagColorChangeModalVisible] = useState(false);
    const [selectedTagForColorChange, setSelectedTagForColorChange] = useState<Tag | undefined>(
        undefined,
    );

    const { data: currentCompetition } = useQuery(queries.competitions.current);

    const { data: tbaKey } = useQuery({
        ...queries.competitions.tbaKey({ id: currentCompetition?.id ?? -1 }),
        enabled: !!currentCompetition?.id && currentCompetition.id !== -1,
    });

    const { data: tbaSimpleTeams = [] } = useQuery({
        ...queries.tbaTeams.forCompetition({ tbaKey: tbaKey ?? "" }),
        enabled: !!tbaKey && tbaKey !== "",
    });

    const { data: allTags = [] } = useQuery({
        ...queries.tags.forPicklist({ picklistId: picklistId }),
        enabled: picklistId !== -1,
    });

    const { data: picklistData } = useQuery({
        ...queries.picklists.forId({ picklistId: picklistId }),
        enabled: picklistId !== -1,
    });

    const { data: creatorProfile } = useQuery({
        ...queries.profiles.forId({ id: presetPicklist?.createdBy ?? "" }),
        enabled: !!presetPicklist?.createdBy,
    });

    const updatePicklistMut = useMutation(picklistMutations.update);
    const createPicklistMut = useMutation(picklistMutations.create);
    const deleteTagMut = useMutation(tagMutations.delete);

    useEffect(() => {
        if (picklistData) {
            setPresetPicklist(picklistData);
            setName(picklistData.name);
            setTeamsList(picklistData.teams);

            let temp = new Set<number>();
            picklistData.teams.forEach((t) => {
                t.tags.forEach((tag) => {
                    temp.add(tag);
                });
            });
            setUniqueTags(temp);
        }
    }, [picklistData]);

    useEffect(() => {
        initializeNumberToNameMap(tbaSimpleTeams);
    }, [tbaSimpleTeams]);

    useEffect(() => {
        if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const setSelectedTeamWithAnimation = (team: PicklistTeam | null) => {
        if (team) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setSelectedTeam(team);
    };

    const initializeNumberToNameMap = (teams: TBATeam[]) => {
        let tempMap = new Map();

        for (let i = 0; i < teams.length; i++) {
            tempMap.set(teams[i].team_number, teams[i].nickname);
        }

        setTeamNumberToNameMap(tempMap);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        gap: 10,
                    }}
                >
                    {presetPicklist && syncing && (
                        <ActivityIndicator size="small" color={colors.primary.hex} />
                    )}
                    {!presetPicklist && (
                        <Pressable onPress={() => prepareUpload()}>
                            <Bs.CloudArrowUp size="32" fill="gray" />
                        </Pressable>
                    )}
                    <Pressable onPress={() => setDraggingActive((prev) => !prev)}>
                        <Bs.PencilSquare
                            size="24"
                            fill={draggingActive ? colors.primary.hex : "dimgray"}
                        />
                    </Pressable>
                </View>
            ),
        })
    }, [draggingActive, syncing, presetPicklist]);

    useEffect(() => {
        if (presetPicklist) {
            savePicklistToDB();
        }
    }, [teamsList]);

    const savePicklistToDB = async () => {
        setSyncing(true);
        if (presetPicklist) {
            try {
                await updatePicklistMut.mutateAsync({ id: picklistId, teams: teamsList });
                setSyncing(false);
            } catch (error) {
                setSyncing(false);
            }
        } else {
            try {
                await createPicklistMut.mutateAsync({
                    name: name ?? "Picklist",
                    teams: teamsList,
                    competitionId: currentCompID,
                });
                setSyncing(false);
            } catch (error) {
                setSyncing(false);
            }
        }
    };

    const prepareUpload = () => {
        if (teamsList === presetPicklist?.teams) {
            Alert.alert("No Changes", "You have not made any changes to this picklist.", [
                {
                    text: "OK",
                    style: "cancel",
                },
            ]);
            return;
        }

        if (teamsList.length === 0) {
            Alert.alert("Error: Empty Picklist", "You have not added any teams to this picklist.", [
                {
                    text: "OK",
                    style: "cancel",
                },
            ]);
            return;
        }

        const additionalMessage = presetPicklist
            ? ' This will overwrite the picklist "' +
              presetPicklist.name +
              '" by ' +
              (creatorProfile?.name || "Unknown") +
              "."
            : "";
        Alert.alert(
            "Upload Picklist",
            "Are you sure you want to upload this picklist?" + additionalMessage,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Upload",
                    onPress: () => {
                        savePicklistToDB();
                        navigation.navigate("Picklists");
                    },
                },
            ],
        );
    };

    const addTeam = (team: number) => {
        let newTeam: PicklistTeam = {
            dnp: false,
            tags: [],
            teamNumber: team,
            notes: "",
        };
        setTeamsList((prevTeams) => [...prevTeams, newTeam]);
    };

    const removeTeam = (team: number) => {
        setTeamsList((prevTeams) => prevTeams.filter((t) => t.teamNumber !== team));
    };

    const addOrRemoveTeam = (team: TBATeam) => {
        if (teamsList.some((t) => t.teamNumber === team.team_number)) {
            removeTeam(team.team_number);
        } else {
            addTeam(team.team_number);
        }
    };

    const addOrRemoveTeamLiveMode = (team: PicklistTeam) => {
        if (removedTeams.includes(team)) {
            setRemovedTeams((prev) => prev.filter((t) => t !== team));
        } else {
            setRemovedTeams((prev) => [...prev, team]);
        }
    };

    const addTag = (team: PicklistTeam, tag: number) => {
        let newTeams = teamsList.map((t) => {
            if (t === team && !t.tags.includes(tag)) {
                return { ...t, tags: [...t.tags, tag] };
            }
            return t;
        });
        setTeamsList(newTeams);

        let newTags = new Set(uniqueTags);
        newTags.add(tag);
        setUniqueTags(newTags);
    };

    const removeTag = (team: PicklistTeam, tag: number) => {
        let newTeams = teamsList.map((t) => {
            if (t === team) {
                return { ...t, tags: t.tags.filter((a) => a !== tag) };
            }
            return t;
        });
        setTeamsList(newTeams);

        fillUniqueTags(newTeams);
    };

    const fillUniqueTags = (currentTeams: PicklistTeam[]) => {
        let temp = new Set<number>();
        currentTeams.forEach((t) => {
            t.tags.forEach((tag) => {
                temp.add(tag);
            });
        });
        setUniqueTags(temp);
    };

    const handleDeleteTag = async (tag: number) => {
        let newTeams = teamsList.map((t) => ({
            ...t,
            tags: t.tags.filter((a) => a !== tag),
        }));
        setTeamsList(newTeams);
        fillUniqueTags(newTeams);

        try {
            await deleteTagMut.mutateAsync(tag);
        } catch (error) {
            console.error(error);
        }
    };

    const getTagFromTagId = (tagId: number) => {
        return (allTags as Tag[]).find(
            (tag) => Number.parseInt(tag.id?.toString() ?? "", 10) === tagId,
        );
    };

    const addToDNP = (team: PicklistTeam) => {
        let newTeams = teamsList.map((t) => {
            if (t.teamNumber === team.teamNumber) {
                return { ...t, dnp: !t.dnp };
            }
            return t;
        });
        setTeamsList(newTeams);
    };

    const styles = StyleSheet.create({
        name_input: {
            fontSize: 30,
            fontFamily: "monospace",
            fontWeight: name ? "normal" : "200",
        },
        container: {
            color: colors.fg.hex,
            padding: "5%",
            flex: 1,
        },
        team_item_in_list: {
            padding: "2%",
            flexDirection: "column",
            alignItems: "center",
        },
        team_item_in_list_selected: {
            padding: "2%",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: colors.bg1.hex,
            borderColor: colors.border.hex,
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 8,
        },
        team_item_in_list_not_selected: {
            padding: "2%",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0.4,
        },
        team_number_displayed: {
            flex: 1,
            color: colors.fg.hex,
            fontSize: 18,
            marginLeft: "5%",
        },
        modal_activation_button_container: {
            width: "16%",
            height: 30,
            backgroundColor: colors.bg1.hex,
            borderRadius: 10,
            padding: "2%",
            margin: "2%",
            marginHorizontal: "2%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
        },
    });

    const renderItemDraggable = ({ item, drag, isActive }: RenderItemParams<PicklistTeam>) => {
        return (
            <ScaleDecorator>
                <Pressable
                    style={{
                        ...styles.team_item_in_list,
                        backgroundColor: isActive ? colors.bg1.hex : colors.bg0.hex,
                    }}
                    onPressIn={drag}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <BouncyCheckbox isChecked={false} disabled fillColor={colors.primary.hex} />
                        <UIText placeholder>{teamsList.indexOf(item) + 1}</UIText>
                        <UIText size={18} style={{ flex: 1, marginLeft: "5%" }}>
                            {item.teamNumber}
                            {teamNumberToNameMap.size === 0 ? "" : " "}
                            {teamNumberToNameMap.get(item.teamNumber)}
                        </UIText>
                        <View
                            style={{
                                justifyContent: "flex-end",
                                flexDirection: "row",
                            }}
                        >
                            {item.tags.length > 0 &&
                                item.tags.map((tag) => {
                                    return (
                                        <View
                                            key={tag}
                                            style={{
                                                borderRadius: 10,
                                                backgroundColor: getTagFromTagId(tag)?.color,
                                                width: 14,
                                                height: 14,
                                                margin: "2%",
                                                opacity: removedTeams.includes(item) ? 0.4 : 1,
                                            }}
                                        />
                                    );
                                })}
                        </View>
                    </View>
                </Pressable>
            </ScaleDecorator>
        );
    };

    return (
        <Pressable style={styles.container} onPress={() => setSelectedTeamWithAnimation(null)}>
            {presetPicklist ? (
                <View>
                    <UIText style={styles.name_input}>{presetPicklist.name}</UIText>
                    <UIText placeholder>By {creatorProfile?.name || "Unknown"}</UIText>
                </View>
            ) : (
                <TextInput
                    style={styles.name_input}
                    multiline={true}
                    onPressIn={() => setName("")}
                    onChangeText={(text) => {
                        setName(text);
                    }}
                    value={name}
                    defaultValue={"Enter Name"}
                />
            )}
            <View style={{ flexDirection: "row" }}>
                <Pressable
                    onPress={() => setTeamAddingModalVisible(true)}
                    style={styles.modal_activation_button_container}
                >
                    <Bs.OneTwoThree size="16" fill="currentColor" />
                    <Bs.PlusLg size="16" fill="currentColor" />
                </Pressable>

                <Pressable
                    onPress={() => {
                        setCreateTagModal(true);
                        setSelectedTeamWithAnimation(null);
                    }}
                    style={styles.modal_activation_button_container}
                >
                    <Bs.TagFill size="16" fill="currentColor" />
                    <Bs.PlusLg size="16" fill="currentColor" />
                </Pressable>
                <Pressable
                    onPress={() => {
                        setShowDNPModal(true);
                    }}
                    style={styles.modal_activation_button_container}
                >
                    <Bs.ExclamationTriangle
                        size="16"
                        fill={teamsList.some((a) => a.dnp) ? "red" : "gray"}
                    />
                </Pressable>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {[...uniqueTags].map((tag) => {
                    const tagObj = getTagFromTagId(tag);
                    return (
                        <Pressable
                            key={tag}
                            onLongPress={() => {
                                setTagColorChangeModalVisible(true);
                                setSelectedTagForColorChange(tagObj);
                            }}
                            onPress={() => {
                                if (filteredTags.has(tag)) {
                                    let newTags = new Set(filteredTags);
                                    newTags.delete(tag);
                                    setFilteredTags(newTags);
                                } else {
                                    let newTags = new Set(filteredTags);
                                    newTags.add(tag);
                                    setFilteredTags(newTags);
                                }
                            }}
                            style={{
                                backgroundColor: filteredTags.has(tag)
                                    ? tagObj?.color
                                    : colors.bg1.hex,
                                paddingHorizontal: "4%",
                                paddingVertical: "2%",
                                margin: 4,
                                borderRadius: 20,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                borderWidth: 2,
                                borderColor: tagObj?.color,
                            }}
                        >
                            <UIText
                                style={{
                                    color: filteredTags.has(tag)
                                        ? Color.parse(tagObj?.color ?? "").fg.hex
                                        : colors.fg.hex,
                                    fontWeight: filteredTags.has(tag) ? "bold" : "normal",
                                }}
                            >
                                {tagObj?.name ?? "Unknown"}
                            </UIText>
                        </Pressable>
                    );
                })}
            </View>
            <TagsModal
                visible={createTagModal}
                setVisible={setCreateTagModal}
                picklistId={picklistId}
                selectedTeam={selectedTeam}
                addTag={addTag}
                removeTag={removeTag}
                issueDeleteCommand={handleDeleteTag}
            />
            <TagColorChangeModal
                visible={tagColorChangeModalVisible}
                setVisible={setTagColorChangeModalVisible}
                tag={selectedTagForColorChange}
            />
            {teamsList.length === 0 && (
                <Pressable onPress={() => setTeamAddingModalVisible(true)}>
                    <UIText
                        style={{
                            color: colors.primary.hex,
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginVertical: "50%",
                        }}
                    >
                        Add teams to the picklist
                    </UIText>
                </Pressable>
            )}
            <TeamAddingModal
                visible={teamAddingModalVisible}
                setVisible={setTeamAddingModalVisible}
                teamsList={teamsList}
                teamsAtCompetition={tbaSimpleTeams}
                addOrRemoveTeam={addOrRemoveTeam}
            />
            <DoNotPickModal
                visible={showDNPModal}
                setVisible={setShowDNPModal}
                teams={teamsList}
                teamsAtCompetition={tbaSimpleTeams}
                numbersToNames={teamNumberToNameMap}
                addToDNP={addToDNP}
            />
            {draggingActive ? (
                <DraggableFlatList
                    data={teamsList}
                    onDragEnd={({ data }) => setTeamsList(data)}
                    keyExtractor={(item) => String(item.teamNumber)}
                    renderItem={renderItemDraggable}
                />
            ) : (
                <FlatList
                    data={teamsList.filter(
                        (t) =>
                            filteredTags.size === 0 ||
                            filteredTags.size ===
                                t.tags.filter((tag) => filteredTags.has(tag)).length,
                    )}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                style={
                                    selectedTeam === null
                                        ? styles.team_item_in_list
                                        : item === selectedTeam
                                          ? styles.team_item_in_list_selected
                                          : styles.team_item_in_list_not_selected
                                }
                                onPress={() => {
                                    if (selectedTeam === null) {
                                        setSelectedTeamWithAnimation(item);
                                    } else if (selectedTeam !== item) {
                                        setSelectedTeamWithAnimation(null);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "column",
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        <BouncyCheckbox
                                            isChecked={removedTeams.includes(item)}
                                            disabled={
                                                item !== selectedTeam && selectedTeam !== null
                                            }
                                            fillColor={colors.primary.hex}
                                            onPress={() => {
                                                addOrRemoveTeamLiveMode(item);
                                                Haptics.notificationAsync(
                                                    Haptics.NotificationFeedbackType.Success,
                                                );
                                            }}
                                        />
                                        <UIText placeholder>{teamsList.indexOf(item) + 1}</UIText>
                                        <UIText
                                            style={
                                                removedTeams.includes(item)
                                                    ? {
                                                          ...styles.team_number_displayed,
                                                          color: colors.fg.hex,
                                                          opacity: 0.5,
                                                          textDecorationLine: "line-through",
                                                          textDecorationStyle: "solid",
                                                      }
                                                    : item.dnp
                                                      ? {
                                                            ...styles.team_number_displayed,
                                                            color: colors.danger.hex,
                                                        }
                                                      : styles.team_number_displayed
                                            }
                                        >
                                            {item.teamNumber}
                                            {teamNumberToNameMap.size === 0 ? "" : " - "}
                                            {teamNumberToNameMap.get(item.teamNumber)}
                                        </UIText>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "flex-end",
                                                flexDirection: "row",
                                            }}
                                        >
                                            {item.tags.length > 0 &&
                                                item.tags.map((tag) => {
                                                    return (
                                                        <View
                                                            key={tag}
                                                            style={{
                                                                borderRadius: 10,
                                                                backgroundColor:
                                                                    getTagFromTagId(tag)?.color,
                                                                width: 14,
                                                                height: 14,
                                                                margin: "2%",
                                                                opacity: removedTeams.includes(item)
                                                                    ? 0.4
                                                                    : 1,
                                                            }}
                                                        />
                                                    );
                                                })}
                                        </View>
                                    </View>
                                    {selectedTeam === item && (
                                        <UITextInput
                                            placeholder={"Notes"}
                                            onChangeText={(text) => {
                                                let newTeams = teamsList.map((t) => {
                                                    if (t === item) {
                                                        return { ...t, notes: text };
                                                    }
                                                    return t;
                                                });
                                                setTeamsList(newTeams);
                                            }}
                                            defaultValue={item.notes}
                                            multiline
                                            style={{
                                                padding: "2%",
                                                marginTop: "2%",
                                            }}
                                        />
                                    )}
                                </View>
                                {selectedTeam === item && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignSelf: "flex-end",
                                            paddingVertical: "2%",
                                        }}
                                    >
                                        <Pressable
                                            style={{ paddingHorizontal: "4%", flex: 0 }}
                                            onPress={() => {
                                                setCreateTagModal(true);
                                            }}
                                        >
                                            <Bs.TagFill size="24" fill="gray" />
                                        </Pressable>
                                        <Pressable
                                            style={{ paddingHorizontal: "4%", flex: 0 }}
                                            onPress={() => addToDNP(item)}
                                        >
                                            <Bs.ExclamationTriangle
                                                size="24"
                                                fill={item.dnp ? "red" : "gray"}
                                            />
                                        </Pressable>
                                        <Pressable
                                            style={{ paddingHorizontal: "4%", flex: 0 }}
                                            onPress={() => {
                                                rootNavigation.push("TeamSummary", {
                                                    teamId: item.teamNumber,
                                                    competitionId: currentCompID,
                                                });
                                            }}
                                        >
                                            <Bs.InfoCircle size="24" fill="gray" />
                                        </Pressable>
                                        <Pressable
                                            style={{ paddingHorizontal: "4%", flex: 0 }}
                                            onPress={() => {
                                                Alert.alert(
                                                    "Remove Team",
                                                    "Are you sure you want to remove this team from the picklist?",
                                                    [
                                                        {
                                                            text: "Cancel",
                                                            style: "cancel",
                                                        },
                                                        {
                                                            text: "Remove",
                                                            onPress: () => {
                                                                removeTeam(item.teamNumber);
                                                                setSelectedTeamWithAnimation(null);
                                                            },
                                                        },
                                                    ],
                                                );
                                            }}
                                        >
                                            <Bs.Trash size="24" fill="red" />
                                        </Pressable>
                                    </View>
                                )}
                            </Pressable>
                        );
                    }}
                    keyExtractor={(item) => String(item.teamNumber)}
                />
            )}
        </Pressable>
    );
}
