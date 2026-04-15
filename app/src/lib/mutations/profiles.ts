import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

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
        async mutationFn({ emoji }: UpdateProfileEmojiParams) {
            const { data } = await supabase.auth.getUser();
            const userId = data.user?.id;
            if (!userId) throw new Error("No user logged in");

            const { error } = await supabase
                .from("profiles")
                .update({ emoji })
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
    updateProfile: {
        mutationKey: ["updateProfile"],
        async mutationFn({ firstName, lastName }: UpdateProfileParams) {
            const { data } = await supabase.auth.getUser();
            const userId = data.user?.id;
            if (!userId) throw new Error("No user logged in");

            const { error } = await supabase
                .from("profiles")
                .update({ first_name: firstName, last_name: lastName })
                .eq("id", userId);

            if (error) throw error;
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            return client.invalidateQueries({ queryKey: ["profile"] });
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
