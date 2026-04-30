import { TBA } from "@/lib/db/tba";
import { createQueryKeys } from "@/lib/util/defs";

export const tbaMatches = createQueryKeys(["tbaMatches"], {
    forComp: ({ id }: { id: number }) => ({
        queryKey: [{ compId: id }],
        queryFn: TBA.getAllMatchesForComp.bind(null, id),
    }),
    forCompFr: ({ compKey }: { compKey: string }) => ({
        queryKey: [{ compKey }],
        queryFn: TBA.getMatchesByComp.bind(null, compKey),
    }),
});
