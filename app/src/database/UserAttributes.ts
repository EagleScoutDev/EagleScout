import {supabase} from '../lib/supabase';

interface UserAttributeReturnData {
  id: string;
  team_id: number;
  scouter: boolean;
  admin: boolean;
}

interface UserAttributeWithProfile extends UserAttributeReturnData {
  firstName: string;
  lastName: string;
  name: string;
}

class UserAttributesDB {
  static async getUserAttribute(id: string): Promise<UserAttributeReturnData> {
    const {data, error} = await supabase
      .from('user_attributes')
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
          team_id: data[0].team_id,
          scouter: data[0].scouter,
          admin: data[0].admin,
        };
      }
    }
  }

  static async getCurrentUserAttribute(): Promise<UserAttributeReturnData> {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (user == null) {
      throw new Error('User not logged in');
    }
    return this.getUserAttribute(user.id);
  }

  static async setUserAttributes(
    userId: number,
    scouter: boolean,
    admin: boolean,
  ): Promise<void> {
    const {data, error} = await supabase
      .from('user_attributes')
      .update({
        scouter: scouter,
        admin: admin,
      })
      .eq('id', userId);
    if (error) {
      throw error;
    }
  }

  static async getAllTeamUsers(): Promise<UserAttributeWithProfile[]> {
    const res: UserAttributeWithProfile[] = [];
    const {data, error} = await supabase.from('user_attributes').select('*');
    const {data: data2, error: error2} = await supabase
      .from('profiles')
      .select('*');
    if (error) {
      throw error;
    } else if (error2) {
      throw error2;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        let profile;
        for (let j = 0; j < data2.length; j += 1) {
          if (data[i].id === data2[j].id) {
            profile = data2[j];
          }
        }
        if (profile === undefined) {
          throw new Error('Profile not found for user with id ' + data[i].id);
        }
        res.push({
          id: data[i].id,
          team_id: data[i].team_id,
          scouter: data[i].scouter,
          admin: data[i].admin,
          firstName: profile.first_name,
          lastName: profile.last_name,
          name: profile.name,
        });
      }
    }
    return res;
  }
}

export default UserAttributesDB;
