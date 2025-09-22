import type { Account } from "./account.ts";

import type { Profile } from "./profile.ts";

export interface User {
    account: Account;
    profile: Profile;
}
