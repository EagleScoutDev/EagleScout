import {supabase} from '../lib/supabase';
import ProfilesDB from './Profiles';

export interface MatchBet {
  id: number;
  user_id: string;
  match_id: number;
  match_number?: number;
  alliance: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

export class MatchBets {
  static async checkIfMatchExists(
    match_number: number,
    competition_id: number,
  ): Promise<{
    exists: boolean;
    id: number;
  }> {
    const {data, error} = await supabase
      .from('matches')
      .select('id')
      .eq('number', match_number)
      .eq('competition_id', competition_id);

    if (!data || data?.length === 0) {
      return {
        exists: false,
        id: -1,
      };
    }
    if (error) {
      throw error;
    } else {
      return {
        exists: true,
        id: data[0].id,
      };
    }
  }

  static async createMatch(
    match_number: number,
    competition_id: number,
  ): Promise<number> {
    // console.log('createMatch match_number: ', match_number);
    // console.log('createMatch competition_id: ', competition_id);
    const {data, error} = await supabase
      .from('matches')
      .insert([
        {
          number: match_number,
          competition_id: competition_id,
        },
      ])
      .select('id');
    if (error) {
      throw error;
    } else {
      return data[0].id;
    }
  }

  static async createMatchBet(
    user_id: string,
    match_number: number,
    alliance: string,
    amount: number,
  ): Promise<number> {
    let {exists, id} = await this.checkIfMatchExists(match_number, 1);
    if (!exists) {
      id = await this.createMatch(match_number, 1);
    }
    const {data, error} = await supabase
      .from('match_bets')
      .insert([
        {
          user_id,
          match_id: id,
          alliance,
          amount,
        },
      ])
      .select('id');
    await supabase
      .from('profiles')
      .update({
        scoutcoins: (await ProfilesDB.getProfile(user_id)).scoutcoins - amount,
      })
      .eq('id', user_id);
    if (error) {
      throw error;
    } else {
      return data[0].id;
    }
  }

  static async updateMatchBet(
    user_id: string,
    match_number: number,
    amount: number,
  ): Promise<void> {
    const {exists, id} = await this.checkIfMatchExists(match_number, 1);
    if (!exists) {
      throw new Error('Match does not exist');
    }
    const {error} = await supabase
      .from('match_bets')
      .update({
        amount,
      })
      .eq('user_id', user_id)
      .eq('match_id', id);
    await supabase
      .from('profiles')
      .update({
        scoutcoins: (await ProfilesDB.getProfile(user_id)).scoutcoins - amount,
      })
      .eq('id', user_id);
    if (error) {
      throw error;
    }
  }

  static async getMatchBets(): Promise<MatchBet[]> {
    const {data, error} = await supabase
      .from('match_bets')
      .select('*, matches!inner(number)');
    if (error) {
      throw error;
    } else {
      return data.map((bet: any) => ({
        id: bet.id,
        user_id: bet.user_id,
        match_id: bet.match_id,
        match_number: bet.matches.number,
        alliance: bet.alliance,
        amount: bet.amount,
        created_at: bet.created_at,
        updated_at: bet.updated_at,
      }));
    }
  }
}
