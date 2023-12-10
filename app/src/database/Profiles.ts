import {supabase} from '../lib/supabase';

export interface ProfilesReturnData {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
}

class ProfilesDB {
  static async getProfile(id: string): Promise<ProfilesReturnData> {
    const {data, error} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    } else {
      if (data.length === 0) {
        throw new Error('Profile not found');
      } else {
        return {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          name: data[0].name,
        };
      }
    }
  }

  static async getCurrentUserProfile(): Promise<ProfilesReturnData> {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (user == null) {
      throw new Error('User not logged in');
    }
    return this.getProfile(user.id);
  }

  static async setName(firstName: string, lastName: string): Promise<void> {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (user == null) {
      throw new Error('User not logged in');
    }
    const {data, error} = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', user.id);
    if (error) {
      throw error;
    }
  }
}

export default ProfilesDB;
