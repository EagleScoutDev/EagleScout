import {ReefscapeActionType} from './ReefscapeActions';

export interface AutoNode {
  type: ReefscapeActionType;
  // only for intaking notes
  nodeId?: number;
  order: number;
  // only for intaking notes
  state?: 'success' | 'missed';
}

export type AutoPath = AutoNode[];
