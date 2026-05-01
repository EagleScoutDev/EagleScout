import ExpoStorage, { SQLiteStorage } from "expo-sqlite/kv-store";

const STORAGE_VERSION: number = 0;
const MIGRATIONS: Record<"_" | number, (storage: SQLiteStorage) => Promise<void>> = {
    _: async (storage: SQLiteStorage) => {
        await storage.setItemAsync("__version", "0");
    }
};

const singleton: Promise<SQLiteStorage> = (async () => {
    if (await ExpoStorage.getItemAsync("__migration_lock") !== null) {
        console.warn("[storage] detected in-progress migration; resetting storage");
        await ExpoStorage.clearAsync();
        await MIGRATIONS["_"](ExpoStorage);
        return ExpoStorage;
    }

    let storedVersion;
    while (true) {
        storedVersion = parseInt(await ExpoStorage.getItemAsync("__version") ?? "");
        console.log(`[storage] stored ${storedVersion}`);
        if (!Number.isSafeInteger(storedVersion)) {
            console.warn("[storage] invalid current version; resetting storage");
            await ExpoStorage.clearAsync();
            await MIGRATIONS["_"](ExpoStorage);
            return ExpoStorage;
        }
        else if (storedVersion > STORAGE_VERSION) {
            throw new Error(`The database version is newer than the current app version.`);
        }
        else if(storedVersion === STORAGE_VERSION) {
            return ExpoStorage;
        }

        console.log("[storage] running migration for version", storedVersion);
        await ExpoStorage.setItemAsync("__migration_lock", "true");
        await MIGRATIONS[storedVersion](ExpoStorage);
        await ExpoStorage.removeItemAsync("__migration_lock");
    }

    return ExpoStorage;
})();

export namespace AsyncStorage {
    export const getItemAsync = (key: string): Promise<string | null> => singleton.then(kv => kv.getItemAsync(key));
    export const setItemAsync = (key: string, value: string): Promise<void> => singleton.then(kv => kv.setItemAsync(key, value));
    export const removeItemAsync = (key: string): Promise<boolean | void> => singleton.then(kv => kv.removeItemAsync(key));
    export const getAllKeysAsync = (): Promise<string[]> => singleton.then(kv => kv.getAllKeysAsync());
    export const clearAsync = (): Promise<boolean | void> => singleton.then(kv => kv.clearAsync());

    export const getItem = getItemAsync;
    export const setItem = setItemAsync;
    export const removeItem = (key: string): Promise<void> => removeItemAsync(key).then(() => {
    });
    export const getAllKeys = getAllKeysAsync;
    export const clear = (): Promise<void> => clearAsync().then(() => {
    });
}
