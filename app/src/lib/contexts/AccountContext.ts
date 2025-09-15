import { createContext, type Dispatch, type SetStateAction } from 'react';
import { Account } from '../account';

export const AccountContext = createContext<{
    account: Account | null;
    setAccount: Dispatch<SetStateAction<Account | null>>;
}>({
    account: null,
    setAccount: () => { },
});
