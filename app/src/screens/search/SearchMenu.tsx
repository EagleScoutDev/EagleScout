import { SearchMain } from "./SearchMain";

import { TeamViewer, type TeamViewerParams } from "./TeamViewer";
import { ReportsForTeam, type ReportsForTeamParams } from "./ReportsForTeam";
import { AutoPathsForTeam, type AutoPathsForTeamParams } from "./AutoPathsForTeam";
import { SearchModal, type SearchModalParams } from "./SearchModal";
import { CompareTeams, type CompareTeamsParams } from "./CompareTeams";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Platform } from "react-native";

const Stack = createNativeStackNavigator<SearchMenuParamList>();
export type SearchMenuScreenProps<K extends keyof SearchMenuParamList> = NativeStackScreenProps<SearchMenuParamList, K>;
export type SearchMenuParamList = {
    Main: undefined;
    SearchModal: SearchModalParams;

    TeamViewer: TeamViewerParams;
    TeamReports: ReportsForTeamParams;
    AutoPaths: AutoPathsForTeamParams;
    CompareTeams: CompareTeamsParams;
};

export function SearchMenu() {
    return (
        <Stack.Navigator initialRouteName={"Main"}>
            <Stack.Screen
                name="Main"
                component={SearchMain}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SearchModal"
                component={SearchModal}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Group
                screenOptions={{
                    headerTitle: "",
                    headerBackTitle: "Back",
                    headerTransparent: Platform.OS === "ios",
                }}
            >
                <Stack.Screen name="TeamViewer" component={TeamViewer} />
                <Stack.Screen name="TeamReports" component={ReportsForTeam} />
                <Stack.Screen name="AutoPaths" component={AutoPathsForTeam} />
                <Stack.Screen name="CompareTeams" component={CompareTeams} />
            </Stack.Group>
        </Stack.Navigator>
    );
}
