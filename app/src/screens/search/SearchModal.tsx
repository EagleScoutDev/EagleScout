import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import type { SimpleTeam } from "../../lib/frc/tba";
import type { MatchReportReturnData } from "../../database/ScoutMatchReports";
import { ProfilesDB } from "../../database/Profiles";
import { Dropdown } from "react-native-element-dropdown";
import { ScoutViewer } from "../../components/modals/ScoutViewer";
import { isTablet } from "../../lib/deviceType";
import type { SearchMenuScreenProps } from "./SearchMenu";
import type { Profile } from "../../lib/user/profile";
import * as Bs from "../../ui/icons";

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
                    backgroundColor: colors.background,
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
                                color: colors.text,
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
                        <Text
                            style={{
                                color: colors.text,
                            }}
                        >
                            Cancel
                        </Text>
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
                            backgroundColor: filterState === FilterState.TEAM ? colors.text : colors.background,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: filterState === FilterState.TEAM ? colors.background : colors.text,
                                fontWeight: filterState === FilterState.TEAM ? "bold" : "normal",
                            }}
                        >
                            Team
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilterState(FilterState.MATCH);
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "2%",
                            backgroundColor: filterState === FilterState.MATCH ? colors.text : colors.background,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: filterState === FilterState.MATCH ? colors.background : colors.text,
                                fontWeight: filterState === FilterState.MATCH ? "bold" : "normal",
                            }}
                        >
                            Match
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setFilterState(FilterState.PERSON);
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: "2%",
                            backgroundColor: filterState === FilterState.PERSON ? colors.text : colors.background,
                            borderRadius: 10,
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: filterState === FilterState.PERSON ? colors.background : colors.text,
                                fontWeight: filterState === FilterState.PERSON ? "bold" : "normal",
                            }}
                        >
                            Person
                        </Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.border,
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
                                        borderBottomColor: colors.border,
                                    }}
                                >
                                    <Text style={{ color: colors.text, flex: 1, fontSize: 16 }}>
                                        {item.team_number}
                                    </Text>
                                    <Text style={{ color: colors.text, flex: 5, fontSize: 16 }}>{item.nickname}</Text>
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
                                        <Text
                                            style={{
                                                color: colors.text,
                                                opacity: 0.6,
                                                marginHorizontal: "4%",
                                                fontWeight: "bold",
                                                fontSize: 18,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                        <View
                                            style={{
                                                height: 2,
                                                width: "100%",
                                                backgroundColor: colors.border,
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
                                                    <Text
                                                        style={{
                                                            color: colors.text,
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {report.teamNumber}
                                                    </Text>
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
                            activeColor={colors.card}
                            style={{
                                borderRadius: 10,
                                padding: "2%",
                                margin: "2%",
                                backgroundColor: colors.background,
                            }}
                            selectedTextStyle={{
                                color: colors.text,
                                fontWeight: "bold",
                                backgroundColor: colors.background,
                            }}
                            containerStyle={{
                                borderRadius: 10,
                                backgroundColor: colors.background,
                            }}
                            itemContainerStyle={{
                                borderRadius: 10,
                                borderBottomWidth: 1,
                                borderColor: colors.border,
                                backgroundColor: colors.background,
                            }}
                            itemTextStyle={{
                                color: colors.text,
                            }}
                            placeholder={"FormSelect a user"}
                            placeholderStyle={{
                                color: colors.primary,
                            }}
                            value={{
                                label: selectedUser?.name ?? "FormSelect a user",
                                value: selectedUser?.id ?? "",
                            }}
                            renderLeftIcon={() => {
                                return (
                                    <Bs.PersonCircle size="20" fill={colors.primary} style={{ marginRight: "4%" }} />
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
                                                <Text
                                                    style={{
                                                        color: "grey",
                                                        marginHorizontal: "4%",
                                                        fontWeight: "bold",
                                                        fontSize: 18,
                                                    }}
                                                >
                                                    {item}
                                                </Text>
                                                <View
                                                    style={{
                                                        height: 2,
                                                        width: "100%",
                                                        backgroundColor: colors.border,
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
                                                                <Text
                                                                    style={{
                                                                        color: colors.text,
                                                                        fontWeight: "bold",
                                                                        textAlign: "center",
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    {report.teamNumber}
                                                                </Text>
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
                <ScoutViewer
                    visible={scoutViewerVisible}
                    setVisible={setScoutViewerVisible}
                    data={currentReport ?? []}
                    chosenComp={currentReport?.competitionName ?? ""}
                    updateFormData={() => {}}
                    isOfflineForm={false}
                />
            )}
        </>
    );
}
