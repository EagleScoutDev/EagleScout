import { ScoutAssignmentsSpreadsheet, type ScoutAssignmentsSpreadsheetParams } from "./ScoutAssignmentsSpreadsheet";
import { ScoutAssignmentsMain } from "./ScoutAssignmentsMain";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<ScoutAssignmentsParamList>();
export type ScoutAssignmentsScreenProps<K extends keyof ScoutAssignmentsParamList> = NativeStackScreenProps<ScoutAssignmentsParamList, K>
export type ScoutAssignmentsParamList = {
    Main: undefined;
    Spreadsheet: ScoutAssignmentsSpreadsheetParams;
}

export function ScoutAssignments() {
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    component={ScoutAssignmentsMain}
                    options={{
                        title: "Scout Assignments",
                        headerShown: false,
                    }}
                    name={"Main"}
                />
                <Stack.Screen
                    component={ScoutAssignmentsSpreadsheet}
                    options={{
                        // show the back button, but not the header
                        headerBackTitle: "Back",
                        headerTitle: "",
                    }}
                    name={"Spreadsheet"}
                />
            </Stack.Navigator>
        </>
    );
}
