import React from 'react';
import FormCreationMain from './FormCreationMain';
import { createStackNavigator } from '@react-navigation/stack';
import FormList from './FormList';
import FormViewer from "./components/FormViewer";

const Stack = createStackNavigator();

function FormCreation() {
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    component={FormList}
                    options={{
                        headerShown: false,
                    }}
                    name={'Form List'}
                />
                <Stack.Screen
                    component={FormCreationMain}
                    options={{
                        headerShown: false,
                    }}
                    name={'Form Creation Main'}
                />
                <Stack.Screen
                    component={FormViewer}
                    options={{
                        // show the back button, but not the header
                        headerBackTitle: 'Back',
                        headerTitle: '',
                    }}
                    name={'Form Viewer'}
                />
            </Stack.Navigator>
        </>
    );
}

export default FormCreation;
