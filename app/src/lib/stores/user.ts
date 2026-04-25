import { create } from "zustand/react";
import { combine, persist, subscribeWithSelector } from "zustand/middleware";
import { Account } from "@/lib/db/account";
import { supabase } from "../supabase";
import { storage } from "./persist";
import { type CompetitionReturnData, Competitions } from "@/lib/db/models/Competition";
import { useQuery } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "expo-sqlite/kv-store";

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
                        if (account === null) {
                            set({
                                account: null,
                            });
                            return;
                        }
                    },
                }),
            ),
        ),
        {
            name: "sync",
            storage,
        },
    ),
);

supabase.auth.onAuthStateChange(() => void useUserStore.getState().sync());
