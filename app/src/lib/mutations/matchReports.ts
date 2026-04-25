import type { MutationOptions } from "@tanstack/query-core";
import type * as Rebuilt from "@/frc/rebuilt";
import { ScoutMatchReports } from "@/lib/db/models/ScoutMatchReport";

interface CreateReportParams {
    matchNumber: number;
    teamNumber: number;
    data: any[];
    competitionId: number;
    timelineData?: { time: number; label: string }[];
    autoPath?: Rebuilt.AutoPath;
}

interface EditReportParams {
    reportId: number;
    newData: [];
}

export const matchReportMutations = {
    create: {
        mutationKey: ["createMatchReport"],
        mutationFn: (params: CreateReportParams) =>
            ScoutMatchReports.create(
                params.matchNumber,
                params.teamNumber,
                params.data,
                params.competitionId,
                params.timelineData,
                params.autoPath,
            ),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchReports"] });
        },
    },
    edit: {
        mutationKey: ["editMatchReport"],
        mutationFn: ({ reportId, newData }: EditReportParams) =>
            ScoutMatchReports.edit(reportId, newData),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchReports"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
