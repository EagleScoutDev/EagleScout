import { create } from "zustand/react";
import { combine, persist, subscribeWithSelector } from "zustand/middleware";
import { Account } from "@/lib/db/account";
import { supabase } from "../supabase";
import { storage } from "./persist";

export interface UserStoreState {
    account: Account | null;
}
export interface UserStoreActions {
    signInWithPassword(creds: { email: string; password: string }): Promise<void>;
    signOut(): Promise<void>;

    sync(): Promise<void>;
}
// FIXME: (12/20/2025) zustand's auto-generated selectors confuse react-compiler.
//        see https://github.com/pmndrs/zustand/discussions/2562 for more info
export const useUserStore = create(
    persist(
        subscribeWithSelector(
            combine<UserStoreState, UserStoreActions>(
                {
                    account: null,
                },
                (set) => ({
                    signInWithPassword: Account.signInWithPassword,
                    signOut: Account.signOut,

                    async sync() {
                        const account = await Account.fetch();
                        set({
                            account,
                        });
                    },
                }),
            ),
        ),
        {
            name: "user",
            storage,
            version: 0,
            migrate(old, version) {
                switch (version) {
                    default: {
                        console.warn(
                            `Unrecognized user store version ${version}; clearing storage!`,
                        );
                        return {};
                    }
                }
            },
        },
    ),
);

supabase.auth.onAuthStateChange(() => void useUserStore.getState().sync());