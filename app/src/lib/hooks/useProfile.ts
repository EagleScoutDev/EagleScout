import {useEffect, useState} from 'react';
import ProfilesDB, {ProfilesReturnData} from '../../database/Profiles';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfilesReturnData | null>(null);

  useEffect(() => {
    ProfilesDB.getCurrentUserProfile().then(p => setProfile(p));
  }, []);

  return {profile};
};
