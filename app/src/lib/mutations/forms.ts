import { Forms } from "@/lib/db/models/Form";
import type { MutationOptions } from "@tanstack/query-core";

export const formMutations = {
    add: {
        mutationKey: ["addForm"],
        mutationFn: Forms.create,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["forms"] });
        },
    },
    delete: {
        mutationKey: ["deleteForm"],
        mutationFn: Forms.remove,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["forms"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
