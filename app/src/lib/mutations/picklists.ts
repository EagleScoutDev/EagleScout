import { Picklists, type PicklistTeam } from "@/lib/db/models/Picklist";
import type { MutationOptions } from "@tanstack/query-core";

interface CreatePicklistParams {
    name: string;
    teams: PicklistTeam[];
    competitionId: number;
}

interface UpdatePicklistParams {
    id: number;
    teams: PicklistTeam[];
}

export const picklistMutations = {
    create: {
        mutationKey: ["createPicklist"],
        mutationFn: ({ name, teams, competitionId }: CreatePicklistParams) =>
            Picklists.create(name, teams, competitionId),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["picklists"] });
        },
    },
    update: {
        mutationKey: ["updatePicklist"],
        mutationFn: ({ id, teams }: UpdatePicklistParams) =>
            Picklists.update(id, teams),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["picklists"] });
        },
    },
    delete: {
        mutationKey: ["deletePicklist"],
        mutationFn: (id: number) => Picklists.remove(id),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["picklists"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
