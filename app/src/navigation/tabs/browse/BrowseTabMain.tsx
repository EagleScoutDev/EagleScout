import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { type MatchReportReturnData } from "@/lib/database/ScoutMatchReports";
import type { BrowseTabScreenProps } from "./index";
import { useTheme } from "@/ui/context/ThemeContext";
import * as Bs from "@/ui/icons";
import { UIText } from "@/ui/components/UIText";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Alliance } from "@/frc/common/common";
import { UIGridLayout } from "@/ui/components/UIGridLayout";
import { useRootNavigation } from "@/navigation";
import { MatchReportModal } from "@/navigation/(modals)/MatchReportModal";
import { queries } from "@/lib/queries";
import { Header } from "./components/Header";
import { UIChip } from "@/ui/components/UIChip";

export interface BrowseTabMainProps extends BrowseTabScreenProps<"Main"> {}
export function BrowseTabMain({ navigation }: BrowseTabMainProps) {
    const [query, setQuery] = useState<string | null>(null);
    const [filterState, setFilterState] = useState<"team" | "match">("match");
    const [activeComp, setActiveComp] = useState<number | null>(null);

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <Header
                    query={query}
                    setQuery={setQuery}
                    activeComp={activeComp}
                    setActiveComp={setActiveComp}
                    placeholder={
                        {
                            team: 'Try "114" or "Eaglestrike"',
                            match: 'Try "10"',
                        }[filterState]
                    }
                />
            ),
        });
    }, [activeComp, filterState, navigation, query]);

    return (
        <SafeAreaProvider>
            <View style={{ paddingTop: 8 }}>
                <UIChip.RadioRow
                    options={[
                        { key: "team", label: "Teams" },
                        { key: "match", label: "Matches" },
                        // { key: "profiles", label: "Profiles" },
                        // { key: "comp", label: "Competitions" },
                        // { key: "picklists", label: "Picklists" },
                    ]}
                    value={filterState}
                    onChange={setFilterState}
                />
            </View>
            {filterState === "team" && <TeamList query={query} competitionId={activeComp} />}
            {filterState === "match" && <MatchList query={query} competitionId={activeComp} />}
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
        ...queries.tba.teamsAtCompetition({ id: competitionId! }),
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

    const displayTeams = !!query
        ? teams.filter(
              ({ team_number, nickname }) =>
                  team_number.toString().includes(query) ||
                  nickname.toLowerCase().includes(query.toLowerCase()),
          )
        : teams;

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
                        gap: 8,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border.hex,
                    }}
                >
                    {/* TODO: replace with team avatar */}
                    <Bs.PeopleFill size={20} fill={colors.fg.hex} style={{ marginRight: 8 }} />
                    <UIText size={16} style={{ minWidth: 48 }} numberOfLines={1}>
                        {team.team_number}
                    </UIText>
                    <UIText
                        size={16}
                        style={{ flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode={"middle"}
                    >
                        {team.nickname}
                    </UIText>
                    <Bs.ChevronRight size={18} fill={colors.fg.hex} style={{ marginLeft: 8 }} />
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
        ...queries.matchReports.forComp({ id: competitionId! }),
        throwOnError: true,
        enabled: competitionId !== null,
        select: (reports) => {
            const matches = new Map<number, { id: number; reports: MatchReportReturnData[] }>();
            for (let report of reports) {
                if (matches.has(report.matchNumber)) {
                    matches.get(report.matchNumber)!.reports.push(report);
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

    // TODO: allow the user to search for teams within each match
    const displayMatches = !!query
        ? matches.filter(({ id }) => id.toString().includes(query))
        : matches;

    return (
        <>
            <FlatList
                data={displayMatches}
                keyExtractor={({ id }) => id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.fg.hex}
                    />
                }
                renderItem={({ item: { id, reports } }) => (
                    <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 8 }}>
                        <UIText size={18} bold style={{ marginBottom: 4 }}>
                            Match {id}
                        </UIText>
                        <UIGridLayout cols={3} gap={8}>
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
                )}
            />
            <MatchReportModal ref={matchReportModalRef} />
        </>
    );
}
