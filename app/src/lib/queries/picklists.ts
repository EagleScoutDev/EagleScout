import { Picklists } from "@/lib/db/models/Picklist";
import { createQueryKeys } from "@/lib/util/defs";

export const picklists = createQueryKeys(["picklists"], {
    forCompetition: ({ competitionId }: { competitionId: number }) => ({
        queryKey: [{ competitionId }],
        queryFn: Picklists.getAllForComp.bind(null, competitionId),
    }),
    forId: ({ picklistId }: { picklistId: number }) => ({
        queryKey: [{ picklistId }],
        queryFn: Picklists.get.bind(null, picklistId),
    }),
});
