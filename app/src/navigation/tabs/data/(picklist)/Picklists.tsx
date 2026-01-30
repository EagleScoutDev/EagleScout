// TODO: delete or rewrite this

import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { PicklistsDB, type PicklistStructure } from "@/lib/database/Picklists";
import { ProfilesDB } from "@/lib/database/Profiles";
import * as Bs from "@/ui/icons";
import type { DataTabScreenProps } from "../index";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { StandardButton } from "@/ui/StandardButton";

export interface PicklistsProps extends DataTabScreenProps<"Picklists"> {}
export function Picklists({ navigation }: PicklistsProps) {
    const { colors } = useTheme();
    const [picklists, setPicklists] = useState<PicklistStructure[]>([]);
    const [users, setUsers] = useState<Map<string, string>>(new Map());
    const [refreshing, setRefreshing] = useState(false);
    const [hoveredPicklistID, setHoveredPicklistID] = useState("");
    const [currentCompHappening, setCurrentCompHappening] = useState(false);
    const [currentCompID, setCurrentCompID] = useState<number>(-1);

    const getPicklists = (cmpId: any) => {
        // get picklists from database
        PicklistsDB.getPicklists(cmpId)
            .then((picklistsResponse) => {
                const promises = picklistsResponse.map((picklist) => {
                    return ProfilesDB.getProfile(picklist.created_by);
                });

                Promise.all(promises).then((profiles) => {
                    const usersCopy = new Map();
                    for (let i = 0; i < picklistsResponse.length; i++) {
                        usersCopy.set(picklistsResponse[i].created_by, profiles[i].name);
                    }
                    // sort picklists by created_at
                    picklistsResponse.sort((a, b) => {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
                    setPicklists(picklistsResponse);
                    setUsers(usersCopy);
                });
            })
            .catch((error) => {
                console.error("Error getting picklists:", error);
            });
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (currentCompID !== -1) {
            getPicklists(currentCompID);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        navigation.addListener("focus", () => {
            CompetitionsDB.getCurrentCompetition().then((comp) => {
                if (comp != null) {
                    setCurrentCompID(comp.id);
                    getPicklists(comp.id);
                    setCurrentCompHappening(true);
                }
            });
        });
    }, [navigation]);

    // Render function using FlatList
    return (
        <View style={{ flex: 1, paddingBottom: 10 }}>
            {!currentCompHappening ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <UIText>There is no competition happening currently.</UIText>
                </View>
            ) : (
                <>
                    {picklists.length === 0 && (
                        <UIText size={20} style={{ textAlign: "center", marginTop: "5%" }}>
                            No picklists found.{"\n"}Create one to get started!
                        </UIText>
                    )}
                    <FlatList
                        data={picklists}
                        onRefresh={() => onRefresh()}
                        refreshing={refreshing}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    key={item.id}
                                    onPressIn={() => {
                                        setHoveredPicklistID(item.name);
                                    }}
                                    onPressOut={() => {
                                        setHoveredPicklistID("");
                                    }}
                                    onPress={() => {
                                        navigation.navigate("Picklists/Create", {
                                            picklist_id: item.id,
                                            currentCompID: currentCompID,
                                        });
                                    }}
                                    onLongPress={() => {
                                        Alert.alert(
                                            "Delete Picklist",
                                            "Are you sure you want to delete this picklist?",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Delete",
                                                    onPress: () => {
                                                        PicklistsDB.deletePicklist(item.id).then(() => {
                                                            getPicklists(item.competition_id);
                                                        });
                                                    },
                                                },
                                            ],
                                            { cancelable: false },
                                        );
                                    }}
                                    style={{
                                        backgroundColor: colors.bg1.hex,
                                        padding: "5%",
                                        borderRadius: 10,
                                        marginTop: "5%",
                                        marginHorizontal: "5%",
                                        flexDirection: "row",
                                        // alignItems: 'center',
                                        borderWidth: hoveredPicklistID === item.name ? 1.5 : 1,
                                        borderColor:
                                            hoveredPicklistID === item.name ? colors.primary.hex : colors.border.hex,
                                    }}
                                >
                                    <View>
                                        <UIText size={20} bold>
                                            {item.name}
                                        </UIText>
                                        {/*<UIText>{item.teams.toString()}</UIText>*/}
                                        <UIText size={12} placeholder>
                                            By {users.get(item.created_by) || "Unknown"}, at{" "}
                                            {new Date(item.created_at).toLocaleString()}
                                        </UIText>
                                    </View>
                                    <Bs.ChevronRight
                                        size="20"
                                        fill="gray"
                                        style={{ position: "absolute", right: "5%", top: "80%" }}
                                    />
                                </Pressable>
                            );
                        }}
                    />
                    <StandardButton
                        color={colors.primary.hex}
                        onPress={() => {
                            navigation.navigate("Picklists/Create", {
                                picklist_id: -1,
                                currentCompID: currentCompID,
                            });
                        }}
                        text="Create Picklist"
                    />
                </>
            )}
        </View>
    );
}
