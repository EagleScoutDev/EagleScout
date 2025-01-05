import {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

type LoginBottomTabParamList = {
  Entrypoint: undefined;
  Login: undefined;
  Sign: undefined;
  ResetPassword: undefined;
  EnterTeamEmail: undefined;
  EnterUserInfo: undefined;
  SelectTeam: undefined;
};

export type EntrypointNavigationProps = BottomTabNavigationProp<
  LoginBottomTabParamList,
  'Entrypoint'
>;
export type LoginNavigationProps = BottomTabNavigationProp<
  LoginBottomTabParamList,
  'Login'
>;
export type SignUpProps = BottomTabScreenProps<LoginBottomTabParamList, 'Sign'>;
export type ResetPasswordProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'ResetPassword'
>;
export type EnterTeamEmailProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'EnterTeamEmail'
>;
export type EnterUserInfoProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'EnterUserInfo'
>;
export type SelectTeamProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'SelectTeam'
>;
