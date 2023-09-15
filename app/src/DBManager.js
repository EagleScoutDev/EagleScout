import { supabase } from './lib/supabase';

/**
 * This class provides common methods to scout reports and competitions from the database.
 */
class DBManager {
  /**
   * Returns all the scouting reports for a given team
   * @param team the team to look for
   * @returns {Promise<[]>} resolves when the reports are found
   */
  static async getReportsForTeam(team) {
    const { data, error } = await supabase.from('scout_reports')
    .select('*, match:match_id(number, competition_id), matches(*)').eq('team', team);
    if (error) {
      console.error(error);
      return [];
    } else {
      console.log('hey');
      if (DBManager.DEBUG) {
        console.log('Finished searching for scout reports');
      }

      const reports = [];
      for (let i = 0; i < data.length; i++) {
        const doc = data[i];
        /*console.log('dffdsajfdsadfsdfdfsfd' + doc.match.competition_id);
        const res = await supabase.from('scout_reports')
        .select('*, match:match_id(number, competition_id), matches(*)').eq('matches.competition_id', chosenComp.id);
        const data2 = res.data;
        const error2 = res.error;
        let compname;
        if (error2) {
          console.error(error2);
          compname = ''
        } else {
          compname = data.name;
        }*/
        const compname = 'Unavailable';
        reports.push({
          created_at: doc.created_at,
          match_number: doc.match.number,
          team: doc.team,
          data: doc.data,
          competition_name: compname,
          user_id: doc.user_id,
          form: await this.getFormFromDatabase()
        });
      }

      reports.sort((a, b) => {
        return a.created_at - b.created_at;
      });
      return reports;
    }
  }

  /**
   * Returns all the scouting reports for the user of the app.
   * @returns {Promise<[]>} resolves when the reports are found
   */
  static async getReportsForSelf() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('scout_reports')
      .select('*, match:match_id(number, competition_id), matches(*)').eq('user_id', user.id);
    if (error) {
      console.error(error);
      return [];
    } else {
      console.log('hey');
      if (DBManager.DEBUG) {
        console.log('Finished searching for scout reports');
      }

      const reports = [];
      for (let i = 0; i < data.length; i++) {
        const doc = data[i];
        /*console.log('dffdsajfdsadfsdfdfsfd' + doc.match.competition_id);
        const res = await supabase.from('scout_reports')
        .select('*, match:match_id(number, competition_id), matches(*)').eq('matches.competition_id', chosenComp.id);
        const data2 = res.data;
        const error2 = res.error;
        let compname;
        if (error2) {
          console.error(error2);
          compname = ''
        } else {
          compname = data.name;
        }*/
        const compname = 'Unavailable';
        reports.push({
          created_at: doc.created_at,
          match_number: doc.match.number,
          team: doc.team,
          data: doc.data,
          competition_name: compname,
          user_id: doc.user_id,
          form: await this.getFormFromDatabase()
        });
      }

      reports.sort((a, b) => {
        return a.match_number - b.match_number;
      });
      return reports;
    }
  }

  /**
   * Finds all the reports for a given competition
   * @param chosenComp an object containing all details of the competition
   * @returns {Promise<[]>} resolves when all scout reports for that competition have been found.
   */
  static async getReportsForCompetition(chosenComp) {
    if (DBManager.DEBUG) {
      console.log('Starting to look for scout reports');
      console.log('Chosen comp is: ' + chosenComp.name);
      console.log('Chosen comp id: ' + chosenComp.id);
    }

    const { data, error } = await supabase.from('scout_reports')
      .select('*, match:match_id(number, competition_id), matches(*)').eq('matches.competition_id', chosenComp.id);
    if (error) {
      console.error(error);
      return [];
    } else {
      console.log('hey');
      if (DBManager.DEBUG) {
        console.log('Finished searching for scout reports');
      }

      const reports = [];
      for (let i = 0; i < data.length; i++) {
        const doc = data[i];
        /*console.log('dffdsajfdsadfsdfdfsfd' + doc.match.competition_id);
        const res = await supabase.from('scout_reports')
        .select('*, match:match_id(number, competition_id), matches(*)').eq('matches.competition_id', chosenComp.id);
        const data2 = res.data;
        const error2 = res.error;
        let compname;
        if (error2) {
          console.error(error2);
          compname = ''
        } else {
          compname = data.name;
        }*/
        const compname = 'Unavailable';
        reports.push({
          created_at: doc.created_at,
          match_number: doc.match.number,
          team: doc.team,
          data: doc.data,
          competition_name: compname,
          user_id: doc.user_id,
          form: await this.getFormFromDatabase()
        });
      }

      reports.sort((a, b) => {
        return a.match_number - b.match_number;
      });
      return reports;
    }
  }

  /**
   * Returns the latest competition from the database
   * @returns {Promise<void>}
   */
  static async getCompetitionFromDatabase() {
    console.log('beginning getCompetitionFromDatabase');
    const { data, error } = await supabase.from('competitions').select('*').order('start_time', { ascending: false }).single();
    if (error) {
      console.error(error);
      return null;
    } else {
      return data;
    }
  }

  /**
   * Attempts to get the form structure from the database.
   * @returns {Promise<any|null>}
   */
  static async getFormFromDatabase() {
    const { data, error } = await supabase.from('forms').select('*').eq('id', 1);
    if (error) {
      console.error(error);
      return null;
    } else {
      console.log('hereeee' + typeof data[0].scout_data.questions);
      console.log('hereeee' + JSON.stringify(data[0].scout_data.questions));
      data[0].scout_data.questions.map((question) => {
        console.log(question);
      });
      return data[0].scout_data.questions;
      
    }
  }

  static async getFormIdFromDatabase() {
    const { data, error } = await supabase.from('forms').select('*').eq('id', 1);
    if (error) {
      console.error(error);
      return null;
    } else {
      return data[0].id;
      
    }
  }
}

export default DBManager;
