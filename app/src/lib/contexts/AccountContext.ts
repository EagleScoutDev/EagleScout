import { createContext } from "react";
import { type Account } from "../user/account";
import type { Setter } from "../util/react/types";

export const AccountContext = createContext<{
    account: Account | null;
    setAccount: Setter<Account | null>;
}>({
    account: null,
    setAccount: () => {},
});
