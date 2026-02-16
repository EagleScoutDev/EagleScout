import { createQueryKeys } from "@lukemorales/query-key-factory";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { TBA } from "@/lib/frc/tba/TBA";

export const tba = createQueryKeys("tba", {
    teamsAtCompetition: ({ id }: { id: number }) => ({
        queryKey: [{ id }],
        queryFn: async () =>
            (await TBA.getTeamsAtCompetition(await CompetitionsDB.getCompetitionTBAKey(id))).sort(
                (a, b) => a.team_number - b.team_number,
            ),
    }),
});
