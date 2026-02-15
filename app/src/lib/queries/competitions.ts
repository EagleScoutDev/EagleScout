import { CompetitionsDB } from "@/lib/database/Competitions";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const competitions = createQueryKeys("competitions", {
    all: {
        queryKey: null,
        queryFn: async () =>
            (await CompetitionsDB.getCompetitions())
                .sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf()),
    },
})
