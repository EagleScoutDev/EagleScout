import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import { BrowseTabMain } from "@/navigation/tabs/browse/BrowseTabMain";

const Stack = createNativeStackNavigator<BrowseTabParamList>();
export type BrowseTabScreenProps<K extends keyof BrowseTabParamList> = NativeStackScreenProps<
    BrowseTabParamList,
    K
>;
export type BrowseTabParamList = {
    Main: undefined;
};

export function BrowseTab() {
    return (
        <Stack.Navigator initialRouteName={"Main"} screenOptions={useStackThemeConfig()}>
            <Stack.Screen
                name="Main"
                component={BrowseTabMain}
                options={{
                    headerTitle: "",
                }}
            />
        </Stack.Navigator>
    );
}
