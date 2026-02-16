import { createQueryKeys } from "@lukemorales/query-key-factory";
import { MatchReportsDB } from "@/lib/database/ScoutMatchReports";

export const matchReports = createQueryKeys("matchReports", {
    forComp: ({ id }: { id: number }) => ({
        queryKey: [{ competitionId: id }],
        queryFn: () => MatchReportsDB.getReportsForCompetition(id)
    })
})
