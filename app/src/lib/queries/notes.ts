import { ScoutNotes } from "@/lib/db/models/ScoutNote";
import { createQueryKeys } from "@/lib/util/defs";

export const notes = createQueryKeys(["notes"], {
    forTeamAtComp: ({ teamNumber, compId }: { teamNumber: number; compId: number }) => ({
        queryKey: [{ teamNumber, competitionId: compId }],
        queryFn: ScoutNotes.getAllForTeam.bind(null, teamNumber, compId),
    }),
    forSelf: ({ competitionId }: { competitionId: number }) => ({
        queryKey: [{ competitionId }, "self"],
        queryFn: ScoutNotes.getAllForSelf.bind(null, competitionId),
    }),
});
