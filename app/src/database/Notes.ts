import {supabase} from '../lib/supabase';
import {CompetitionReturnData} from './Competitions';
import ProfilesDB from './Profiles';

export interface NoteStructure {
  id?: string;

  title: string;
  content: string;

  team_number: number;
  match_id: number; // foreign-key relation to matches table

  created_at: Date;
  created_by: string;
}

class NotesDB {
  /**
   * Checks if a match exists in the database. If it does, return the match id.
   * @param match_number the match number to check
   * @param competition_id the id of the competition to check
   */
  static async checkIfMatchExists(
    match_number: number,
    competition_id: number,
  ): Promise<number> {
    const {data, error} = await supabase
      .from('matches')
      .select('*')
      .eq('number', match_number)
      .eq('competition_id', competition_id);
    if (error) {
      throw error;
    } else {
      return data[0].id;
    }
  }

  static async createMatch(match_number: number, competition_id: number) {
    const {data, error} = await supabase
      .from('matches')
      .insert([
        {
          number: match_number,
          competition_id: competition_id,
        },
      ])
      .single();
    if (error) {
      throw error;
    } else {
      return data;
    }
  }

  static async createNote(
    title: string,
    content: string,
    team_number: number,
    match_number: number,
    competition_id: number,
  ): Promise<NoteStructure> {
    let match_id = await this.checkIfMatchExists(match_number, competition_id);
    // console.log('match_id: ', match_id);
    let user_id = await ProfilesDB.getCurrentUserProfile().then(profile => {
      return profile.id;
    });
    // console.log('user_id: ', user_id);

    // console.log('title: ', title);
    // console.log('content: ', content);
    // console.log('team_number: ', team_number);
    // console.log('match_id: ', match_id);
    // console.log('user_id: ', user_id);

    const {data, error} = await supabase
      .from('notes')
      .insert([
        {
          title: title,
          content: content,
          team_number: team_number,
          match_id: match_id,
          created_at: new Date(),
          created_by: user_id,
        },
      ])
      .single();
    if (error) {
      console.error(error.message);
      throw error;
    } else {
      return data;
    }
  }
}

export default NotesDB;
