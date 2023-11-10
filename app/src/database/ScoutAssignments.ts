import {supabase} from '../lib/supabase';

interface ScoutAssignment {
  id: number;
  competitionId: number;
  matchId: number;
  matchNumber: number;
  userId: number;
  userFullName: string;
  team: number;
}

interface ScoutAssignmentCurrentUser {
  id: number;
  competitionId: number;
  matchId: number;
  matchNumber: number;
  team: number;
}

class ScoutAssignments {
  static async getScoutAssignmentsForCompetition(
    compId: number,
  ): Promise<ScoutAssignment[]> {
    const {data, error} = await supabase
      .from('scout_assignments')
      .select('*, tba_matches(team, match)')
      .eq('competition_id', compId);
    if (error) {
      throw error;
    } else {
      const namesPromises = data.map(async assignment => {
        const {data: userData, error: userError} = await supabase
          .from('profiles')
          .select('name')
          .eq('id', assignment.user_id)
          .single();
        if (userError) {
          throw userError;
        }
        return userData.name;
      });
      const names = await Promise.all(namesPromises);
      const res: ScoutAssignment[] = [];
      for (let i = 0; i < data.length; i++) {
        res.push({
          id: data[i].id,
          competitionId: data[i].competition_id,
          matchId: data[i].match_id,
          matchNumber: data[i].tba_matches.match,
          userId: data[i].user_id,
          userFullName: names[i],
          team: data[i].tba_matches.team,
        });
      }
      return res;
    }
  }

  static async getScoutAssignmentsForCompetitionCurrentUser(
    compId: number,
  ): Promise<ScoutAssignmentCurrentUser[]> {
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || user == null) {
      throw userError;
    }
    const {data, error} = await supabase
      .from('scout_assignments')
      .select('*, tba_matches(team, match)')
      .eq('competition_id', compId)
      .eq('user_id', user.id);
    if (error) {
      throw error;
    } else {
      const res: ScoutAssignmentCurrentUser[] = [];
      for (let i = 0; i < data.length; i++) {
        res.push({
          id: data[i].id,
          competitionId: data[i].competition_id,
          matchId: data[i].match_id,
          matchNumber: data[i].tba_matches.match,
          team: data[i].tba_matches.team,
        });
      }
      return res;
    }
  }
}

export default ScoutAssignments;
