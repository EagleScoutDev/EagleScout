import { useNavigation } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./index";

export const useRootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>;
