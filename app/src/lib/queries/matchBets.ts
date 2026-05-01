import { Betting } from "@/lib/db/models/Betting";
import { createQueryKeys } from "@/lib/util/defs";

export const matchBets = createQueryKeys(["matchBets"], {
    all: {
        queryKey: [],
        queryFn: Betting.getMatchBets,
    },
    forMatch: ({ matchNumber }: { matchNumber: number }) => ({
        queryKey: [{ matchNumber }],
        queryFn: Betting.getMatchBetsForMatch.bind(null, matchNumber),
    }),
    isMatchOver: ({ matchNumber }: { matchNumber: number }) => ({
        queryKey: [{ matchNumber }, "isOver"],
        queryFn: Betting.isMatchOver.bind(null, matchNumber),
    }),
} as const);
