import {CrescendoActionType} from './CrescendoActions';

export interface AutoNode {
  type: CrescendoActionType;
  // only for intaking notes
  noteId?: number;
  order: number;
  // only for intaking notes
  state?: 'success' | 'missed';
}

export type CrescendoAutoPath = AutoNode[];
