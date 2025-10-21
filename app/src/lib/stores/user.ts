import { create } from "zustand/react";
import { persist, combine } from "zustand/middleware";
import { type Account, Accounts } from "../user/account.ts";
import { supabase } from "../supabase.ts";
import { storage } from "./persist.ts";
import { createSelectors } from "../util/zustand/createSelectors.ts";

export interface UserStoreState {
    account: Account | null;
    // profile: Profile | null;
}
export interface UserStoreActions {
    login(email: string, password: string): Promise<void>;
    logout(): Promise<void>;
    update(): Promise<void>;
}
export const useUserStore = createSelectors(
    create(
        persist(
            combine<UserStoreState, UserStoreActions>(
                {
                    account: null,
                    // profile: null,
                },
                (set, get) => ({
                    login: Accounts.login,
                    logout: Accounts.logout,
                    async update() {
                        const account = await Accounts.update();
                        set({ account });
                    },
                })
            ),
            {
                name: "account",
                storage,
            }
        )
    )
);

supabase.auth.onAuthStateChange((e) => {
    void useUserStore.getState().update();
});
