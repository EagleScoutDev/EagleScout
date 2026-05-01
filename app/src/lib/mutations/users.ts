import { Users } from "@/lib/db/models/User";
import type { MutationOptions } from "@tanstack/query-core";

export interface UpdateApproveStatusParams {
    userId: string;
    approved: boolean;
}

export interface UpdateAdminStatusParams {
    userId: string;
    isAdmin: boolean;
}

export const userMutations = {
    updateApproveStatus: {
        mutationKey: ["updateApproveStatus"],
        mutationFn: ({ userId, approved }: UpdateApproveStatusParams) =>
            Users.updateApproveStatus(userId, approved),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["users"] });
        },
    },
    updateAdminStatus: {
        mutationKey: ["updateAdminStatus"],
        mutationFn: ({ userId, isAdmin }: UpdateAdminStatusParams) =>
            Users.updateAdminStatus(userId, isAdmin),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["users"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
