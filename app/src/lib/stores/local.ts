import { create } from "zustand/react";
import { combine, persist } from "zustand/middleware";
import { storage } from "./persist";
import { createSelectors } from "../util/zustand/createSelectors";
import { ThemeOption } from "../../theme";

export interface LocalStoreState {
    theme: ThemeOption;
}
export interface LocalStoreActions {
    setTheme: (theme: ThemeOption) => void;
}
export const useLocalStore = createSelectors(
    create(
        persist(
            combine<LocalStoreState, LocalStoreActions>(
                {
                    theme: ThemeOption.system,
                },
                (set, _) => ({
                    setTheme: (theme: ThemeOption) => set({ theme }),
                })
            ),
            {
                name: "local",
                storage,
            }
        )
    )
);
