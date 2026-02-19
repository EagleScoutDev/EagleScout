import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import type { HomeTabProps } from "../HomeTabs";
import { SettingsMain } from "./SettingsMain";
import { DebugAsyncStorage } from "./(debug)/DebugAsyncStorage";
import { AccountEditProfile, type AccountEditProfileParams } from "./(account)/AccountEditProfile";
import { SubmittedForms } from "./(submissions)/SubmittedForms";
import { SubmittedNotes } from "./(submissions)/SubmittedNotes";
import { SelectCompetitionForForms } from "./(submissions)/SelectCompetitionForForms";
import { SelectCompetitionForNotes } from "./(submissions)/SelectCompetitionForNotes";
import { AccountDeletionModal } from "./(account)/AccountDeletionModal";
import { AccountChangePassword } from "./(account)/AccountChangePassword";
import { DebugMain } from "./(debug)/DebugMain";
import { About } from "./About";

const Stack = createNativeStackNavigator<SettingsTabParamList>();
export type SettingsTabScreenProps<K extends keyof SettingsTabParamList> = NativeStackScreenProps<
    SettingsTabParamList,
    K
>;
export type SettingsTabParamList = {
    Main: undefined;

    "Account/EditProfile": AccountEditProfileParams;
    "Account/ChangePassword": undefined;
    "Account/Delete": undefined;
    "Scout/SelectCompetitionForReports": undefined;
    "Scout/ViewReports": { competitionId: number; competitionName: string };
    "Scout/SelectCompetitionForNotes": undefined;
    "Scout/ViewNotes": { competitionId: number; competitionName: string };
    "Debug/Main": undefined;
    "Debug/AsyncStorage": undefined;
    About: undefined;
};

export interface SettingsTabProps extends HomeTabProps<"Settings"> {}
export function SettingsTab({}: SettingsTabProps) {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={useStackThemeConfig()}>
            <Stack.Screen
                name="Main"
                component={SettingsMain}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Account/EditProfile"
                component={AccountEditProfile}
                options={{
                    title: "Edit Profile",
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
                name="Scout/SelectCompetitionForReports"
                component={SelectCompetitionForForms}
                options={{
                    title: "Select Competition",
                }}
            />
            <Stack.Screen
                name="Scout/ViewReports"
                component={SubmittedForms}
                options={({ route }) => ({
                    title: `Reports for ${route.params.competitionName}`,
                    headerBackButtonDisplayMode: "minimal",
                })}
            />
            <Stack.Screen
                name="Scout/SelectCompetitionForNotes"
                component={SelectCompetitionForNotes}
                options={{
                    title: "Select Competition",
                }}
            />
            <Stack.Screen
                name="Scout/ViewNotes"
                component={SubmittedNotes}
                options={({ route }) => ({
                    title: `Notes for ${route.params.competitionName}`,
                    headerBackButtonDisplayMode: "minimal",
                })}
            />

            <Stack.Screen
                name="Debug/Main"
                component={DebugMain}
                options={{
                    title: "Debug",
                }}
            />
            <Stack.Screen
                name="Debug/AsyncStorage"
                component={DebugAsyncStorage}
                options={{
                    title: "AsyncStorage",
                }}
            />

            <Stack.Screen
                name="About"
                component={About}
                options={{
                    title: "About",
                }}
            />
        </Stack.Navigator>
    );
}
