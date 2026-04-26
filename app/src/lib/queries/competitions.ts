import { type CompetitionReturnData, Competitions } from "@/lib/db/models/Competition";
import { createQueryKeys } from "@/lib/util/defs";

export const competitions = createQueryKeys(["competitions"], {
    all: {
        queryKey: [],
        async queryFn() {
            return (await Competitions.getAll()).sort(
                (a, b) => b.startTime.valueOf() - a.startTime.valueOf(),
            );
        },
    },
    // TODO: every competition is already cached in the all key?
    forId: ({ id }: { id: number }) => ({
        queryKey: [{ id }],
        queryFn: Competitions.get.bind(null, id),
    }),
    current: {
        queryKey: [],
        queryFn: Competitions.getCurrent,
        staleTime: (query) => {
            const comp = query.state.data;
            if (!comp?.endTime) return 0;
            return Math.max(0, comp.endTime.getTime() - Date.now());
        },
        gcTime: 7 * 24 * 60 * 60 * 1000,
    },
    teams: ({ id }: { id: number }) => ({
        queryKey: [{ id }, "teams"],
        queryFn: Competitions.getTeams.bind(null, id),
    }),
    tbaKey: ({ id }: { id: number }) => ({
        queryKey: [{ id }, "tbaKey"],
        queryFn: Competitions.getTBAKey.bind(null, id),
    }),
} as const);
