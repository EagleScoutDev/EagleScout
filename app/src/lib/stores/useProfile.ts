import { useEffect, useState } from 'react';
import { ProfilesDB } from "../../database/Profiles.ts";
import type { Profile } from "../user/profile.ts";

export const useProfile = () => {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        ProfilesDB.getCurrentUserProfile().then(p => setProfile(p));
    }, []);

    return { profile };
};
