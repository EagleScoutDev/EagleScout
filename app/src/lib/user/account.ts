import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase.ts";
import { useContext } from "react";
import { AccountContext } from "./contexts/AccountContext.ts";
import { FormHelper } from "../FormHelper.ts";

export enum AccountType {
    User = "user",
    Admin = "admin",
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
    type: AccountType;
    scouter: boolean;
}

export interface AccountHook {
    account: Account | null;

    recallAccount: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
export function useAccount(): AccountHook {
    const { account, setAccount } = useContext(AccountContext);

    return {
        account,

        recallAccount: () => recallAccount().then(setAccount),
        login: (email: string, password: string) => login(email, password).then(setAccount),
        logout: () => logout().then(() => setAccount(null)),
    };
}

export async function saveAccount(account: Account | null) {
    await AsyncStorage.setItem("account", JSON.stringify(account));
    if (account === null) {
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

    const type = uattrData.admin ? AccountType.Admin : AccountType.User;
    const status = user.user_metadata.requested_deletion
        ? AccountStatus.Deleted
        : !uattrData.org_id
        ? AccountStatus.Onboarding
        : !uattrData.scouter
        ? AccountStatus.Approval
        : AccountStatus.Approved;

    return {
        ...uattrData,
        type,
        status,
    };
}

export async function logout(): Promise<void> {
    await supabase.auth.signOut();
}
