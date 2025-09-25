import { FormEditor, type FormEditorParams } from "./editor/FormEditor.tsx";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormList } from "./list/FormList.tsx";
import { FormViewer, type FormViewerParams } from "./view/FormViewer.tsx";

const Stack = createNativeStackNavigator<FormsMenuParamList>();
export type FormsMenuScreenProps<K extends keyof FormsMenuParamList> = NativeStackScreenProps<FormsMenuParamList, K>;
export type FormsMenuParamList = {
    List: undefined;
    Edit: FormEditorParams;
    View: FormViewerParams;
};

export function ManageForms() {
    return (
        <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                component={FormList}
                options={{
                    title: "Forms",
                }}
                name="List"
            />
            <Stack.Screen
                component={FormEditor}
                options={{
                    title: "Form Editor",
                }}
                name="Edit"
            />
            <Stack.Screen
                component={FormViewer}
                options={{
                    title: "Form Viewer",
                    headerBackTitle: "Back",
                    headerTitle: "",
                }}
                name="View"
            />
        </Stack.Navigator>
    );
}
