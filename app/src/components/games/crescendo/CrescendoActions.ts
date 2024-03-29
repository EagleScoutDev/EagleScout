export enum CrescendoActionType {
  PickupSource,
  PickupGround,
  ScoreSpeaker,
  ScoreAmp,
  MissSpeaker,
  MissAmp,
  StartDefense,
  StopDefense,
  StartAmplifying,
  StopAmplifying,
}

export type ActionMetadata = {
  name: string;
  link_name: string;
};

export const getActionForLink = (link: string): CrescendoActionType | null => {
  for (const action in Object.keys(CrescendoActions)) {
    if (CrescendoActions[action].link_name === link) {
      return Number(action) as CrescendoActionType;
    }
  }
  return null;
};

export const CrescendoActions: Record<CrescendoActionType, ActionMetadata> = {
  [CrescendoActionType.PickupSource]: {
    name: 'Pickup Source',
    link_name: 'pickup_source',
  },
  [CrescendoActionType.PickupGround]: {
    name: 'Pickup Ground',
    link_name: 'pickup_ground',
  },
  [CrescendoActionType.ScoreSpeaker]: {
    name: 'Score Speaker',
    link_name: 'score_speaker',
  },
  [CrescendoActionType.ScoreAmp]: {
    name: 'Score Amp',
    link_name: 'score_amp',
  },
  [CrescendoActionType.MissSpeaker]: {
    name: 'Miss Speaker',
    link_name: 'miss_speaker',
  },
  [CrescendoActionType.MissAmp]: {
    name: 'Miss Amp',
    link_name: 'miss_amp',
  },
  [CrescendoActionType.StartDefense]: {
    name: 'Start Defense',
    link_name: 'defense_start',
  },
  [CrescendoActionType.StopDefense]: {
    name: 'Stop Defense',
    link_name: 'defense_stop',
  },
  [CrescendoActionType.StartAmplifying]: {
    name: 'Start Amplifying',
    link_name: 'amplify_start',
  },
  [CrescendoActionType.StopAmplifying]: {
    name: 'Stop Amplifying',
    link_name: 'amplify_stop',
  },
};
