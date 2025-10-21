import type { Profile } from "./profile";
import type { Account } from "./account.ts";

export interface User {
    account: Account;
    profile: Profile;
}
