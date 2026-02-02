import { supabase } from "../supabase";

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
    id: string;
    org_id: number;
    status: AccountStatus;
    role: AccountRole;
}

export namespace Accounts {
    export async function login(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error !== null) throw error;
    }

    export async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error !== null) throw error;
    }

    export async function update(): Promise<Account | null> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user === null) return null;

        {
            const { error, data: uattr } = await supabase
                .from("user_attributes")
                .select("org_id:organization_id, scouter, admin")
                .eq("id", user.id)
                .single();
            if (error) throw error;

            return {
                ...uattr,
                id: user.id,
                role: uattr.admin
                    ? AccountRole.Admin
                    : uattr.scouter
                      ? AccountRole.Scouter
                      : AccountRole.Rejected,
                status: user.user_metadata.requested_deletion
                    ? AccountStatus.Deleted
                    : !uattr.org_id // FIXME: if the organization id is 0, then this will become false
                      ? AccountStatus.Onboarding
                      : !uattr.scouter
                        ? AccountStatus.Approval
                        : AccountStatus.Approved,
            };
        }
    }
}
