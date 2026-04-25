import { ScoutPitReports } from "@/lib/db/models/ScoutPitReport";
import { createQueryKeys } from "@/lib/util/defs";

export const pitReports = createQueryKeys(["pitReports"], {
    forTeamAtComp: ({ teamNumber, compId }: { teamNumber: number; compId: number }) => ({
        queryKey: [{ teamNumber, compId }],
        queryFn: ScoutPitReports.getAllForTeam.bind(null, teamNumber, compId),
    }),
    forComp: ({ compId }: { compId: number }) => ({
        queryKey: [{ compId }],
        queryFn: ScoutPitReports.getAllForComp.bind(null, compId),
    }),
    imagesForReport: ({ teamNumber, reportId }: { teamNumber: number; reportId: number }) => ({
        queryKey: [{ teamNumber, reportId }, "images"],
        queryFn: ScoutPitReports.getImages.bind(null, teamNumber, reportId),
    }),
});
