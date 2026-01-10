import { createJSONStorage } from "zustand/middleware";
import AsyncStorage from "expo-sqlite/kv-store";

export const storage = createJSONStorage(() => AsyncStorage);
