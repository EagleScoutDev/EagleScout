import {supabase} from '../lib/supabase';
import ProfilesDB from './Profiles';

export interface SimpleTeam {
  key: string;
  team_number: number;
  nickname: string;
  name: string;
  city: string;
  state_prov: string;
  country: string;
}

export interface PicklistStructure {
  id?: string;
  teams: number[];
  created_at: Date;
  name: string;
  created_by: string;
}

class PicklistsDB {
  static async getPicklists(): Promise<PicklistStructure[]> {
    const {data, error} = await supabase.from('picklist').select('*');
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async getTeamsAtCompetition(comp_id: string): Promise<SimpleTeam[]> {
    const response = await fetch(
      `https://www.thebluealliance.com/api/v3/event/${comp_id}/teams/simple`,
      {
        headers: {
          'X-TBA-Auth-Key':
            'fx9XTT4fik6zzzNIkkfYORUfGhwlRUUu57Qa0xhZce4uVqYJ1Ekk9holo4d1qFw6',
        },
      },
    );
    return await response.json();
  }

  static async getPicklist(picklist_id: string): Promise<PicklistStructure> {
    const {data, error} = await supabase
      .from('picklist')
      .select('*')
      .eq('id', picklist_id);
    if (error) {
      throw error;
    } else {
      return data[0];
    }
  }

  static async getUserId() {
    ProfilesDB.getCurrentUserProfile().then(profile => {
      console.log('Profile id:', profile.id);
      return profile.id;
    });
  }

  static async createPicklist(name: string, teams: number[]) {
    try {
      // Before creating a picklist, confirm that user_id is not null and exists in the user table
      // Your logic for checking if the user exists in your 'users' table can go here
      // For now, we proceed to insert assuming user_id is valid since we've got it from auth state

      const {data, error} = await supabase.from('picklist').insert([
        {
          teams: teams,
          created_at: new Date(),
          name: name,
        },
      ]);

      if (error) throw error;
      return data; // assuming 'data' contains the array of inserted rows
    } catch (error) {
      console.error('Error in picklist creation:', error);
      throw error;
    }
  }

  static async updatePicklist(id: number, new_teams: number[]) {
    console.log('updating picklist, id using is:', id);
    console.log('new teams list: ', new_teams);
    const {data, error} = await supabase
      .from('picklist')
      .update({teams: new_teams})
      .eq('id', id);
    if (error) {
      console.log('Picklist not updated, error');
      throw error;
    } else {
      console.log('Picklist updated successfully');
      return data;
    }
  }
}

export default PicklistsDB;