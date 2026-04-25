import { supabase } from "../supabase";
import { type User, Users } from "@/lib/db/models/User";
import { useUserStore } from "@/lib/stores/user";

export enum AccountRole {
    Scouter = "scouter",
    Admin = "admin",
    Rejected = "rejected",
}
export namespace AccountRole {
    export function getName(type: AccountRole): string {
        switch (type) {
            case AccountRole.Admin:
                return "Admin";
            case AccountRole.Scouter:
                return "Scouter";
            case AccountRole.Rejected:
                return "Rejected";
        }
    }
}

export interface Account extends User {
    deleted: boolean;
}

export namespace Account {
    export async function get(): Promise<Account | null> {
        return useUserStore.getState().account;
    }
    export async function ensure(): Promise<Account> {
        const account = await Account.get();
        if (account === null) throw new Error("Not logged in.");
        return account;
    }

    export async function updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    }

    export async function signInWithPassword(creds: { email: string; password: string }) {
        const { error } = await supabase.auth.signInWithPassword(creds);
        if (error) throw error;
    }

    export async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error !== null) throw error;
    }

    export async function fetch(): Promise<Account | null> {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user === null) return null;

        return {
            ...(await Users.get(user.id)),
            deleted: user.user_metadata.requested_deletion,
        };
    }

    export async function signUp(email: string, password: string, emailRedirectTo?: string) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: emailRedirectTo ? { emailRedirectTo } : (undefined as never),
        });
        if (error) throw error;
    }

    export async function resetPasswordForEmail(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "eaglescout://forgot-password",
        });
        if (error) throw error;
    }
}
