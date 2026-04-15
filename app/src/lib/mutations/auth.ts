import { supabase } from "@/lib/supabase";
import type { MutationOptions } from "@tanstack/react-query";

export interface UpdatePasswordParams {
    password: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

export interface SignUpParams {
    email: string;
    password: string;
    emailRedirectTo?: string;
}

export interface ResetPasswordParams {
    email: string;
}

export const authMutations = {
    updatePassword: {
        mutationKey: ["updatePassword"],
        async mutationFn({ password }: UpdatePasswordParams) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
        },
    },
    signIn: {
        mutationKey: ["signIn"],
        async mutationFn({ email, password }: SignInParams) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        },
    },
    signUp: {
        mutationKey: ["signUp"],
        async mutationFn({ email, password, emailRedirectTo }: SignUpParams) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: emailRedirectTo ? { emailRedirectTo } : (undefined as never),
            });
            if (error) throw error;
        },
    },
    signOut: {
        mutationKey: ["signOut"],
        async mutationFn() {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
    },
    resetPassword: {
        mutationKey: ["resetPassword"],
        async mutationFn({ email }: ResetPasswordParams) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "eaglescout://forgot-password",
            });
            if (error) throw error;
        },
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
