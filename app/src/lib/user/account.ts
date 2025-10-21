import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";
import { FormHelper } from "../../FormHelper";

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

export enum AccountStatus {
    Onboarding = "onboarding",
    Approval = "await_approval",
    Approved = "valid",
    Deleted = "deleted",
}
export interface Account {
    org_id: number;
    status: AccountStatus;
    role: AccountRole;
}

export async function saveAccount(account: Account | null) {
    await AsyncStorage.setItem("account", JSON.stringify(account));
    if (account === null) {
        // TODO: refactor this out
        const keys = await AsyncStorage.getAllKeys();
        AsyncStorage.multiRemove(keys.filter((k) => !FormHelper.PERSIST_KEYS.includes(k)));
    }
}
export async function recallAccount(): Promise<Account | null> {
    const acc = await AsyncStorage.getItem("account");
    return acc === null ? null : JSON.parse(acc);
}

export async function login(email: string, password: string): Promise<Account> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user === null) throw new Error("Username or password is incorrect");

    const { data: uattrData, error: uattrError } = await supabase
        .from("user_attributes")
        .select("org_id:organization_id, scouter, admin")
        .eq("id", user.id)
        .single();
    if (uattrError) throw uattrError;

    const role = uattrData.admin ? AccountRole.Admin : uattrData.scouter ? AccountRole.Scouter : AccountRole.Rejected;
    const status = user.user_metadata.requested_deletion
        ? AccountStatus.Deleted
        : !uattrData.org_id
        ? AccountStatus.Onboarding
        : !uattrData.scouter
        ? AccountStatus.Approval
        : AccountStatus.Approved;

    return {
        ...uattrData,
        role,
        status,
    };
}

export async function logout(): Promise<void> {
    await supabase.auth.signOut();
}
