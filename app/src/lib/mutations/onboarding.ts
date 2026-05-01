import { Onboarding } from "@/lib/db/models/Onboarding";
import { Organization } from "@/lib/db/models/Organization";
import type { MutationOptions } from "@tanstack/query-core";

export interface RegisterUserWithOrganizationParams {
    teamNumber: number;
}

export interface SetTeamEmailParams {
    orgId: number;
    email: string;
}

export interface SetScouterAndAdminParams {
    userId: string;
}

export const onboardingMutations = {
    registerUserWithOrganization: {
        mutationKey: ["registerUserWithOrganization"],
        mutationFn: ({ teamNumber }: RegisterUserWithOrganizationParams) =>
            Onboarding.registerUserWithOrganization(teamNumber),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return Promise.all([
                client.invalidateQueries({ queryKey: ["competitions"] }),
                client.invalidateQueries({ queryKey: ["users"] }),
            ]);
        },
    },
    setTeamEmail: {
        mutationKey: ["setTeamEmail"],
        mutationFn: ({ orgId, email }: SetTeamEmailParams) =>
            Organization.updateEmail(orgId, email),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["organizations"] });
        },
    },
    setScouterAndAdmin: {
        mutationKey: ["setScouterAndAdmin"],
        mutationFn: ({ userId }: SetScouterAndAdminParams) =>
            Onboarding.setScouterAndAdmin(userId),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["users"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
