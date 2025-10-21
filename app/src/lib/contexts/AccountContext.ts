import { createContext, type Dispatch, type SetStateAction } from "react";
import { type Account } from "../user/account";
import type { Setter } from "../util/react/types";

export const AccountContext = createContext<{
    account: Account | null;
    setAccount: Setter<Account | null>;
}>({
    account: null,
    setAccount: () => {},
});
