import { ScoutAssignmentsSpreadsheet } from './ScoutAssignmentsSpreadsheet';
import {createStackNavigator} from '@react-navigation/stack';
import { ScoutAssignmentsMain } from './ScoutAssignmentsMain';

const Stack = createStackNavigator();

export function ScoutAssignments() {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          component={ScoutAssignmentsMain}
          options={{
            headerShown: false,
          }}
          name={'Scout Assignments Main'}
        />
        <Stack.Screen
          component={ScoutAssignmentsSpreadsheet}
          options={{
            // show the back button, but not the header
            headerBackTitle: 'Back',
            headerTitle: '',
          }}
          name={'Scout Assignments Spreadsheet'}
        />
      </Stack.Navigator>
    </>
  );
};
