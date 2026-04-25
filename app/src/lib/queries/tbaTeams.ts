import { TBA } from "@/lib/db/tba";
import { createQueryKeys } from "@/lib/util/defs";

export const tbaTeams = createQueryKeys(["tbaTeams"], {
    search: ({ query }: { query: string }) => ({
        queryKey: [{ query }],
        queryFn: TBA.searchTeams.bind(null, query),
    }),
    forCompetition: ({ tbaKey }: { tbaKey: string }) => ({
        queryKey: [{ tbaKey }, "competition"],
        queryFn: TBA.getTeamsAtCompetition.bind(null, tbaKey),
    }),
});
