import {supabase} from '../lib/supabase';
import type from "@react-navigation/native/src/types";

interface ScoutAssignmentTeamBased {
  id: number;
  competitionId: number;
  matchId: number;
  matchNumber: number;
  userId: number;
  userFullName: string;
  team: number;
}

interface ScoutAssignmentTeamBasedCurrentUser {
  id: number;
  competitionId: number;
  matchId: number;
  matchNumber: number;
  team: number;
}

export enum Position {
  RF,
  RM,
  RC,
  BF,
  BM,
  BC,
}

interface ScoutAssignmentPositionBased {
  id: number;
  competitionId: number;
  matchNumber: number;
  userId: number;
  userFullName: string;
  position: Position;
}

interface ScoutAssignmentPositionBasedCurrentUser {
  id: number;
  competitionId: number;
  matchNumber: number;
  position: Position;
}

class ScoutAssignments {
  static async getScoutAssignmentsForCompetitionTeamBased(
    compId: number,
  ): Promise<ScoutAssignmentTeamBased[]> {
    const {data, error} = await supabase
      .from('scout_assignments_team_based')
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
      const res: ScoutAssignmentTeamBased[] = [];
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

  static async getScoutAssignmentsForCompetitionTeamBasedCurrentUser(
    compId: number,
  ): Promise<ScoutAssignmentTeamBasedCurrentUser[]> {
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || user == null) {
      throw userError;
    }
    let res: ScoutAssignmentTeamBasedCurrentUser[] = [];
    const {data, error} = await supabase
      .from('scout_assignments_team_based')
      .select('*, tba_matches(team, match)')
      .eq('competition_id', compId)
      .eq('user_id', user.id);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i++) {
        res.push({
          id: data[i].id,
          competitionId: data[i].competition_id,
          matchId: data[i].match_id,
          matchNumber: data[i].tba_matches.match,
          team: data[i].tba_matches.team,
        });
      }
    }
    const {data: data2, error: error2} = await supabase
      .from('scout_reports')
      .select('*, matches!inner( number, competition_id )')
      .eq('matches.competition_id', compId)
      .eq('user_id', user.id);
    if (error2) {
      throw error2;
    }
    res = res.filter(assignment => {
      console.log(assignment.matchNumber);
      console.log(assignment.team.substring(3));
      return (
        data2.find(
          report =>
            report.matches.number === assignment.matchNumber &&
            report.team === parseInt(assignment.team.substring(3), 10),
        ) === undefined
      );
    });
    return res;
  }

  static async getScoutAssignmentsForCompetitionPositionBased(
    compId: number,
  ): Promise<ScoutAssignmentPositionBased[]> {
    const {data, error} = await supabase
      .from('scout_assignments_position_based')
      .select('*')
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
      const res: ScoutAssignmentPositionBased[] = [];
      for (let i = 0; i < data.length; i++) {
        let position: Position;
        switch (data[i].robot_position) {
          case 'rf':
            position = Position.RF;
            break;
          case 'rm':
            position = Position.RM;
            break;
          case 'rc':
            position = Position.RC;
            break;
          case 'bf':
            position = Position.BF;
            break;
          case 'bm':
            position = Position.BM;
            break;
          case 'bc':
            position = Position.BC;
            break;
          default:
            throw new Error('Invalid position');
        }
        res.push({
          id: data[i].id,
          competitionId: data[i].competition_id,
          matchNumber: data[i].match_number,
          userId: data[i].user_id,
          userFullName: names[i],
          position: position,
        });
      }
      return res;
    }
  }

  static async getScoutAssignmentsForCompetitionPositionBasedCurrentUser(
    compId: number,
  ): Promise<ScoutAssignmentPositionBasedCurrentUser[]> {
    const {
      data: {user},
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || user == null) {
      throw userError;
    }
    let res: ScoutAssignmentPositionBasedCurrentUser[] = [];
    const {data, error} = await supabase
      .from('scout_assignments_position_based')
      .select('*')
      .eq('competition_id', compId)
      .eq('user_id', user.id);
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < data.length; i++) {
        let position: Position;
        console.log(data[i]);
        switch (data[i].robot_position) {
          case 'rf':
            position = Position.RF;
            break;
          case 'rm':
            position = Position.RM;
            break;
          case 'rc':
            position = Position.RC;
            break;
          case 'bf':
            position = Position.BF;
            break;
          case 'bm':
            position = Position.BM;
            break;
          case 'bc':
            position = Position.BC;
            break;
          default:
            throw new Error('Invalid position');
        }
        res.push({
          id: data[i].id,
          competitionId: data[i].competition_id,
          matchNumber: data[i].match_number,
          position: position,
        });
      }
    }
    const {data: data2, error: error2} = await supabase
      .from('scout_reports')
      .select('*, matches!inner( number, competition_id )')
      .eq('matches.competition_id', compId)
      .eq('user_id', user.id);
    if (error2) {
      throw error2;
    }
    res = res.filter(assignment => {
      return (
        data2.find(
          report => report.matches.number === assignment.matchNumber,
        ) === undefined
      );
    });
    return res;
  }
}

export default ScoutAssignments;
