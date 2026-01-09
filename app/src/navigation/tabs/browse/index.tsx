import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import { TeamSummary, type TeamSummaryParams } from "./(team)/TeamSummary";
import { TeamReports, type TeamReportsParams } from "./(team)/TeamReports";
import { TeamAutoPaths, type TeamAutoPathsParams } from "./(team)/TeamAutoPaths";
import { CompareTeams, type CompareTeamsParams } from "./(team)/components/CompareTeams";
import { BrowseTabMain } from "@/navigation/tabs/browse/BrowseTabMain";

const Stack = createNativeStackNavigator<BrowseTabParamList>();
export type BrowseTabScreenProps<K extends keyof BrowseTabParamList> = NativeStackScreenProps<BrowseTabParamList, K>;
export type BrowseTabParamList = {
    Main: undefined;

    TeamViewer: TeamSummaryParams;
    TeamReports: TeamReportsParams;
    AutoPaths: TeamAutoPathsParams;
    CompareTeams: CompareTeamsParams;
};

export function BrowseTab() {
    return (
        <Stack.Navigator initialRouteName={"Main"} screenOptions={useStackThemeConfig()}>
            <Stack.Screen
                name="Main"
                component={BrowseTabMain}
                options={{
                    headerTitle: "",
                }}
            />

            <Stack.Group
                screenOptions={{
                    headerTitle: "",
                    ...(Platform.OS === "ios" ? { headerTransparent: true, headerStyle: {} } : {}),
                }}
            >
                <Stack.Screen name="TeamViewer" component={TeamSummary} />
                <Stack.Screen name="AutoPaths" component={TeamAutoPaths} />
                <Stack.Screen name="CompareTeams" component={CompareTeams} />
            </Stack.Group>

            <Stack.Screen
                name="TeamReports"
                component={TeamReports}
                options={({ route: { params } }) => ({
                    title: `Scouting for Team ${params.team_number}`,
                    headerBackButtonDisplayMode: "minimal",
                })}
            />
        </Stack.Navigator>
    );
}
