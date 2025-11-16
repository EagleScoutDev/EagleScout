import { DebugAsyncStorage } from "./debug/DebugAsyncStorage";
import { SettingsHome } from "./SettingsHome";
import { AccountEditProfile, type AccountEditProfileParams } from "./account/AccountEditProfile";
import { SubmittedForms } from "./submissions/SubmittedForms";
import { SubmittedNotes } from "./submissions/SubmittedNotes";
import { SelectCompetitionForForms } from "./submissions/SelectCompetitionForForms";
import { SelectCompetitionForNotes } from "./submissions/SelectCompetitionForNotes";
import type { AppHomeScreenProps } from "../../AppHome";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { AccountDeletionModal } from "./account/AccountDeletionModal";
import { AccountChangePassword } from "./account/AccountChangePassword";
import { DebugHome } from "./debug/DebugHome";
import { About } from "./About";

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
    "Scout/SelectCompetitionForReports": undefined;
    "Scout/ViewReports": { competitionId: number; competitionName: string };
    "Scout/SelectCompetitionForNotes": undefined;
    "Scout/ViewNotes": { competitionId: number; competitionName: string };
    "Debug/Home": undefined;
    "Debug/AsyncStorage": undefined;
    About: undefined;
};

export interface SettingsMenuProps extends AppHomeScreenProps<"Settings"> {}
export function SettingsMenu({}: SettingsMenuProps) {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerBackTitle: "Back" }}>
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
                    title: route.params.competitionName,
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
                    title: route.params.competitionName,
                })}
            />

            <Stack.Screen
                name="Debug/Home"
                component={DebugHome}
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
