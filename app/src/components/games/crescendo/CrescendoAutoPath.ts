import {CrescendoActionType} from './CrescendoActions.tsx';

export interface AutoNode {
  type: CrescendoActionType;
  // only for intaking notes
  noteId?: number;
  order: number;
  // only for intaking notes
  state?: 'success' | 'missed';
}

export type CrescendoAutoPath = AutoNode[];
