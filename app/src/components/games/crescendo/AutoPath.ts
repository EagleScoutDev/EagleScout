export interface AutoNode {
  noteId: number;
  order: number;
  state: 'success' | 'missed';
}

export type AutoPath = AutoNode[];
