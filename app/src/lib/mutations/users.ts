import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

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
        async mutationFn({ userId, approved }: UpdateApproveStatusParams) {
            const { error } = await supabase
                .from("user_attributes")
                .update({ scouter: approved })
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, { client }) {
            client.invalidateQueries({ queryKey: ["users"] });
        },
    },
    updateAdminStatus: {
        mutationKey: ["updateAdminStatus"],
        async mutationFn({ userId, isAdmin }: UpdateAdminStatusParams) {
            const { error } = await supabase
                .from("user_attributes")
                .update({ admin: isAdmin })
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, { client }) {
            client.invalidateQueries({ queryKey: ["users"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
