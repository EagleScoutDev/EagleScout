import { ScoutNotes } from "@/lib/db/models/ScoutNote";
import type { MutationOptions } from "@tanstack/query-core";

interface CreateNoteParams {
    content: string;
    teamNumber: number;
    matchNumber: number;
    competitionId: number;
}

export const noteMutations = {
    create: {
        mutationKey: ["createNote"],
        mutationFn: ({
            content,
            teamNumber,
            matchNumber,
            competitionId,
        }: CreateNoteParams) =>
            ScoutNotes.create(content, teamNumber, matchNumber, competitionId),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["notes"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
