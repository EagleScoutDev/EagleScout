import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { StandardButton } from "../../../../components/StandardButton";
import { CompetitionsDB } from "../../../../database/Competitions";
import { PicklistsDB, type PicklistStructure } from "../../../../database/Picklists";
import { ProfilesDB } from "../../../../database/Profiles";
import type { PicklistScreenProps } from "./PicklistMenu";

export interface PicklistManagerProps extends PicklistScreenProps<"Manager"> {}
export function PicklistManager({ navigation }: PicklistManagerProps) {
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
                    <Text style={{ color: colors.text }}>There is no competition happening currently.</Text>
                </View>
            ) : (
                <>
                    {picklists.length === 0 && (
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 20,
                                marginTop: "5%",
                                color: colors.text,
                            }}
                        >
                            No picklists found.{"\n"}Create one to get started!
                        </Text>
                    )}
                    <FlatList
                        data={picklists}
                        onRefresh={() => onRefresh()}
                        refreshing={refreshing}
                        keyExtractor={(item) => item.name}
                        // keyExtractor={item => item.teams.length} // Use a unique property of the picklist as key
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    key={item.id ?? Math.random()}
                                    onPressIn={() => {
                                        setHoveredPicklistID(item.name);
                                    }}
                                    onPressOut={() => {
                                        setHoveredPicklistID("");
                                    }}
                                    onPress={() => {
                                        navigation.navigate("Creator", {
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
                                            { cancelable: false }
                                        );
                                    }}
                                    style={{
                                        backgroundColor: colors.card,
                                        padding: "5%",
                                        borderRadius: 10,
                                        marginTop: "5%",
                                        marginHorizontal: "5%",
                                        flexDirection: "row",
                                        // alignItems: 'center',
                                        borderWidth: hoveredPicklistID === item.name ? 1.5 : 1,
                                        borderColor: hoveredPicklistID === item.name ? colors.primary : colors.border,
                                    }}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: colors.text,
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        {/*<Text>{item.teams.toString()}</Text>*/}
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "gray",
                                            }}
                                        >
                                            By {users.get(item.created_by) || "Unknown"}, at{" "}
                                            {new Date(item.created_at).toLocaleString()}
                                        </Text>
                                    </View>
                                    <Svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 24"
                                        stroke="gray"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{
                                            position: "absolute",
                                            right: "5%",
                                            top: "80%",
                                        }}
                                    >
                                        <Path
                                            fill-rule="evenodd"
                                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                        />
                                    </Svg>
                                </Pressable>
                            );
                        }}
                    />
                    <StandardButton
                        color={colors.primary}
                        onPress={() => {
                            navigation.navigate("Creator", {
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
