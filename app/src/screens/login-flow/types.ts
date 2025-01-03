import {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

type LoginBottomTabParamList = {
  Entrypoint: undefined;
  Login: undefined;
  Sign: undefined;
  CompleteSignUp: undefined;
  ResetPassword: undefined;
  RegisterNewTeam: undefined;
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
export type CompleteSignUpProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'CompleteSignUp'
>;
export type ResetPasswordProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'ResetPassword'
>;
export type RegisterNewTeamProps = BottomTabScreenProps<
  LoginBottomTabParamList,
  'RegisterNewTeam'
>;
