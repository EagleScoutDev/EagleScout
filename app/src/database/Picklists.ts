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
            'mJ3UfsR5M1wWACNoathXjF9U3FJZgSCArPNzHmdiB0olLTYItAUbvGiVB6L1XSjq',
        },
      },
    );
    return await response.json();
  }
}

export default PicklistsDB;
