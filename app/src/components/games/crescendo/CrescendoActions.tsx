import {Svg, Path} from 'react-native-svg';

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
    icon: () => (
      <Svg width="35" height="45" viewBox="0 0 35 45" fill="none">
        <Path
          d="M28.75 2.8125C29.4959 2.8125 30.2113 3.10882 30.7387 3.63626C31.2662 4.16371 31.5625 4.87908 31.5625 5.625V39.375C31.5625 40.1209 31.2662 40.8363 30.7387 41.3637C30.2113 41.8912 29.4959 42.1875 28.75 42.1875H6.25C5.50408 42.1875 4.78871 41.8912 4.26126 41.3637C3.73382 40.8363 3.4375 40.1209 3.4375 39.375V5.625C3.4375 4.87908 3.73382 4.16371 4.26126 3.63626C4.78871 3.10882 5.50408 2.8125 6.25 2.8125H28.75ZM6.25 0C4.75816 0 3.32742 0.592632 2.27252 1.64752C1.21763 2.70242 0.625 4.13316 0.625 5.625V39.375C0.625 40.8668 1.21763 42.2976 2.27252 43.3525C3.32742 44.4074 4.75816 45 6.25 45H28.75C30.2418 45 31.6726 44.4074 32.7275 43.3525C33.7824 42.2976 34.375 40.8668 34.375 39.375V5.625C34.375 4.13316 33.7824 2.70242 32.7275 1.64752C31.6726 0.592632 30.2418 0 28.75 0L6.25 0Z"
          fill="black"
        />
        <Path
          d="M17.5 13.3594C16.9406 13.3594 16.404 13.1371 16.0084 12.7416C15.6129 12.346 15.3906 11.8094 15.3906 11.25C15.3906 10.6906 15.6129 10.154 16.0084 9.75845C16.404 9.36286 16.9406 9.14062 17.5 9.14062C18.0594 9.14062 18.596 9.36286 18.9916 9.75845C19.3871 10.154 19.6094 10.6906 19.6094 11.25C19.6094 11.8094 19.3871 12.346 18.9916 12.7416C18.596 13.1371 18.0594 13.3594 17.5 13.3594ZM17.5 16.875C18.9918 16.875 20.4226 16.2824 21.4775 15.2275C22.5324 14.1726 23.125 12.7418 23.125 11.25C23.125 9.75816 22.5324 8.32742 21.4775 7.27252C20.4226 6.21763 18.9918 5.625 17.5 5.625C16.0082 5.625 14.5774 6.21763 13.5225 7.27252C12.4676 8.32742 11.875 9.75816 11.875 11.25C11.875 12.7418 12.4676 14.1726 13.5225 15.2275C14.5774 16.2824 16.0082 16.875 17.5 16.875ZM17.5 25.3125C16.3811 25.3125 15.3081 25.757 14.5169 26.5481C13.7257 27.3393 13.2812 28.4124 13.2812 29.5312C13.2812 30.6501 13.7257 31.7232 14.5169 32.5144C15.3081 33.3055 16.3811 33.75 17.5 33.75C18.6189 33.75 19.6919 33.3055 20.4831 32.5144C21.2743 31.7232 21.7188 30.6501 21.7188 29.5312C21.7188 28.4124 21.2743 27.3393 20.4831 26.5481C19.6919 25.757 18.6189 25.3125 17.5 25.3125ZM7.65625 29.5312C7.65625 26.9205 8.69336 24.4167 10.5394 22.5707C12.3855 20.7246 14.8893 19.6875 17.5 19.6875C20.1107 19.6875 22.6145 20.7246 24.4606 22.5707C26.3066 24.4167 27.3438 26.9205 27.3438 29.5312C27.3438 32.142 26.3066 34.6458 24.4606 36.4918C22.6145 38.3379 20.1107 39.375 17.5 39.375C14.8893 39.375 12.3855 38.3379 10.5394 36.4918C8.69336 34.6458 7.65625 32.142 7.65625 29.5312Z"
          fill="black"
        />
      </Svg>
    ),
    link_name: 'score_speaker',
  },
  [CrescendoActionType.ScoreAmp]: {
    name: 'Score Amp',
    icon: () => (
      <Svg width="41" height="41" viewBox="0 0 41 41" fill="none">
        <Path
          d="M35.875 2.5625C37.4125 2.5625 38.4375 3.5875 38.4375 5.125V35.875C38.4375 37.4125 37.4125 38.4375 35.875 38.4375H5.125C3.5875 38.4375 2.5625 37.4125 2.5625 35.875V5.125C2.5625 3.5875 3.5875 2.5625 5.125 2.5625H35.875ZM5.125 0C2.30625 0 0 2.30625 0 5.125V35.875C0 38.6937 2.30625 41 5.125 41H35.875C38.6937 41 41 38.6937 41 35.875V5.125C41 2.30625 38.6937 0 35.875 0H5.125Z"
          fill="black"
        />
        <Path
          d="M20.5 7.6875C27.4188 7.6875 33.3125 13.5812 33.3125 20.5C33.3125 27.4188 27.4188 33.3125 20.5 33.3125C13.5812 33.3125 7.6875 27.4188 7.6875 20.5C7.6875 13.5812 13.5812 7.6875 20.5 7.6875Z"
          fill="black"
        />
      </Svg>
    ),
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

export const CrescendoActionIcon = ({
  action,
}: {
  action: CrescendoActionType;
}) => {
  const metadata = CrescendoActions[action];
  return metadata.icon ? metadata.icon() : null;
};
