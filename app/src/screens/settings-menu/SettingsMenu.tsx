import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DebugOffline from '../DebugOffline';
import { SettingsHome } from './SettingsHome';
import { AccountEditProfile, AccountEditProfileParams } from './account/AccountEditProfile';
import SubmittedForms from './scout/SubmittedForms';
import { SubmittedNotes } from './scout/SubmittedNotes';
import { AppHomeScreenProps } from '../../AppHome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccountDeletionModal } from './account/AccountDeletionModal';
import { AccountChangePassword } from './account/AccountChangePassword';

const Stack = createStackNavigator<SettingsMenuParamList>();
export type SettingsMenuScreenProps<K extends keyof SettingsMenuParamList> = NativeStackScreenProps<SettingsMenuParamList, K>
export type SettingsMenuParamList = {
    "Home": undefined

    "Account/EditProfile": AccountEditProfileParams
    "Account/ChangePassword": undefined
    "Account/Delete": undefined
    "Debug/Offline": undefined
    "Scout/Reports": undefined
    "Scout/Notes": undefined
}

export interface SettingsMenuProps extends AppHomeScreenProps<"Settings"> {
}
export function SettingsMenu({ }: SettingsMenuProps) {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={SettingsHome}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Account/EditProfile"
                component={AccountEditProfile}
                options={{
                    title: "Edit Profile",
                    headerBackTitle: 'Back',
                }}
            />

            <Stack.Screen
                name="Account/ChangePassword"
                component={AccountChangePassword}
            />
            <Stack.Screen
                name={"Account/Delete"}
                component={AccountDeletionModal}
            />

            <Stack.Screen
                name="Scout/Reports"
                component={SubmittedForms}
                options={{
                    headerBackTitle: 'Back',
                }}
            />
            <Stack.Screen
                name={'Scout/Notes'}
                options={{
                    headerBackTitle: 'Back',
                }}
                component={SubmittedNotes}
            />

            <Stack.Screen
                name="Debug/Offline"
                component={DebugOffline}
                options={{
                    headerBackTitle: 'Back',
                }}
            />
        </Stack.Navigator>
    );
}
