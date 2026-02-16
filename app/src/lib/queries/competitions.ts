import { CompetitionsDB } from "@/lib/database/Competitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const competitions = createQueryKeys("competitions", {
    all: {
        queryKey: null,
        queryFn: async () =>
            (await CompetitionsDB.getCompetitions()).sort(
                (a, b) => b.startTime.valueOf() - a.startTime.valueOf(),
            ),
    },
    // TODO: every competition is already cached in the all key?
    forId: ({ id }: { id: number }) => ({
        queryKey: [{ id }],
        queryFn: async () => await CompetitionsDB.getCompetitionById(id),
    }),
    current: {
        queryKey: ["current"],
        queryFn: CompetitionsDB.getCurrentCompetition,
    }
});
