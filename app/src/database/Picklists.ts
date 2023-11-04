import {supabase} from '../lib/supabase';
import CompetitionsDB from './Competitions';

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
  teams: SimpleTeam[];
  created_at: Date;
  name: string;
}

class PicklistsDB {
  static async getPicklists(): Promise<any> {
    const {data, error} = await supabase.from('picklists').select('*');
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

  static async createPicklist(name: string, teams: number[]): Promise<any> {
    const {data, error} = await supabase
      .from('picklist')
      .insert([
        {
          teams: teams,
          created_at: new Date(),
          name: name,
          created_by: 0,
          last_modified: new Date(),
        },
      ])
      .select();
    if (error) {
      console.log('oops');
      console.log(error);
      console.log('all error data: ' + JSON.stringify(error));
      throw error;
    } else {
      return data;
    }
  }
}

export default PicklistsDB;
