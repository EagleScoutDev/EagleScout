import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    RefreshControl,
    TextInput,
    View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import type { BrowseTabScreenProps } from "./index";
import { useTheme } from "@/ui/context/ThemeContext";
import * as Bs from "@/ui/icons";
import { UIText } from "@/ui/components/UIText";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PressableOpacity } from "@/components/PressableOpacity";
import { useFocusEffect } from "@react-navigation/native";
import { UITabView } from "@/ui/components/UITabView";
import { useQuery } from "@tanstack/react-query";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { TBA } from "@/lib/frc/tba/TBA";
import { useCurrentCompetition } from "@/lib/hooks/useCurrentCompetition";
import { Alliance } from "@/frc/common/common.ts";
import { UIGridLayout } from "@/ui/components/UIGridLayout";
import type { SearchBarCommands } from "react-native-screens";
import { PlatformPressable } from "@react-navigation/elements";
import { UIListPicker } from "@/ui/components/UIListPicker.tsx";
import { KeyboardController } from "react-native-keyboard-controller";
import { useRootNavigation } from "@/navigation";
import { MatchReportModal } from "@/navigation/(modals)/MatchReportModal.tsx";

export interface BrowseTabMainProps extends BrowseTabScreenProps<"Main"> {}
export function BrowseTabMain({ navigation }: BrowseTabMainProps) {
    "use memo";
    const { colors } = useTheme();

    const { competition: currentCompetition } = useCurrentCompetition();
    const [activeComp, setActiveComp] = useState<number | null>(null);

    useEffect(() => {
        if (activeComp === null && currentCompetition !== null) {
            setActiveComp(currentCompetition.id);
        }
    }, [currentCompetition]);

    const { data: competitions, isLoading: competitionsLoading } = useQuery({
        queryKey: ["competitions"],
        queryFn: async () =>
            (await CompetitionsDB.getCompetitions()).sort(
                (a, b) => b.startTime.valueOf() - a.startTime.valueOf(),
            ),
        select: (comps) => new Map(comps.map((comp) => [comp.id, comp])),
        throwOnError: true,
    });

    const [filterState, setFilterState] = useState<"team" | "match">("match");

    const [query, setQuery] = useState<string | null>("");
    const searching = query !== null;
    const searchPlaceholder = {
        team: 'Try "114" or "Eaglestrike"',
        match: 'Try "10"',
    }[filterState];

    const iosSearchRef = useRef<SearchBarCommands>(null);
    const searchRef = useRef<TextInput>(null);

    function focusSearch() {
        if (Platform.OS === "ios") iosSearchRef.current?.focus();
        else searchRef.current?.focus();

        setQuery("");
    }

    useFocusEffect(() => {
        setQuery(null);
        // HACK: schedule this for after the ref is filled
        // if (Platform.OS === "ios") setTimeout(() => focusSearch(), 0);
    });

    const competitionSelector =
        competitionsLoading || competitions === undefined ? (
            <ActivityIndicator size="small" color={colors.fg.hex} />
        ) : (
            <UIListPicker
                title="Select Competition"
                options={Array.from(competitions.keys())}
                render={(id) => ({ name: competitions.get(id)?.name ?? "Unknown" })}
                value={activeComp}
                onChange={setActiveComp}
                Display={({ value: id, present }) => (
                    <PlatformPressable
                        style={{
                            flexShrink: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 8,
                            gap: 8,
                        }}
                        onPress={present}
                    >
                        <UIText size={16} ellipsizeMode={"middle"}>
                            {id === null
                                ? ""
                                : (competitions.get(id)?.name ?? "Unknown Competition")}
                        </UIText>
                        {Platform.OS !== "ios" && <View style={{ flex: 1 }} />}
                        <Bs.ChevronDown size={18} color={colors.fg.hex} />
                    </PlatformPressable>
                )}
            />
        );

    useEffect(() => {
        if (Platform.OS === "ios") {
            navigation.setOptions({
                headerLeft: () => competitionSelector,
                headerTitle: "",
                headerSearchBarOptions: {
                    ref: iosSearchRef,
                    // onCancelButtonPress: () => navigation.goBack(),
                    hideNavigationBar: false,
                    placeholder: searchPlaceholder,
                    onChangeText: (e) => setQuery(e.nativeEvent.text),
                    autoFocus: true,
                },
            });
        } else {
            navigation.setOptions({
                headerShown: false,
            });
        }
    }, [
        navigation,
        competitionsLoading,
        competitions,
        iosSearchRef,
        competitionSelector,
        searchPlaceholder,
    ]);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                edges={["top", "left", "right"]}
                style={{ backgroundColor: colors.bg2.hex }}
            >
                {Platform.OS == "android" && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            height: 56,
                            paddingHorizontal: 4,
                            backgroundColor: colors.bg2.hex,
                            borderBottomWidth: 1,
                            borderColor: colors.border.hex,
                        }}
                    >
                        {searching ? (
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                <View style={{ paddingLeft: 16, paddingRight: 8 }}>
                                    <Bs.Search size={20} fill={colors.placeholder.hex} />
                                </View>

                                <TextInput
                                    ref={searchRef}
                                    style={{ color: colors.fg.hex, fontSize: 16, flex: 1 }}
                                    onChangeText={setQuery}
                                    value={query ?? ""}
                                    placeholderTextColor={colors.placeholder.hex}
                                    placeholder={searchPlaceholder}
                                    onEndEditing={(e) => {
                                        if (e.nativeEvent.text === "") setQuery(null);
                                    }}
                                />
                            </View>
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingLeft: 8,
                                }}
                            >
                                {competitionSelector}
                            </View>
                        )}

                        <PressableOpacity
                            style={{ padding: 16 }}
                            onPress={() => {
                                if (searching) {
                                    setQuery(null);
                                    KeyboardController.dismiss();
                                } else {
                                    setQuery("");
                                    searchRef.current?.focus();
                                }
                            }}
                        >
                            {searching ? (
                                <Bs.XLg size={24} color={colors.fg.hex} />
                            ) : (
                                <Bs.Search size={24} fill={colors.fg.hex} />
                            )}
                        </PressableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* FIXME: removing this wrapper View bricks activityindicators???  */}
            <View style={{ height: "100%" }}>
                <UITabView
                    keyboardDismissMode={"none"}
                    currentKey={filterState}
                    onTabChange={setFilterState}
                    tabs={[
                        {
                            key: "team",
                            title: "Team",
                            component: () => <TeamList query={query} competitionId={activeComp} />,
                        },
                        {
                            key: "match",
                            title: "Match",
                            component: () => <MatchList query={query} competitionId={activeComp} />,
                        },
                    ]}
                />
            </View>
        </SafeAreaProvider>
    );
}

interface TeamListProps {
    query: string | null;
    competitionId: number | null;
}
function TeamList({ query, competitionId }: TeamListProps) {
    const rootNavigation = useRootNavigation();
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: teams,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["tba", "teamsAtCompetition", { competitionId }],
        queryFn: async () =>
            (
                await TBA.getTeamsAtCompetition(
                    await CompetitionsDB.getCompetitionTBAKey(competitionId!),
                )
            ).sort((a, b) => a.team_number - b.team_number),
        throwOnError: true,
        enabled: competitionId !== null,
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (competitionId === null || isLoading || teams === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.fg.hex} />
            </View>
        );
    }

    const displayTeams =
        query === null
            ? teams
            : teams.filter(
                  ({ team_number, nickname }) =>
                      team_number.toString().includes(query) ||
                      nickname.toLowerCase().includes(query.toLowerCase()),
              );

    return (
        <FlatList
            data={displayTeams}
            keyExtractor={(team) => team.team_number.toString()}
            contentInsetAdjustmentBehavior={"automatic"}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.fg.hex}
                />
            }
            renderItem={({ item: team }) => (
                <Pressable
                    onPress={() => {
                        rootNavigation.push("TeamSummary", {
                            teamId: team.team_number,
                            competitionId,
                        });
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: 48,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border.hex,
                    }}
                >
                    <UIText size={16} style={{ flex: 1 }}>
                        {team.team_number}
                    </UIText>
                    <UIText size={16} style={{ flex: 5 }}>
                        {team.nickname}
                    </UIText>
                    <Bs.ChevronRight size={18} fill={colors.fg.hex} style={{ flex: 1 }} />
                </Pressable>
            )}
        />
    );
}

interface MatchListProps {
    query: string | null;
    competitionId: number | null;
}
function MatchList({ query, competitionId }: MatchListProps) {
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const matchReportModalRef = useRef<MatchReportModal>(null);

    const {
        data: matches,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["matchReports", { competitionId }],
        queryFn: () => MatchReportsDB.getReportsForCompetition(competitionId!),
        throwOnError: true,
        enabled: competitionId !== null,
        select: (reports) => {
            const matches = new Map<number, { id: number; reports: MatchReportReturnData[] }>();
            for (let report of reports) {
                if (matches.has(report.matchNumber)) {
                    matches.get(report.matchNumber)?.reports.push(report);
                } else {
                    matches.set(report.matchNumber, { id: report.matchNumber, reports: [report] });
                }
            }
            return Array.from(matches.values());
        },
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (competitionId === null || isLoading || matches === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.fg.hex} />
            </View>
        );
    }

    const displayMatches =
        query === null ? matches : matches.filter(({ id }) => id.toString().includes(query));

    return (
        <>
            <FlatList
                contentContainerStyle={{
                    padding: 16,
                }}
                data={displayMatches}
                keyExtractor={(matchId) => matchId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.fg.hex}
                    />
                }
                renderItem={({ item: { id, reports } }) => {
                    return (
                        <View style={{ marginBottom: 16, maxWidth: 400 }}>
                            <UIText
                                style={{
                                    color: colors.fg.hex,
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    marginBottom: 8,
                                }}
                            >
                                Match {id}
                            </UIText>
                            <UIGridLayout columns={3} gap={8}>
                                {reports.map((report, i) => (
                                    <Pressable
                                        key={i}
                                        onPress={() => {
                                            matchReportModalRef.current?.present({
                                                isOfflineForm: false,
                                                report,
                                            });
                                        }}
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: Alliance.getColor(
                                                i < 3 ? Alliance.red : Alliance.blue,
                                            ).hex, // TODO: store alliance color in each match report instead of guessing by index
                                            padding: 16,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <UIText bold style={{ textAlign: "center" }}>
                                            {report.teamNumber}
                                        </UIText>
                                    </Pressable>
                                ))}
                            </UIGridLayout>
                        </View>
                    );
                }}
            />
            <MatchReportModal ref={matchReportModalRef} />
        </>
    );
}
