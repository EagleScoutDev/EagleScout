import { Profiles } from "@/lib/db/models/Profile";
import type { MutationOptions } from "@tanstack/query-core";

export interface UpdateProfileEmojiParams {
    emoji: string;
}

export interface UpdateProfileParams {
    firstName: string;
    lastName: string;
}

export const profileMutations = {
    updateEmoji: {
        mutationKey: ["updateProfileEmoji"],
        mutationFn: ({ emoji }: UpdateProfileEmojiParams) =>
            Profiles.updateEmoji(emoji),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
    updateProfile: {
        mutationKey: ["updateProfile"],
        mutationFn: ({ firstName, lastName }: UpdateProfileParams) =>
            Profiles.updateProfile(firstName, lastName),
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
