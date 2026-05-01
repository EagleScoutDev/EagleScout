import {
    type PitReport,
    ScoutPitReports,
} from "@/lib/db/models/ScoutPitReport";
import type { MutationOptions } from "@tanstack/query-core";

interface CreatePitReportParams {
    report: PitReport;
    images: string[];
}

export const pitReportMutations = {
    create: {
        mutationKey: ["createPitReport"],
        mutationFn: ({ report, images }: CreatePitReportParams) =>
            ScoutPitReports.create(report, images),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["pitReports"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
