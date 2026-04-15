import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

export interface RegisterUserWithOrganizationParams {
    teamNumber: number;
}

export const onboardingMutations = {
    registerUserWithOrganization: {
        mutationKey: ["registerUserWithOrganization"],
        async mutationFn({ teamNumber }: RegisterUserWithOrganizationParams) {
            const { data, error } = await supabase.rpc(
                "register_user_with_organization",
                {
                    team_number: teamNumber,
                },
            );

            if (error) throw error;
            return data;
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;