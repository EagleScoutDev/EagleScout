import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import { BrowseTabMain } from "./BrowseTabMain";
import { TeamSummary, type TeamSummaryParams } from "./(team)/TeamSummary";
import { TeamReports, type TeamReportsParams } from "./(team)/TeamReports";
import { TeamAutoPaths, type TeamAutoPathsParams } from "./(team)/TeamAutoPaths";
import { SearchModal, type SearchModalParams } from "./SearchModal";
import { CompareTeams, type CompareTeamsParams } from "./(team)/components/CompareTeams";

const Stack = createNativeStackNavigator<BrowseTabParamList>();
export type BrowseTabScreenProps<K extends keyof BrowseTabParamList> = NativeStackScreenProps<BrowseTabParamList, K>;
export type BrowseTabParamList = {
    Main: undefined;
    SearchModal: SearchModalParams;

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
