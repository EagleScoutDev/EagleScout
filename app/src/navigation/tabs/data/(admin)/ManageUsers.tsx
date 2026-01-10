import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { AccountRole } from "@/lib/user/account";
import type { User } from "@/lib/user/user";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";

function SortOption({ onPress, title, isActive }: { onPress: () => void; title: string; isActive: boolean }) {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => {
                onPress();
            }}
            style={{
                backgroundColor: isActive ? colors.primary.hex : colors.bg1.hex,
                padding: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                margin: 10,
                borderWidth: 1,
                borderColor: colors.border.hex,
            }}
        >
            <UIText color={isActive ? colors.primary.fg : colors.fg}>{title}</UIText>
        </TouchableOpacity>
    );
}

export function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const { colors } = useTheme();
    const [sort, setSort] = useState("All");
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);


    const handleSort = (sortType) => {
        setSort(sortType);
        if (sortType === "All") {
            setSortedUsers(users);
            fetchUsers();
        } else if (sortType === "Rejected") {
            setSortedUsers(users.filter((user) => user.account.role === AccountRole.Rejected));
        } else if (sortType === "Captain") {
            setSortedUsers(users.filter((user) => user.account.role === AccountRole.Admin));
        } else if (sortType === "Scouter") {
            setSortedUsers(users.filter((user) => user.account.role === AccountRole.Scouter));
        }
    };

    const fetchUsers = async () => {
        const { data: users, error } = await supabase.rpc("get_user_profiles_with_email");
        users.forEach((user) => {
            user.name = (user.first_name || "UNKNOWN_FIRSTNAME") + " " + (user.last_name || "UNKNOWN_LASTNAME");
        });
        if (error) {
            console.error(error);
        }
        // sort users by name
        users.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setUsers(users);
        setSortedUsers(users);
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    async function updateApproveStatus(user, b) {
        const { error } = await supabase.from("user_attributes").update({ scouter: b }).eq("id", user.id);
        if (error) {
            console.error(error);
            Alert.alert("Error updating user status", JSON.stringify(error));
        } else {
            fetchUsers();
        }
    }

    async function updateAdminStatus(user, b) {
        const { error } = await supabase.from("user_attributes").update({ admin: b }).eq("id", user.id);
        if (error) {
            console.error(error);
            Alert.alert("Error updating user status", JSON.stringify(error));
        } else {
            fetchUsers();
        }
    }

    // cleanup after any database changes
    const successAlert = () => {
        Toast.show({
            type: "success",
            text1: "User status updated!",
            visibilityTime: 3000,
        });
    };

    // create a constant handlePress that takes in a user and a string
    const handlePress = (user, changeType) => {
        // if the string is 'edit'
        if (changeType === "approved") {
            if (user.scouter) {
                Alert.alert(
                    "Unapprove " + user.name + "?",
                    "Are you sure you want to unapprove this user? This will remove their access from creating and viewing scouting reports.",
                    [
                        {
                            label: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                        },
                        {
                            label: "OK",
                            onPress: async () => {
                                // call the function updateAdminStatus and pass in the user and true
                                if (user.admin) {
                                    const res = await supabase.auth.getUser();
                                    const currentUser = res.data.user;
                                    if (user.id === currentUser.id) {
                                        Alert.alert(
                                            "Cannot unapprove yourself",
                                            "For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.",
                                        );
                                    } else {
                                        updateApproveStatus(user, false);
                                        updateAdminStatus(user, false).then(successAlert);
                                    }
                                } else {
                                    updateApproveStatus(user, false);
                                    updateAdminStatus(user, false).then(successAlert);
                                }
                            },
                        },
                    ],
                    { cancelable: false },
                );
            } else {
                Alert.alert(
                    "Approve " + user.name + "?",
                    "Are you sure you want to approve this user?",
                    [
                        {
                            label: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                        },
                        {
                            label: "OK",
                            onPress: () => {
                                // call the function updateAdminStatus and pass in the user and true
                                updateApproveStatus(user, true).then(successAlert);
                            },
                        },
                    ],
                    { cancelable: false },
                );
            }
        } else if (changeType === "admin") {
            if (user.admin) {
                Alert.alert(
                    "Remove " + user.name + " as admin?",
                    "Are you sure you want to remove this user as admin?",
                    [
                        {
                            label: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                        },
                        {
                            label: "OK",
                            onPress: async () => {
                                // call the function updateAdminStatus and pass in the user and true
                                const res = await supabase.auth.getUser();
                                const currentUser = res.data.user;
                                if (user.id === currentUser.id) {
                                    Alert.alert(
                                        "Cannot unapprove yourself",
                                        "For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.",
                                    );
                                } else {
                                    updateAdminStatus(user, false).then(successAlert);
                                }
                            },
                        },
                    ],
                    { cancelable: false },
                );
            } else {
                Alert.alert(
                    "Make " + user.name + " an admin?",
                    "Are you sure you want to make this user an admin?",
                    [
                        {
                            label: "Cancel",
                            onPress: () => {},
                            style: "cancel",
                        },
                        {
                            label: "OK",
                            onPress: () => {
                                // call the function updateAdminStatus and pass in the user and true
                                updateAdminStatus(user, true);
                                updateApproveStatus(user, true).then(successAlert);
                            },
                        },
                    ],
                    { cancelable: false },
                );
            }
        }
    };

    const styles = StyleSheet.create({
        option: {
            padding: 10,
            color: colors.fg.hex,
        },
        chosen: {
            backgroundColor: colors.primary.hex,
            color: colors.primary.fg.hex,
            padding: 10,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: colors.primary.hex,
            // prevent the background color from showing through the border
            overflow: "hidden",
        },
        chosenRejected: {
            backgroundColor: colors.danger.hex,
            color: "white",
            padding: 10,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: colors.danger.hex,
            // prevent the background color from showing through the border
            overflow: "hidden",
        },
    });

    const picker = (user) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: colors.bg1.hex,
                    justifyContent: "space-around",
                    padding: 5,

                    margin: 5,
                    borderRadius: 10,
                }}
            >
                <UIText
                    style={user.scouter ? styles.option : styles.chosenRejected}
                    onPress={() => {
                        if (user.scouter) {
                            handlePress(user, "approved");
                        }
                    }}
                >
                    Rejected
                </UIText>
                <UIText
                    onPress={() => {
                        if (!user.scouter) {
                            handlePress(user, "approved");
                        } else if (user.admin) {
                            handlePress(user, "admin");
                        }
                    }}
                    style={user.scouter ? (user.admin ? styles.option : styles.chosen) : styles.option}
                >
                    Scouter
                </UIText>
                <UIText
                    style={user.admin ? styles.chosen : styles.option}
                    onPress={() => {
                        if (!user.admin) {
                            handlePress(user, "admin");
                        }
                    }}
                >
                    Captain
                </UIText>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <SortOption
                    title="All"
                    onPress={() => {
                        handleSort("All");
                    }}
                    isActive={sort === "All"}
                />
                <SortOption
                    title={"Rejected"}
                    onPress={() => {
                        handleSort("Rejected");
                    }}
                    isActive={sort === "Rejected"}
                />
                <SortOption
                    title="Scouter"
                    onPress={() => {
                        handleSort("Scouter");
                    }}
                    isActive={sort === "Scouter"}
                />
                <SortOption
                    title="Captain"
                    onPress={() => {
                        handleSort("Captain");
                    }}
                    isActive={sort === "Captain"}
                />
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-around",
                        padding: 10,
                        flex: 1,
                    }}
                >
                    {sortedUsers.map((user) => (
                        <View
                            style={{
                                flexDirection: "column",
                                backgroundColor: colors.bg1.hex,
                                paddingTop: 15,
                                paddingLeft: 15,
                                margin: 5,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: colors.border.hex,
                            }}
                            key={user.email}
                        >
                            <UIText size={20} bold>
                                {user.name}
                            </UIText>
                            <UIText>{user.email}</UIText>
                            {picker(user)}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
