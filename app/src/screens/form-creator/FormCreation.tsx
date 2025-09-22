import { FormEditor, type FormEditorParams } from './FormEditor';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormList } from './FormList';
import { FormViewer } from "./components/FormViewer";

const Stack = createNativeStackNavigator<FormCreationParamList>();
export type FormCreationScreenProps<K extends keyof FormCreationParamList> = NativeStackScreenProps<FormCreationParamList, K>
export type FormCreationParamList = {
    List: undefined
    Edit: FormEditorParams
    View: undefined
}

export function FormCreation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={FormList}
                options={{
                    title: "Forms",
                    headerShown: false,
                }}
                name="List"
            />
            <Stack.Screen
                component={FormEditor}
                options={{
                    title: "Form Editor",
                    headerShown: false,
                }}
                name="Edit"
            />
            <Stack.Screen
                component={FormViewer}
                options={{
                    title: "Form Viewer",
                    // show the back button, but not the header
                    headerBackTitle: 'Back',
                    headerTitle: '',
                }}
                name="View"
            />
        </Stack.Navigator>
    );
};
