import { useContext } from "react";
import { AccountContext } from "../contexts/AccountContext";
import { type Account, login, logout, recallAccount } from "../user/account";

export interface AccountHook {
    account: Account | null;

    recallAccount: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
export function useAccount(): AccountHook {
    const { account, setAccount } = useContext(AccountContext);

    return {
        account,

        recallAccount: () => recallAccount().then(setAccount),
        login: (email: string, password: string) => login(email, password).then(setAccount),
        logout: () => logout().then(() => setAccount(null)),
    };
}
