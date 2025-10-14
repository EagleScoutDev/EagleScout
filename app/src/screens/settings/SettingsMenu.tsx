import { DebugAsyncStorage } from "./debug/DebugAsyncStorage";
import { SettingsHome } from "./SettingsHome";
import { AccountEditProfile, type AccountEditProfileParams } from "./account/AccountEditProfile";
import { SubmittedForms } from "./submissions/SubmittedForms";
import { SubmittedNotes } from "./submissions/SubmittedNotes";
import type { AppHomeScreenProps } from "../../AppHome";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountDeletionModal } from "./account/AccountDeletionModal";
import { AccountChangePassword } from "./account/AccountChangePassword";
import { DebugHome } from "./debug/DebugHome.tsx";

const Stack = createNativeStackNavigator<SettingsMenuParamList>();
export type SettingsMenuScreenProps<K extends keyof SettingsMenuParamList> = NativeStackScreenProps<
    SettingsMenuParamList,
    K
>;
export type SettingsMenuParamList = {
    Home: undefined;

    "Account/EditProfile": AccountEditProfileParams;
    "Account/ChangePassword": undefined;
    "Account/Delete": undefined;
    "Debug/Home": undefined;
    "Debug/AsyncStorage": undefined;
    "Scout/Reports": undefined;
    "Scout/Notes": undefined;
};

export interface SettingsMenuProps extends AppHomeScreenProps<"Settings"> {}
export function SettingsMenu({}: SettingsMenuProps) {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={SettingsHome}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Account/EditProfile"
                component={AccountEditProfile}
                options={{
                    title: "Edit Profile",
                    headerBackTitle: "Back",
                }}
            />

            <Stack.Screen
                name="Account/ChangePassword"
                component={AccountChangePassword}
                options={{
                    title: "Change Password",
                }}
            />
            <Stack.Screen
                name={"Account/Delete"}
                component={AccountDeletionModal}
                options={{
                    title: "Request Account Deletion",
                }}
            />

            <Stack.Screen
                name="Scout/Reports"
                component={SubmittedForms}
                options={{
                    title: "Submitted Reports",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name={"Scout/Notes"}
                options={{
                    title: "Submitted Notes",
                    headerBackTitle: "Back",
                }}
                component={SubmittedNotes}
            />

            <Stack.Screen
                name="Debug/Home"
                component={DebugHome}
                options={{
                    title: "Debug",
                    headerBackTitle: "Back",
                }}
            />
            <Stack.Screen
                name="Debug/AsyncStorage"
                component={DebugAsyncStorage}
                options={{
                    title: "AsyncStorage",
                    headerBackTitle: "Back",
                }}
            />
        </Stack.Navigator>
    );
}
