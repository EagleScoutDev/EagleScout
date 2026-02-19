import React, { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { AccountRole } from "@/lib/user/account";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UIChip } from "@/ui/components/UIChip";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import type { UserProfileWithName } from "@/lib/queries/users";
import { userMutations } from "@/lib/mutations/users";

export function ManageUsers() {
    type SortType = "All" | "Rejected" | "Captain" | "Scouter";

    const { colors } = useTheme();
    const [sort, setSort] = useState<SortType>("All");

    const { data: users = [] } = useQuery(queries.users.all);

    const sortedUsers = useMemo(() => {
        if (sort === "All") return users;
        if (sort === "Rejected")
            return users.filter((user) => user.account.role === AccountRole.Rejected);
        if (sort === "Captain")
            return users.filter((user) => user.account.role === AccountRole.Admin);
        if (sort === "Scouter")
            return users.filter((user) => user.account.role === AccountRole.Scouter);
        return users;
    }, [users, sort]);

    const updateApproveStatus = useMutation({
        ...userMutations.updateApproveStatus,
        onError: (error) => {
            console.error(error);
            Alert.alert("Error updating user status");
        },
    });
    const updateAdminStatus = useMutation({
        ...userMutations.updateAdminStatus,
        onError: (error) => {
            console.error(error);
            Alert.alert("Error updating user status");
        },
    });

    function successAlert() {
        Toast.show({
            type: "success",
            text1: "User status updated!",
            visibilityTime: 3000,
        });
    }

    function toggleApproved(user: UserProfileWithName) {
        if (user.scouter) {
            Alert.alert(
                "Unapprove " + user.name + "?",
                "Are you sure you want to unapprove this user? This will remove their access from creating and viewing scouting reports.",
                [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        async onPress() {
                            if (user.admin) {
                                const res = await supabase.auth.getUser();
                                const currentUser = res.data.user;
                                if (currentUser && user.id === currentUser.id) {
                                    Alert.alert(
                                        "Cannot unapprove yourself",
                                        "For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.",
                                    );
                                    return;
                                }
                            }

                            await updateApproveStatus.mutateAsync({
                                userId: user.id,
                                approved: false,
                            });
                            await updateAdminStatus.mutateAsync({
                                userId: user.id,
                                isAdmin: false,
                            });
                            successAlert();
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
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        async onPress() {
                            await updateApproveStatus.mutateAsync({
                                userId: user.id,
                                approved: true,
                            });
                            successAlert();
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    }
    function toggleAdmin(user: UserProfileWithName) {
        if (user.admin) {
            Alert.alert(
                "Remove " + user.name + " as admin?",
                "Are you sure you want to remove this user as admin?",
                [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        async onPress() {
                            const res = await supabase.auth.getUser();
                            const currentUser = res.data.user;
                            if (currentUser && user.id === currentUser.id) {
                                Alert.alert(
                                    "Cannot unapprove yourself",
                                    "For security purposes, you cannot unapprove yourself. Please contact another admin to unapprove you.",
                                );
                            } else {
                                await updateAdminStatus.mutateAsync({
                                    userId: user.id,
                                    isAdmin: false,
                                });
                                successAlert();
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
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        async onPress() {
                            await updateAdminStatus.mutateAsync({ userId: user.id, isAdmin: true });
                            await updateApproveStatus.mutateAsync({
                                userId: user.id,
                                approved: true,
                            });
                            successAlert();
                        },
                    },
                ],
                { cancelable: false },
            );
        }
    }

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

    return (
        <SafeAreaProvider>
            <View style={{ paddingTop: 8 }}>
                <UIChip.RadioRow
                    options={[
                        { key: "All", label: "All" },
                        { key: "Rejected", label: "Rejected" },
                        { key: "Scouter", label: "Scouter" },
                        { key: "Captain", label: "Captain" },
                    ]}
                    value={sort}
                    onChange={setSort}
                />
            </View>
            <FlatList
                data={sortedUsers}
                keyExtractor={(user) => user.email}
                contentInsetAdjustmentBehavior={"automatic"}
                contentContainerStyle={{ padding: 16, paddingTop: 8, gap: 16 }}
                renderItem={({ item: user }) => (
                    <View
                        style={{
                            backgroundColor: colors.bg1.hex,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: colors.border.hex,
                            paddingTop: 16,
                            paddingLeft: 16,
                            paddingBottom: 8,
                        }}
                    >
                        <UIText size={20} bold>
                            {user.name}
                        </UIText>
                        <UIText>{user.email}</UIText>

                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: colors.bg1.hex,
                                justifyContent: "space-around",
                                borderRadius: 10,
                                marginTop: 8,
                            }}
                        >
                            <UIText
                                style={user.scouter ? styles.option : styles.chosenRejected}
                                onPress={() => {
                                    if (user.scouter) {
                                        toggleApproved(user);
                                    }
                                }}
                            >
                                Rejected
                            </UIText>
                            <UIText
                                onPress={() => {
                                    if (!user.scouter) {
                                        toggleApproved(user);
                                    } else if (user.admin) {
                                        toggleAdmin(user);
                                    }
                                }}
                                style={
                                    user.scouter
                                        ? user.admin
                                            ? styles.option
                                            : styles.chosen
                                        : styles.option
                                }
                            >
                                Scouter
                            </UIText>
                            <UIText
                                style={user.admin ? styles.chosen : styles.option}
                                onPress={() => {
                                    if (!user.admin) {
                                        toggleAdmin(user);
                                    }
                                }}
                            >
                                Captain
                            </UIText>
                        </View>
                    </View>
                )}
            />
        </SafeAreaProvider>
    );
}
