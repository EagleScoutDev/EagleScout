import type { MutationOptions } from "@tanstack/query-core";
import { Account } from "@/lib/db/account";

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
        mutationFn: ({ password }: UpdatePasswordParams) => Account.updatePassword(password),
    },
    signIn: {
        mutationKey: ["signIn"],
        mutationFn: (creds: SignInParams) => Account.signInWithPassword(creds),
    },
    signUp: {
        mutationKey: ["signUp"],
        mutationFn: ({ email, password, emailRedirectTo }: SignUpParams) =>
            Account.signUp(email, password, emailRedirectTo),
    },
    signOut: {
        mutationKey: ["logout"],
        mutationFn: Account.signOut,
    },
    resetPassword: {
        mutationKey: ["resetPassword"],
        mutationFn: ({ email }: ResetPasswordParams) => Account.resetPasswordForEmail(email),
    },
} as const satisfies Record<string, MutationOptions<any, any, any, any>>;
