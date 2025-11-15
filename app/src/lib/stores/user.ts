import { create } from "zustand/react";
import { combine, persist } from "zustand/middleware";
import { type Account, Accounts } from "../user/account";
import { supabase } from "../supabase";
import { storage } from "./persist";
import { createSelectors } from "../util/zustand/createSelectors";

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
                (set, _) => ({
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

supabase.auth.onAuthStateChange(() => void useUserStore.getState().update());
