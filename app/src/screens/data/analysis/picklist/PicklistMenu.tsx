import { PicklistManager } from "./PicklistManager";
import { PicklistCreator, type PicklistCreatorParams } from "./PicklistCreator";
import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<PicklistParamList>();
export type PicklistScreenProps<K extends keyof PicklistParamList> = NativeStackScreenProps<PicklistParamList, K>
export type PicklistParamList = {
    Manager: undefined
    Creator: PicklistCreatorParams
}

export function PicklistsMenu() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Manager"
                component={PicklistManager}
                options={{
                    title: "Picklists",
                    headerShown: true,
                    headerBackTitle: "Back",
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            />
            <Stack.Screen
                name="Creator"
                component={PicklistCreator}
                options={{
                    title: "Picklist Creator",
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            />
        </Stack.Navigator>
    );
}
