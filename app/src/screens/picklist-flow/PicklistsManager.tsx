import { React } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PicklistsManagerScreen } from './PicklistsManagerScreen';
import { PicklistCreator } from './PicklistCreator';
import { useTheme } from '@react-navigation/native';

const Stack = createStackNavigator();

export function PicklistsManager() {
    const { colors } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="PicklistsManager"
                component={PicklistsManagerScreen}
                options={{
                    title: 'Picklists',
                    headerShown: true,
                    headerBackTitle: 'Back',
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            />
            <Stack.Screen
                name="Picklist Creator"
                component={PicklistCreator}
                options={{
                    title: 'Picklist Creator',
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            />
        </Stack.Navigator>
    );
};
