import type { SupportedStorage } from "@supabase/auth-js";
import { AsyncStorage } from "expo-sqlite/kv-store";

const VERSION = 1;
const VERSION_KEY = "sb-auth-version";
const PREFIX = "sb-auth:";

let ready: Promise<void> | null = null;
function ensure() {
    if (ready) return ready;
    ready = (async () => {
        const v = await AsyncStorage.getItemAsync(VERSION_KEY);
        if (v === String(VERSION)) return;
        const keys = await AsyncStorage.getAllKeysAsync();
        await Promise.all(
            keys
                .filter((k) => k.startsWith(PREFIX))
                .map((k) => AsyncStorage.removeItemAsync(k)),
        );
        await AsyncStorage.setItemAsync(VERSION_KEY, String(VERSION));
    })();
    return ready;
}

export const supabaseAuthStorage: SupportedStorage = {
    async getItem(k) {
        await ensure();
        return AsyncStorage.getItemAsync(PREFIX + k);
    },
    async setItem(k, v) {
        await ensure();
        await AsyncStorage.setItemAsync(PREFIX + k, v);
    },
    async removeItem(k) {
        await ensure();
        await AsyncStorage.removeItemAsync(PREFIX + k);
    },
};
