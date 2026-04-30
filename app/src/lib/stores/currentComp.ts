import { create } from "zustand/react";
import { combine, persist, subscribeWithSelector } from "zustand/middleware";
import { type CompetitionReturnData } from "@/lib/db/models/Competition";
import { storage } from "@/lib/stores/persist";
import { type TBAMatch, type TBATeam } from "@/lib/db/tba";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { useEffect, useState } from "react";

export type CurrentCompState = CompActiveState | CompInactiveState;
export interface CompActiveState {
    lastTried: Date;
    lastFetched: Date;

    active: true;
    comp: CompetitionReturnData;
    teams: Map<string, TBATeam>;
    matches: Map<string, TBAMatch>;
}
export interface CompInactiveState {
    lastTried: Date | null;
    lastFetched: Date | null;

    active: false;
    comp: null;
    teams: null;
    matches: null;
}
export interface CurrentCompActions {}
export type CurrentCompStore = ReturnType<typeof useCurrentCompStore.getState>;

export const useCurrentCompStore = create(
    persist(
        subscribeWithSelector(
            combine<CurrentCompState, CurrentCompActions>(
                {
                    lastTried: null,
                    lastFetched: null,

                    active: false,
                    comp: null,
                    teams: null,
                    matches: null,
                },
                (set, get) => ({}),
            ),
        ),
        {
            name: "competition",
            storage,
            version: 0,
            migrate(old, version) {
                switch (version) {
                    default: {
                        console.warn(
                            `Unrecognized competition store version ${version}; clearing storage!`,
                        );
                        return {};
                    }
                }
            },
        },
    ),
);

interface CompetitionQueryResult {
    comp: CompetitionReturnData | null;
    teams: Map<string, TBATeam> | null;
    matches: Map<string, TBAMatch> | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<any>;
    isStale: boolean;
    isFetching: boolean;
}

function useCompetitionQueries(): CompetitionQueryResult {
    const compQuery = useQuery(queries.competitions.current);
    const teamsQuery = useQuery({
        ...queries.tba.teamsAtCompetition({ id: compQuery.data?.id! }),
        enabled: !!compQuery.data,
        select: (t) => new Map(t.map((x) => [x.key, x])),
    });
    const matchesQuery = useQuery({
        ...queries.tbaMatches.forCompFr({ compKey: compQuery.data?.tbaKey! }),
        enabled: !!compQuery.data,
        select: (m) => new Map(m.map((x) => [x.key, x])),
    });

    const loading = compQuery.isPending || teamsQuery.isPending || matchesQuery.isPending;
    const error = compQuery.error ?? teamsQuery.error ?? matchesQuery.error;
    const isStale = compQuery.isStale || teamsQuery.isStale || matchesQuery.isStale;
    const isFetching = compQuery.isFetching || teamsQuery.isFetching || matchesQuery.isFetching;

    const refetch = () =>
        Promise.all([compQuery.refetch(), teamsQuery.refetch(), matchesQuery.refetch()]);

    return {
        comp: compQuery.data ?? null,
        teams: teamsQuery.data ?? null,
        matches: matchesQuery.data ?? null,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
    };
}

export type CurrentCompInfo = CurrentCompState & {
    online: boolean;

    loading: boolean;
    error: Error | null;
    refetch: () => Promise<any>;
    isStale: boolean;
    isFetching: boolean;
};

/**
 * Hook into the offline-persisted competition store. Only use within components intended to be offline-first!
 * @param stable If the competition state should be stable (after data is loaded, it will not change across remounts)
 */
export function useCurrentCompetition(stable: boolean): CurrentCompInfo {
    const [value, setValue] = useState<CurrentCompStore>(useCurrentCompStore.getState());
    const [online, setOnline] = useState<boolean>(false);
    const { comp, teams, matches, loading, error, refetch, isStale, isFetching } =
        useCompetitionQueries();

    useEffect(() => {
        const timestamp = new Date();

        if (error) {
            setOnline(false);
            useCurrentCompStore.setState({
                lastTried: timestamp,
            });
        } else if (comp && teams && matches) {
            setOnline(true);
            useCurrentCompStore.setState({
                lastTried: timestamp,
                lastFetched: timestamp,
                active: true,
                comp,
                teams,
                matches,
            });
        } else {
            console.log(comp, teams, matches);
        }
    }, [comp, error, teams, matches]);

    useEffect(() => {
        if (!stable) return useCurrentCompStore.subscribe(setValue);
    }, [stable]);

    return {
        ...value,
        online,
        loading,
        error,
        refetch,
        isStale,
        isFetching,
    } as CurrentCompInfo;
}
