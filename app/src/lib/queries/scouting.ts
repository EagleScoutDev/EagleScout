import { type MatchReportReturnData, ScoutMatchReports } from "@/lib/db/models/ScoutMatchReport";
import { createQueryKeys } from "@/lib/util/defs";

export const matchReports = createQueryKeys(["matchReports"], {
    forComp: ({ id }: { id: number }) => ({
        queryKey: [{ competitionId: id }],
        queryFn: ScoutMatchReports.getAllForComp.bind(null, id),
    }),
    forSelf: ({ compId }: { compId: number }) => ({
        queryKey: [{ compId }, "self"],
        queryFn: ScoutMatchReports.getAllForSelf.bind(null, compId),
    }),
    forTeamAtComp: ({ teamNumber, compId }: { teamNumber: number; compId: number }) => ({
        queryKey: [{ team: teamNumber, compId }],
        queryFn: (): Promise<MatchReportReturnData[]> =>
            ScoutMatchReports.getAllForTeam(teamNumber, compId),
    }),
    forTeamsAtComp: ({ teamNumbers, compId }: { teamNumbers: number[]; compId: number }) => ({
        queryKey: [{ teams: teamNumbers, compId }],
        queryFn: ScoutMatchReports.getAllForTeams.bind(null, teamNumbers, compId),
    }),
    history: ({ reportId }: { reportId: number }) => ({
        queryKey: [{ reportId }, "history"],
        queryFn: ScoutMatchReports.getHistory.bind(null, reportId),
    }),
});
