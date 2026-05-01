import type { MutationOptions } from "@tanstack/query-core";
import { ScoutMatchReports } from "@/lib/db/models/ScoutMatchReport";
import { SyncStore } from "@/lib/stores/sync";

interface EditReportParams {
    reportId: number;
    newData: [];
}

export const matchReportMutations = {
    create: {
        mutationFn: SyncStore.createMatchReport,
    },
    edit: {
        mutationFn: ({ reportId, newData }: EditReportParams) =>
            ScoutMatchReports.edit(reportId, newData),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchReports"] });
        },
    },
    flush: {
        mutationKey: ["flushMatchReports"],
        mutationFn: SyncStore.flushMatchReports,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["matchReports"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
