import { SearchMain } from "./SearchMain";

import { TeamViewer, type TeamViewerParams } from "./TeamViewer";
import { ReportsForTeam, type ReportsForTeamParams } from "./ReportsForTeam";
import { AutoPathsForTeam, type AutoPathsForTeamParams } from "./AutoPathsForTeam";
import { useTheme } from "@react-navigation/native";
import { SearchModal, type SearchModalParams } from "./SearchModal";
import { CompareTeams, type CompareTeamsParams } from "./CompareTeams";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<SearchMenuParamList>();
export type SearchMenuScreenProps<K extends keyof SearchMenuParamList> = NativeStackScreenProps<SearchMenuParamList, K>;
export type SearchMenuParamList = {
    Main: undefined;
    TeamViewer: TeamViewerParams;
    TeamReports: ReportsForTeamParams;
    AutoPaths: AutoPathsForTeamParams;
    SearchModal: SearchModalParams;
    CompareTeams: CompareTeamsParams;
};

export function SearchMenu() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="Main"
                component={SearchMain}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="TeamViewer"
                component={TeamViewer}
                options={{
                    title: "Team Viewer",
                    // show the back button, but not the header
                    headerBackTitle: "Back",
                    headerTitle: "",
                }}
            />
            <Stack.Screen
                name="TeamReports"
                component={ReportsForTeam}
                options={{
                    title: "Reports for Team",
                    headerBackTitle: "Back",
                    headerTitle: "",
                }}
            />
            <Stack.Screen
                name="AutoPaths"
                component={AutoPathsForTeam}
                options={{
                    title: "Auto Paths",
                    headerBackTitle: "Back",
                    headerTitle: "",
                }}
            />
            <Stack.Screen
                name="SearchModal"
                component={SearchModal}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="CompareTeams"
                component={CompareTeams}
                options={{
                    title: "Compare Teams",
                    headerBackTitle: "Back",
                    headerTitle: "",
                }}
            />
        </Stack.Navigator>
    );
}
