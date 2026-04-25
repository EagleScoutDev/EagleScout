import { supabase } from "@/lib/supabase";
import { AccountRole } from "@/lib/db/account";
import { createQueryKeys } from "@/lib/util/defs";

export interface AdminUser {
    id: string;
    email: string;
    admin: boolean;
    scouter: boolean;
    profile: {
        name: string;
    };
    account: {
        role: AccountRole;
    };
}

export const users = createQueryKeys(["users"], {
    all: {
        queryKey: [],
        async queryFn(): Promise<AdminUser[]> {
            const { data: users = [], error } = await supabase.rpc("get_user_profiles_with_email");

            if (error) throw error;

            return users
                .map(
                    (user): AdminUser => ({
                        id: user.id,
                        email: user.email,
                        admin: user.admin,
                        scouter: user.scouter,
                        profile: {
                            name:
                                (user.first_name || "UNKNOWN_FIRSTNAME") +
                                " " +
                                (user.last_name || "UNKNOWN_LASTNAME"),
                        },
                        account: {
                            role: user.admin
                                ? AccountRole.Admin
                                : user.scouter
                                  ? AccountRole.Scouter
                                  : AccountRole.Rejected,
                        },
                    }),
                )
                .sort((a, b) => a.profile.name.localeCompare(b.profile.name));
        },
    },
} as const);
