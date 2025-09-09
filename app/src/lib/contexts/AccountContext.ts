import {createContext, Dispatch, SetStateAction} from 'react';
import {ThemeOptions} from '../../themes';
import { Account } from '../account';

export const AccountContext = createContext<{
  account: Account | null;
  setAccount: Dispatch<SetStateAction<Account | null>>;
}>({
  account: null,
  setAccount: () => {},
});
