import { supabase } from "@/lib/supabase";
import { AccountRole } from "@/lib/user/account";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    admin: boolean;
    scouter: boolean;
}

export interface UserProfileWithName extends UserProfile {
    name: string;
    account: {
        role: AccountRole;
    };
}

export const users = createQueryKeys("users", {
    all: {
        queryKey: null,
        async queryFn() {
            const { data: users = [], error } = await supabase.rpc("get_user_profiles_with_email");

            if (error) throw error;

            return (users as UserProfile[])
                .map<UserProfileWithName>((user: UserProfile) => ({
                    ...user,
                    name:
                        (user.first_name || "UNKNOWN_FIRSTNAME") +
                        " " +
                        (user.last_name || "UNKNOWN_LASTNAME"),
                    account: {
                        role: user.admin
                            ? AccountRole.Admin
                            : user.scouter
                              ? AccountRole.Scouter
                              : AccountRole.Rejected,
                    },
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
    },
});
