import { Competitions } from "@/lib/db/models/Competition";
import { TBA } from "@/lib/db/tba";
import { createQueryKeys } from "@/lib/util/defs";

export const tba = createQueryKeys(["tba"], {
    teamsAtCompetition: ({ id }: { id: number }) => ({
        queryKey: [{ id }],
        async queryFn() {
            const tbaKey = await Competitions.getTBAKey(id);
            const teams = await TBA.getTeamsAtCompetition(tbaKey);
            return teams.sort((a, b) => a.team_number - b.team_number);
        },
    }),
});
