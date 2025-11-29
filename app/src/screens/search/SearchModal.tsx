import { FlatList, Pressable, TextInput, View } from "react-native";
import { UIText } from "../../ui/UIText";
import { useEffect, useState } from "react";

import type { SimpleTeam } from "../../lib/frc/tba/TBA.ts";
import type { MatchReportReturnData } from "../../database/ScoutMatchReports";
import { ProfilesDB } from "../../database/Profiles";
import { Dropdown } from "react-native-element-dropdown";
import { MatchReportViewer } from "../../components/modals/MatchReportViewer.tsx";
import { isTablet } from "../../lib/deviceType";
import type { SearchMenuScreenProps } from "./SearchMenu";
import type { Profile } from "../../lib/user/profile";
import * as Bs from "../../ui/icons";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

enum FilterState {
    TEAM,
    MATCH,
    PERSON,
}

export interface SearchModalParams {
    teams: SimpleTeam[];
    reportsByMatch: Map<number, MatchReportReturnData[]>;
    competitionId: number;
}
export interface SearchModalProps extends SearchMenuScreenProps<"SearchModal"> {}
export function SearchModal({ route, navigation }: SearchModalProps) {
    const { teams, reportsByMatch, competitionId } = route.params;
    const { colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterState, setFilterState] = useState<FilterState>(FilterState.TEAM);

    // parsed from reports, then used to find names
    const [userIds, setUserIds] = useState<string[]>([]);

    const [users, setUsers] = useState<Profile[]>([]);

    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

    const [scoutViewerVisible, setScoutViewerVisible] = useState<boolean>(false);
    const [currentReport, setCurrentReport] = useState<MatchReportReturnData>();

    const getSearchPrompt = (): string => {
        switch (filterState) {
            case FilterState.TEAM:
                return 'Try "114" or "Eaglestrike"';
            case FilterState.MATCH:
                return 'Try "10"';
            case FilterState.PERSON:
                return 'Try "John" or "John Smith"';
        }
    };

    useEffect(() => {
        let temp: Set<string> = new Set<string>();
        reportsByMatch.forEach((reports, match) => {
            reports.forEach((report) => {
                if (!temp.has(report.userId)) {
                    temp.add(report.userId);
                }
            });
        });
        setUserIds(Array.from(temp));
    }, [reportsByMatch]);

    useEffect(() => {
        if (userIds.length === 0) {
            return;
        }

        let temp: Profile[] = [];

        for (let i = 0; i < userIds.length; i++) {
            ProfilesDB.getProfile(userIds[i]).then((profile) => {
                temp.push(profile);
            });
        }

        // sort temp by first name
        temp.sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
        });

        setUsers(temp);
    }, [userIds]);

    return (
        <>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.bg0.hex,
                    paddingTop: isTablet() ? "0%" : "10%",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "2%",
                        marginTop: "3%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 10,
                            flex: 1,
                            paddingHorizontal: "2%",
                        }}
                    >
                        <Bs.Search size="20" fill="gray" />
                        <TextInput
                            style={{
                                marginHorizontal: "4%",
                                height: 40,
                                color: colors.fg.hex,
                                flex: 1,
                            }}
                            onChangeText={(text) => setSearchTerm(text)}
                            value={searchTerm}
                            keyboardType={filterState === FilterState.MATCH ? "numeric" : "default"}
                            placeholderTextColor={"lightgray"}
                            placeholder={getSearchPrompt()}
                            onEndEditing={() => {
                                console.log("onEndEditing");
                            }}
                        />
                        {searchTerm.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    setSearchTerm("");
                                }}
                            >
                                <Bs.XCircleFill size="16" fill="gray" />
                            </Pressable>
                        )}
                    </View>
                    <Pressable
                        style={{
                            marginLeft: "5%",
                            marginRight: "5%",
                        }}
                        onPress={() => navigation.popTo("Main")}
                    >
                        <UIText>Cancel</UIText>
                    </Pressable>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        padding: "2%",
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setFilterState(FilterState.TEAM);
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "2%",
                            backgroundColor: filterState === FilterState.TEAM ? colors.fg.hex : colors.bg0.hex,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <UIText
                            style={{
                                color: filterState === FilterState.TEAM ? colors.bg0.hex : colors.fg.hex,
                                fontWeight: filterState === FilterState.TEAM ? "bold" : "normal",
                            }}
                        >
                            Team
                        </UIText>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilterState(FilterState.MATCH);
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "2%",
                            backgroundColor: filterState === FilterState.MATCH ? colors.fg.hex : colors.bg0.hex,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <UIText
                            style={{
                                color: filterState === FilterState.MATCH ? colors.bg0.hex : colors.fg.hex,
                                fontWeight: filterState === FilterState.MATCH ? "bold" : "normal",
                            }}
                        >
                            Match
                        </UIText>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilterState(FilterState.PERSON);
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "2%",
                            backgroundColor: filterState === FilterState.PERSON ? colors.fg.hex : colors.bg0.hex,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <UIText
                            style={{
                                color: filterState === FilterState.PERSON ? colors.bg0.hex : colors.fg.hex,
                                fontWeight: filterState === FilterState.PERSON ? "bold" : "normal",
                            }}
                        >
                            Person
                        </UIText>
                    </Pressable>
                </View>
                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.border.hex,
                    }}
                />
                {filterState === FilterState.TEAM && (
                    <FlatList
                        data={teams.filter((team) => {
                            return (
                                team.team_number.toString().includes(searchTerm) ||
                                team.nickname.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                        })}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate("TeamViewer", {
                                            team: item,
                                            competitionId: competitionId,
                                        });
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: "4%",
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border.hex,
                                    }}
                                >
                                    <UIText size={16} style={{ flex: 1 }}>
                                        {item.team_number}
                                    </UIText>
                                    <UIText size={16} style={{ flex: 5 }}>
                                        {item.nickname}
                                    </UIText>
                                    <Bs.ChevronRight size="16" fill="gray" style={{ flex: 1 }} />
                                </Pressable>
                            );
                        }}
                    />
                )}
                {filterState === FilterState.MATCH && (
                    <FlatList
                        data={Array.from(reportsByMatch.keys()).filter((match) => {
                            return match.toString().includes(searchTerm);
                        })}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <View
                                        style={{
                                            minWidth: "100%",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginVertical: "3%",
                                        }}
                                    >
                                        <UIText
                                            style={{
                                                color: colors.fg.hex,
                                                opacity: 0.6,
                                                marginHorizontal: "4%",
                                                fontWeight: "bold",
                                                fontSize: 18,
                                            }}
                                        >
                                            {item}
                                        </UIText>
                                        <View
                                            style={{
                                                height: 2,
                                                width: "100%",
                                                backgroundColor: colors.border.hex,
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            // make it like a 3x2 grid
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {reportsByMatch.get(item)?.map((report, index) => {
                                            return (
                                                <Pressable
                                                    onPress={() => {
                                                        setCurrentReport(report);
                                                        setScoutViewerVisible(true);
                                                    }}
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        backgroundColor: index < 3 ? "crimson" : "dodgerblue",
                                                        margin: "2%",
                                                        padding: "6%",
                                                        borderRadius: 10,
                                                        minWidth: "25%",
                                                    }}
                                                >
                                                    <UIText bold style={{ textAlign: "center", flex: 1 }}>
                                                        {report.teamNumber}
                                                    </UIText>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        }}
                    />
                )}
                {filterState === FilterState.PERSON && users.length > 0 && (
                    <View style={{ flex: 1, marginBottom: "10%" }}>
                        <Dropdown
                            data={users.map((user) => {
                                return {
                                    label: user.name,
                                    value: user.id,
                                };
                            })}
                            labelField={"label"}
                            valueField={"value"}
                            onChange={(item) => {
                                let newSelectedUser: Profile | null = null;
                                users.forEach((user) => {
                                    if (user.id === item.value) {
                                        newSelectedUser = user;
                                    }
                                });
                                setSelectedUser(newSelectedUser);
                            }}
                            activeColor={colors.bg1.hex}
                            style={{
                                borderRadius: 10,
                                padding: "2%",
                                margin: "2%",
                                backgroundColor: colors.bg0.hex,
                            }}
                            selectedTextStyle={{
                                color: colors.fg.hex,
                                fontWeight: "bold",
                                backgroundColor: colors.bg0.hex,
                            }}
                            containerStyle={{
                                borderRadius: 10,
                                backgroundColor: colors.bg0.hex,
                            }}
                            itemContainerStyle={{
                                borderRadius: 10,
                                borderBottomWidth: 1,
                                borderColor: colors.border.hex,
                                backgroundColor: colors.bg0.hex,
                            }}
                            itemTextStyle={{
                                color: colors.fg.hex,
                            }}
                            placeholder={"Select a user"}
                            placeholderStyle={{
                                color: colors.primary.hex,
                            }}
                            value={{
                                label: selectedUser?.name ?? "Select a user",
                                value: selectedUser?.id ?? "",
                            }}
                            renderLeftIcon={() => {
                                return (
                                    <Bs.PersonCircle
                                        size="20"
                                        fill={colors.primary.hex}
                                        style={{ marginRight: "4%" }}
                                    />
                                );
                            }}
                        />
                        {selectedUser && (
                            <FlatList
                                data={Array.from(reportsByMatch.keys()).filter((match) => {
                                    return reportsByMatch
                                        .get(match)
                                        ?.some((report) => report.userId === selectedUser?.id);
                                })}
                                renderItem={({ item }) => {
                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    minWidth: "100%",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginVertical: "3%",
                                                }}
                                            >
                                                <UIText size={18} bold level={1} style={{ marginHorizontal: "4%" }}>
                                                    {item}
                                                </UIText>
                                                <View
                                                    style={{
                                                        height: 2,
                                                        width: "100%",
                                                        backgroundColor: colors.border.hex,
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    // make it like a 3x2 grid
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {reportsByMatch.get(item)?.map((report, index) => {
                                                    if (report.userId === selectedUser?.id) {
                                                        return (
                                                            <Pressable
                                                                onPress={() => {
                                                                    setCurrentReport(report);
                                                                    setScoutViewerVisible(true);
                                                                }}
                                                                style={{
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    backgroundColor:
                                                                        index < 3 ? "crimson" : "dodgerblue",
                                                                    margin: "2%",
                                                                    padding: "6%",
                                                                    borderRadius: 10,
                                                                    minWidth: "25%",
                                                                }}
                                                            >
                                                                <UIText bold style={{ textAlign: "center", flex: 1 }}>
                                                                    {report.teamNumber}
                                                                </UIText>
                                                            </Pressable>
                                                        );
                                                    }
                                                })}
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                        )}
                    </View>
                )}
            </View>
            {scoutViewerVisible && currentReport && (
                <MatchReportViewer
                    onDismiss={() => setScoutViewerVisible(false)}
                    data={currentReport}
                    isOfflineForm={false}
                    navigateToTeamViewer={() => {
                        // Navigation not implemented in SearchModal
                    }}
                    onEdit={async () => {
                        // Editing not supported in search modal
                        return false;
                    }}
                />
            )}
        </>
    );
}
