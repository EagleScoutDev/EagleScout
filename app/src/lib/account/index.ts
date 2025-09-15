import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { supabase } from "../supabase";

export enum AccountType {
    User = "user",
    Admin = "admin",
}
export enum AccountStatus {
    Onboarding = 0,
    Approval = 1,
    Approved = 2,
    Deleted = 3,
}
export interface Account {
    org_id: number
    status: AccountStatus
    type: AccountType
    scouter: boolean
    first_name: string
    last_name: string
    emoji: string
}

export class Account {

}

export async function login(username: string, password: string): Promise<Account | null> {
    const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
    });
    if (error) throw error

    const { data: { user } } = await supabase.auth.getUser();
    if (user === null) return null

    const { data: uattrData, error: uattrError } = await supabase
        .from('user_attributes')
        .select('org_id:organization_id, scouter, admin')
        .eq('id', user.id)
        .single();
    if (uattrError) throw uattrError

    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('first_name, last_name, emoji')
        .eq('id', user.id)
        .single();
    if (profilesError) throw profilesError

    const type = uattrData.admin ? AccountType.Admin : AccountType.User
    const status = (
        user.user_metadata.requested_deletion
            ? AccountStatus.Deleted
            : (!uattrData.org_id)
                ? AccountStatus.Onboarding
                : (!uattrData.scouter)
                    ? AccountStatus.Approval
                    :
                    AccountStatus.Approved
    )

    return {
        ...uattrData,
        ...profilesData,
        type,
        status
    }
}

export async function saveAccount(acc: Account | null) {
    await AsyncStorage.setItem('user', JSON.stringify(acc));
    await AsyncStorage.setItem('authenticated', JSON.stringify(!!acc));
}
export async function recallAccount(): Promise<Account | null> {
    let acc = await AsyncStorage.getItem('user');
    return acc !== null ? JSON.parse(acc) : null
}
