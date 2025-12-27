import { create } from "zustand/react";
import { combine, persist } from "zustand/middleware";
import { type Account, Accounts } from "../user/account";
import { supabase } from "../supabase";
import { storage } from "./persist";

export interface UserStoreState {
    account: Account | null;
    // profile: Profile | null;
}
export interface UserStoreActions {
    login(email: string, password: string): Promise<void>;
    logout(): Promise<void>;
    update(): Promise<void>;
}
// FIXME: (12/20/2025) zustand's auto-generated selectors confuse react-compiler.
//        see https://github.com/pmndrs/zustand/discussions/2562 for more info
export const useUserStore = create(
    persist(
        combine<UserStoreState, UserStoreActions>(
            {
                account: null,
                // profile: null,
            },
            (set, _) => ({
                login: Accounts.login,
                logout: Accounts.logout,
                async update() {
                    const account = await Accounts.update();
                    set({ account });
                },
            }),
        ),
        {
            name: "account",
            storage,
        },
    ),
);

supabase.auth.onAuthStateChange(() => void useUserStore.getState().update());
