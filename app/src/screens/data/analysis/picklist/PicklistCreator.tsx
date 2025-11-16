import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    UIManager,
    View,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import DraggableFlatList, { type RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { TeamAddingModal } from "./TeamAddingModal";
import { TagsModal } from "./TagsModal";
import { TagColorChangeModal } from "./TagColorChangeModal";
import { DoNotPickModal } from "./DoNotPickModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { CompetitionsDB } from "../../../../database/Competitions";
import {
    PicklistsDB,
    type PicklistStructure,
    type PicklistTeam,
    type SimpleTeam,
} from "../../../../database/Picklists";
import { ProfilesDB } from "../../../../database/Profiles";
import { TagsDB, type TagStructure } from "../../../../database/Tags";
import { Color } from "../../../../lib/color";
import { TBA } from "../../../../lib/frc/tba";
import * as Bs from "../../../../ui/icons";
import type { Setter } from "../../../../lib/util/react/types";
import type { DataMenuScreenProps } from "../../DataMain";

export interface PicklistCreatorParams {
    picklist_id: number;
    currentCompID: number;
}
export interface PicklistCreatorProps extends DataMenuScreenProps<"Picklists/Create"> {}
export function PicklistCreator({ route, navigation }: PicklistCreatorProps) {
    const { colors } = useTheme();
    const rootNavigation = useNavigation();

    const [name, setName] = useState<string | undefined>(undefined);
    const [creatorName, setCreatorName] = useState<string>("");

    // used to display the team name next to the team number
    const [teamNumberToNameMap, setTeamNumberToNameMap] = useState<Map<number, string>>(new Map());

    // screen config
    const [dragging_active, setDraggingActive] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // modals
    const [teamAddingModalVisible, setTeamAddingModalVisible] = useState(false);
    const [createTagModal, setCreateTagModal] = useState(false);
    const [showDNPModal, setShowDNPModal] = useState(false);

    // list of teams at the current competition
    const [tbaSimpleTeams, setTBASimpleTeams] = useState<SimpleTeam[]>([]);

    // list of teams in the picklist -- this is the actual picklist
    const [teams_list, setTeamsList] = useState<PicklistTeam[]>([]);

    // id holds the id of the picklist to be edited, or -1 if a new picklist is being created
    const { picklist_id, currentCompID } = route.params;

    // used to store the picklist that is being edited, or undefined if a new picklist is being created
    const [presetPicklist, setPresetPicklist] = useState<PicklistStructure>();

    // used to track which teams have been selected already
    const [removed_teams, setRemovedTeams] = useState<PicklistTeam[]>([]);

    // currently highlighted team
    const [selectedTeam, setSelectedTeam] = useState<PicklistTeam | null>(null);

    // set of tags
    const [uniqueTags, setUniqueTags] = useState<Set<number>>(new Set());
    const [allTags, setAllTags] = useState<TagStructure[]>([]);
    const [filteredTags, setFilteredTags] = useState<Set<number>>(new Set());
    const [tagColorChangeModalVisible, setTagColorChangeModalVisible] = useState(false);
    const [selectedTagForColorChange, setSelectedTagForColorChange] = useState<TagStructure | undefined>(undefined);

    useEffect(() => {
        console.log("picklist_id: ", picklist_id);
        if (picklist_id !== -1) {
            TagsDB.getTagsForPicklist(picklist_id).then((tags) => {
                setAllTags(tags);
            });
        }
    }, [createTagModal, tagColorChangeModalVisible]);

    // fetches all teams at the current competition for use in the team adding modal, name map
    useEffect(() => {
        CompetitionsDB.getCurrentCompetition()
            .then((competition) => {
                if (!competition) {
                    console.error("No current competition found");
                    return;
                }
                CompetitionsDB.getCompetitionTBAKey(competition.id)
                    .then((tba_key) => {
                        TBA.getTeamsAtCompetition(tba_key)
                            .then((teams) => {
                                setTBASimpleTeams(teams);
                                initializeNumberToNameMap(teams);
                            })
                            .catch((error) => {
                                console.error("Error getting teams at competition:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error getting TBA key for competition:", error);
                    });
            })
            .catch((error) => {
                console.error("Error getting current competition:", error);
            });
    }, []);

    useEffect(() => {
        if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const setSelectedTeamWithAnimation = (team: Setter<PicklistTeam | null>) => {
        if (team) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setSelectedTeam(team);
    };

    // sets up the map that will be used to display team names next to team numbers
    const initializeNumberToNameMap = (teams: SimpleTeam[]) => {
        let temp_map = new Map();

        for (let i = 0; i < teams.length; i++) {
            temp_map.set(teams[i].team_number, teams[i].nickname);
        }

        setTeamNumberToNameMap(temp_map);
    };

    // if a picklist is being edited, fetches the picklist from the database
    useEffect(() => {
        if (picklist_id !== -1) {
            fetchPicklist();
        }
    }, []);

    // adds header button to fetch picklist from database
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
                    {presetPicklist && syncing && <ActivityIndicator size="small" color={colors.primary} />}
                    {presetPicklist && !syncing && (
                        <Pressable onPress={() => fetchPicklist()}>
                            <Bs.ArrowClockwise size="30" fill="gray" style={{ marginRight: "5%" }} />
                        </Pressable>
                    )}
                    {!presetPicklist && (
                        <Pressable onPress={() => prepareUpload()}>
                            <Bs.CloudArrowUp size="32" fill="gray" />
                        </Pressable>
                    )}
                    <Pressable onPress={() => setDraggingActive((prev) => !prev)}>
                        <Bs.PencilSquare size="24" fill={dragging_active ? colors.primary : "dimgray"} />
                    </Pressable>
                </View>
            ),
        });
    }, [dragging_active, syncing]);

    // when the picklist is being edited, ensures that the picklist has been uploaded before trying a save
    useEffect(() => {
        saveIfExists();
    }, [teams_list]);

    // gets latest picklist from db
    async function fetchPicklist() {
        try {
            const picklist = await PicklistsDB.getPicklist(String(picklist_id));
            setPresetPicklist(picklist);
            setName(picklist.name);
            setTeamsList(picklist.teams);
            ProfilesDB.getProfile(picklist.created_by).then((profile) => {
                setCreatorName(profile.name);
            });

            let temp = new Set<number>();
            picklist.teams.forEach((t) => {
                t.tags.forEach((tag) => {
                    temp.add(tag);
                });
            });
            setUniqueTags(temp);
        } catch (e) {
            console.log(e);
        }
    }

    const saveIfExists = () => {
        if (presetPicklist) {
            savePicklistToDB();
        }
    };

    const savePicklistToDB = () => {
        setSyncing(true);
        if (presetPicklist) {
            console.log("user has opted to update picklist");
            PicklistsDB.updatePicklist(picklist_id, teams_list).then((r) => {
                console.log("response after updating picklist: " + r);
                setSyncing(false);
            });
        } else {
            console.log("saving picklist to db");
            PicklistsDB.createPicklist(name ?? "Picklist", teams_list, currentCompID).then((r) => {
                console.log("response after submitting picklist to db: " + r);
                setSyncing(false);
            });
        }
    };

    const prepareUpload = () => {
        if (teams_list === presetPicklist?.teams) {
            Alert.alert("No Changes", "You have not made any changes to this picklist.", [
                {
                    label: "OK",
                    style: "cancel",
                },
            ]);
            return;
        }

        if (teams_list.length === 0) {
            Alert.alert("Error: Empty Picklist", "You have not added any teams to this picklist.", [
                {
                    label: "OK",
                    style: "cancel",
                },
            ]);
            return;
        }

        const additional_message = presetPicklist
            ? ' This will overwrite the picklist "' + presetPicklist.name + '" by ' + creatorName + "."
            : "";
        Alert.alert("Upload Picklist", "Are you sure you want to upload this picklist?" + additional_message, [
            {
                label: "Cancel",
                style: "cancel",
            },
            {
                label: "Upload",
                onPress: () => {
                    savePicklistToDB();
                    navigation.navigate("Manager");
                },
            },
        ]);
    };

    const addTeam = (team: number) => {
        let newTeam: PicklistTeam = {
            dnp: false,
            tags: [],
            team_number: team,
            notes: "",
        };
        setTeamsList((prevTeams) => [...prevTeams, newTeam]);
    };

    const removeTeam = (team: number) => {
        setTeamsList((prevTeams) => prevTeams.filter((t) => t.team_number !== team));
    };

    // only used by TeamAddingModal
    const addOrRemoveTeam = (team: SimpleTeam) => {
        if (teams_list.some((t) => t.team_number === team.team_number)) {
            removeTeam(team.team_number);
        } else {
            addTeam(team.team_number);
        }
    };

    const addOrRemoveTeamLiveMode = (team: PicklistTeam) => {
        if (removed_teams.includes(team)) {
            setRemovedTeams((prev) => prev.filter((t) => t !== team));
        } else {
            setRemovedTeams((prev) => [...prev, team]);
        }
    };

    const addTag = (team: PicklistTeam, tag: number) => {
        let newTeams = teams_list.map((t) => {
            if (t === team && !t.tags.includes(tag)) {
                t.tags.push(tag);
            }
            return t;
        });
        setTeamsList(newTeams);

        let newTags = new Set(uniqueTags);
        newTags.add(tag);
        setUniqueTags(newTags);
    };

    const removeTag = (team: PicklistTeam, tag: number) => {
        let newTeams = teams_list.map((t) => {
            if (t === team) {
                t.tags = t.tags.filter((a) => a !== tag);
            }
            return t;
        });
        setTeamsList(newTeams);

        fillUniqueTags();
    };

    // sets up the set of unique tags
    const fillUniqueTags = () => {
        let temp = new Set<number>();
        teams_list.forEach((t) => {
            t.tags.forEach((tag) => {
                temp.add(tag);
            });
        });
        setUniqueTags(temp);
    };

    const deleteTag = (tag: number) => {
        for (let team of teams_list) {
            removeTag(team, tag);
        }

        TagsDB.deleteTag(tag).then(() => {
            TagsDB.getTagsForPicklist(picklist_id).then((tags) => {
                setAllTags(tags);
            });
        });
    };

    const getTagFromTagId = (tagId: number) => {
        return allTags.find((tag) => Number.parseInt(tag.id ?? "", 10) === tagId);
    };

    const addToDNP = (team: SimpleTeam) => {
        let newTeams = teams_list;

        let specificTeam = teams_list.find((t) => t.team_number === team.team_number);
        if (!specificTeam) {
            newTeams.push({
                team_number: team.team_number,
                dnp: true,
                tags: [],
                notes: "",
            });
        } else {
            newTeams = newTeams.filter((t) => t.team_number !== team.team_number);
        }

        setTeamsList(newTeams);
    };

    const styles = StyleSheet.create({
        name_input: {
            color: colors.text,
            fontSize: 30,
            fontFamily: "monospace",
            fontWeight: name ? "normal" : "200",
        },
        container: {
            color: colors.text,
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
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 8,
        },
        // the style taken on by every team item in the list that is not selected, when a team has been selected
        team_item_in_list_not_selected: {
            padding: "2%",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0.4,
        },
        team_number_strikethrough: {
            flex: 1,
            color: "gray",
            fontSize: 18,
            marginLeft: "5%",
        },
        team_number_displayed: {
            // flex: 1,
            color: colors.text,
            fontSize: 18,
            marginLeft: "5%",
        },
        modal_activation_button_container: {
            width: "16%",
            height: 30,
            backgroundColor: colors.card,
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
                        backgroundColor: isActive ? colors.card : colors.background,
                    }}
                    onPressIn={drag}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <BouncyCheckbox isChecked={false} disabled={true} fillColor={colors.primary} />
                        <Text style={{ color: "gray" }}>{teams_list.indexOf(item) + 1}</Text>
                        <Text
                            style={{
                                ...styles.team_number_displayed,
                                flex: 1,
                            }}
                        >
                            {item.team_number}
                            {teamNumberToNameMap.size === 0 ? "" : " "}
                            {teamNumberToNameMap.get(item.team_number)}
                        </Text>
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
                                            style={{
                                                borderRadius: 10,
                                                backgroundColor: getTagFromTagId(tag)?.color,
                                                width: 14,
                                                height: 14,
                                                margin: "2%",
                                                opacity: removed_teams.includes(item) ? 0.4 : 1,
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
            {/*  if the picklist was made by someone else, show the name and title. else, let the user enter a title */}
            {presetPicklist ? (
                <View>
                    <Text style={styles.name_input}>{presetPicklist.name}</Text>
                    <Text style={{ color: "gray" }}>By {creatorName}</Text>
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
                    <Bs.ExclamationTriangle size="16" fill={teams_list.some((a) => a.dnp) ? "red" : "gray"} />
                </Pressable>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    // if the contents of the view are too wide, they will be wrapped and placed below the previous line
                    flexWrap: "wrap",
                    // the contents of the view are centered along the horizontal axis
                }}
            >
                {[...uniqueTags].map((tag) => {
                    return (
                        <Pressable
                            key={tag}
                            onLongPress={() => {
                                setTagColorChangeModalVisible(true);
                                setSelectedTagForColorChange(getTagFromTagId(tag));
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
                                backgroundColor: filteredTags.has(tag) ? getTagFromTagId(tag)?.color : colors.card,
                                paddingHorizontal: "4%",
                                paddingVertical: "2%",
                                margin: 4,
                                borderRadius: 20,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                borderWidth: 2,
                                borderColor: getTagFromTagId(tag)?.color,
                            }}
                        >
                            <Text
                                style={{
                                    color: filteredTags.has(tag)
                                        ? Color.parse(getTagFromTagId(tag)?.color ?? "").fg.hex
                                        : colors.text,
                                    fontWeight: filteredTags.has(tag) ? "bold" : "normal",
                                }}
                            >
                                {allTags.find((t) => Number.parseInt(t.id ?? "", 10) === tag)?.name ?? "Unknown"}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            <TagsModal
                visible={createTagModal}
                setVisible={setCreateTagModal}
                picklist_id={picklist_id}
                selected_team={selectedTeam}
                addTag={addTag}
                removeTag={removeTag}
                issueDeleteCommand={deleteTag}
            />
            <TagColorChangeModal
                visible={tagColorChangeModalVisible}
                setVisible={setTagColorChangeModalVisible}
                tag={selectedTagForColorChange}
            />
            {teams_list.length === 0 && (
                <Pressable onPress={() => setTeamAddingModalVisible(true)}>
                    <Text
                        style={{
                            color: colors.primary,
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginVertical: "50%",
                        }}
                    >
                        Add teams to the picklist
                    </Text>
                </Pressable>
            )}
            <TeamAddingModal
                visible={teamAddingModalVisible}
                setVisible={setTeamAddingModalVisible}
                teams_list={teams_list}
                teamsAtCompetition={tbaSimpleTeams}
                addOrRemoveTeam={addOrRemoveTeam}
            />
            <DoNotPickModal
                visible={showDNPModal}
                setVisible={setShowDNPModal}
                teams={teams_list}
                teamsAtCompetition={tbaSimpleTeams}
                numbersToNames={teamNumberToNameMap}
                addToDNP={addToDNP}
            />
            {dragging_active ? (
                <DraggableFlatList
                    data={teams_list}
                    onDragEnd={({ data }) => setTeamsList(data)}
                    keyExtractor={(item) => String(item.team_number)}
                    renderItem={renderItemDraggable}
                />
            ) : (
                <FlatList
                    data={teams_list.filter(
                        (t) =>
                            filteredTags.size === 0 ||
                            filteredTags.size === t.tags.filter((tag) => filteredTags.has(tag)).length
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
                                            // alignSelf: 'flex-start',
                                            // alignContent: 'flex-start',
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        <BouncyCheckbox
                                            isChecked={removed_teams.includes(item)}
                                            disabled={item !== selectedTeam && selectedTeam !== null}
                                            fillColor={colors.primary}
                                            onPress={() => {
                                                addOrRemoveTeamLiveMode(item);
                                                ReactNativeHapticFeedback.trigger("notificationSuccess", {
                                                    enableVibrateFallback: true,
                                                    ignoreAndroidSystemSettings: false,
                                                });
                                            }}
                                        />
                                        <Text style={{ color: "gray" }}>{teams_list.indexOf(item) + 1}</Text>
                                        <Text
                                            style={
                                                removed_teams.includes(item)
                                                    ? {
                                                          ...styles.team_number_displayed,
                                                          color: "gray",
                                                          textDecorationLine: "line-through",
                                                          textDecorationStyle: "solid",
                                                      }
                                                    : item.dnp
                                                    ? { ...styles.team_number_displayed, color: "red" }
                                                    : styles.team_number_displayed
                                            }
                                        >
                                            {item.team_number}
                                            {teamNumberToNameMap.size === 0 ? "" : " - "}
                                            {teamNumberToNameMap.get(item.team_number)}
                                        </Text>
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
                                                            style={{
                                                                borderRadius: 10,
                                                                backgroundColor: getTagFromTagId(tag)?.color,
                                                                width: 14,
                                                                height: 14,
                                                                margin: "2%",
                                                                opacity: removed_teams.includes(item) ? 0.4 : 1,
                                                            }}
                                                        />
                                                    );
                                                })}
                                        </View>
                                    </View>
                                    {selectedTeam === item && (
                                        <TextInput
                                            inputMode={"text"}
                                            placeholder={"Notes"}
                                            onChangeText={(text) => {
                                                let newTeams = teams_list.map((t) => {
                                                    if (t === item) {
                                                        t.notes = text;
                                                    }
                                                    return t;
                                                });
                                                setTeamsList(newTeams);
                                            }}
                                            defaultValue={item.notes}
                                            placeholderTextColor={"gray"}
                                            multiline={true}
                                            style={{
                                                color: colors.text,
                                                backgroundColor: colors.card,
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
                                            <Bs.ExclamationTriangle size="24" fill={item.dnp ? "red" : "gray"} />
                                        </Pressable>
                                        <Pressable
                                            style={{ paddingHorizontal: "4%", flex: 0 }}
                                            onPress={() => {
                                                rootNavigation.navigate("App", {
                                                    screen: "Search",
                                                    params: {
                                                        screen: "TeamViewer",
                                                        params: {
                                                            team: tbaSimpleTeams.find(
                                                                (team) => team.team_number === item.team_number
                                                            )!,
                                                            competitionId: currentCompID,
                                                        },
                                                    },
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
                                                            label: "Cancel",
                                                            style: "cancel",
                                                        },
                                                        {
                                                            label: "Remove",
                                                            onPress: () => {
                                                                removeTeam(item.team_number);
                                                                setSelectedTeamWithAnimation(null);
                                                            },
                                                        },
                                                    ]
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
                    keyExtractor={(item) => String(item.team_number)}
                />
            )}
        </Pressable>
    );
}
