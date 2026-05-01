import { Picklists } from "@/lib/db/models/Picklist";
import type { MutationOptions } from "@tanstack/query-core";

interface CreateTagParams {
    picklistId: number;
    name: string;
    color?: string;
}

interface UpdateTagColorParams {
    tagId: number;
    color: string;
}

export const tagMutations = {
    create: {
        mutationKey: ["createTag"],
        mutationFn: ({ picklistId, name, color }: CreateTagParams) =>
            Picklists.createTag(picklistId, name, color),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["tags"] });
        },
    },
    updateColor: {
        mutationKey: ["updateTagColor"],
        mutationFn: ({ tagId, color }: UpdateTagColorParams) =>
            Picklists.updateTagColor(tagId, color),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["tags"] });
        },
    },
    delete: {
        mutationKey: ["deleteTag"],
        mutationFn: (tagId: number) => Picklists.removeTag(tagId),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["tags"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
