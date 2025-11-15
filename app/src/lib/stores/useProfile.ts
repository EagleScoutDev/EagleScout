import { useEffect, useState } from "react";
import { ProfilesDB } from "../../database/Profiles";
import type { Profile } from "../user/profile";

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        ProfilesDB.getCurrentUserProfile().then((p) => setProfile(p));
    }, []);

    return { profile };
}
