import type { Account } from "./account";

import type { Profile } from "./profile";

export interface User {
    account: Account;
    profile: Profile;
}
