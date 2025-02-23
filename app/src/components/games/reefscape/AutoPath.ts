import {ReefscapeActionType} from './ReefscapeActions';

export interface AutoNode {
  type: ReefscapeActionType;
  // only for intaking from coral marks
  nodeId?: number;
  order: number;
  // only for intaking from coral marks
  state?: 'success' | 'missed';
}

export type AutoPath = AutoNode[];
