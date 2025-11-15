import type { Profile } from "./profile";
import type { Account } from "./account";

export interface User {
    account: Account;
    profile: Profile;
}
