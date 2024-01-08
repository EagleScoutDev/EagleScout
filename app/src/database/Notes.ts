export interface NoteStructure {
  id?: string;

  title: string;
  content: string;

  team_number: number;
  match_id: number; // foreign-key relation to matches table

  created_at: Date;
  created_by: string;
}

class NotesDB {}

export default NotesDB;
