import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useStackThemeConfig } from "@/ui/lib/theme/native";

import { ManageCompetitions } from "./(admin)/competitions/ManageCompetitions";
import { ManageUsers } from "./(admin)/ManageUsers";
import { ManageBets } from "@/navigation/tabs/data/(admin)/ManageBets";
import { ScoutcoinLedger } from "./(scoutcoin)/ScoutcoinLedger";
import { ScoutcoinLeaderboard } from "./(scoutcoin)/ScoutcoinLeaderboard";
import { ScoutcoinShop } from "./(scoutcoin)/shop/ScoutcoinShop";
import { WeightedRank } from "./(rank)/WeightedRank";
import { MatchPredictor } from "./(predictor)/MatchPredictor";
import { ExportReports } from "./(export)/ExportReports";
import { FormCreator, type FormCreatorParams } from "./(admin)/forms/creator/FormCreator";
import { FormList } from "./(admin)/forms/list/FormList";
import {
    ScoutAssignmentsSpreadsheet,
    type ScoutAssignmentsSpreadsheetParams,
} from "./(admin)/assignments/ScoutAssignmentsSpreadsheet";
import { ScoutAssignmentsMain } from "./(admin)/assignments/ScoutAssignmentsMain";
import { PicklistCreator, type PicklistCreatorParams } from "./(picklist)/PicklistCreator";
import { Picklists } from "./(picklist)/Picklists";
import { TeamRankMenu } from "./(rank)/TeamRankMenu";
import { TeamRankView } from "./(rank)/TeamRankView";
import { DataTabMain } from "./DataTabMain";

const Stack = createNativeStackNavigator<DataTabParamList>();
export type DataTabScreenProps<K extends keyof DataTabParamList> = NativeStackScreenProps<
    DataTabParamList,
    K
>;
export type DataTabParamList = {
    Main: undefined;

    Picklists: undefined;
    "Picklists/Create": PicklistCreatorParams;
    TeamRank: undefined;
    "TeamRank/View": {
        compId: number;
        compName?: string | undefined;
        questionIndex: number;
        questionText: string;
    };
    WeightedTeamRank: undefined;
    MatchPredictor: undefined;
    ExportCSV: undefined;

    ScoutcoinLeaderboard: undefined;
    ScoutcoinLedger: undefined;
    ScoutcoinShop: undefined;

    ManageCompetitions: undefined;
    ManageUsers: undefined;
    Forms: undefined;
    "Forms/Edit": FormCreatorParams;
    ScoutAssignments: undefined;
    "ScoutAssignments/Table": ScoutAssignmentsSpreadsheetParams;
    ManageMatchBets: undefined;
};

export function DataTab() {
    return (
        <Stack.Navigator screenOptions={useStackThemeConfig()}>
            <Stack.Screen
                name="Main"
                component={DataTabMain}
                options={{
                    headerShown: false,
                }}
            />

            {/* Analysis */}
            <Stack.Screen
                name="Picklists"
                component={Picklists}
                options={{
                    title: "Picklists",
                }}
            />
            <Stack.Screen
                name="Picklists/Create"
                component={PicklistCreator}
                options={{
                    title: "New Picklist",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="TeamRank"
                component={TeamRankMenu}
                options={{
                    title: "Team Rank",
                }}
            />
            <Stack.Screen
                name="TeamRank/View"
                component={TeamRankView}
                options={({ route }) => ({
                    title: route.params.questionText,
                })}
            />
            <Stack.Screen
                name="WeightedTeamRank"
                component={WeightedRank}
                options={{
                    title: "Weighted Team Rank",
                }}
            />
            <Stack.Screen
                name="MatchPredictor"
                component={MatchPredictor}
                options={{
                    title: "Match Predictor",
                }}
            />
            <Stack.Screen
                name="ExportCSV"
                component={ExportReports}
                options={{
                    title: "Export to CSV",
                }}
            />

            {/* Scoutcoin */}
            <Stack.Screen
                name="ScoutcoinLeaderboard"
                component={ScoutcoinLeaderboard}
                options={{
                    title: "Scoutcoin",
                }}
            />
            <Stack.Screen
                name="ScoutcoinLedger"
                component={ScoutcoinLedger}
                options={{
                    title: "Scoutcoin",
                }}
            />
            <Stack.Screen
                name="ScoutcoinShop"
                component={ScoutcoinShop}
                options={{
                    title: "Shop",
                }}
            />

            {/* Administrative */}
            <Stack.Group>
                <Stack.Screen
                    name="ManageCompetitions"
                    component={ManageCompetitions}
                    options={{
                        title: "Competitions",
                    }}
                />
                <Stack.Screen
                    name="ManageUsers"
                    component={ManageUsers}
                    options={{
                        title: "Users",
                    }}
                />
                <Stack.Group screenOptions={{ title: "Forms" }}>
                    <Stack.Screen name="Forms" component={FormList} />
                    {/*<Stack.Screen name="Forms/View" component={FormViewer} />*/}
                    <Stack.Screen name="Forms/Edit" component={FormCreator} />
                </Stack.Group>
                <Stack.Group screenOptions={{ title: "Scout Assignments" }}>
                    <Stack.Screen name="ScoutAssignments" component={ScoutAssignmentsMain} />
                    <Stack.Screen
                        name="ScoutAssignments/Table"
                        component={ScoutAssignmentsSpreadsheet}
                    />
                </Stack.Group>
                <Stack.Screen
                    name="ManageMatchBets"
                    component={ManageBets}
                    options={{
                        title: "Match Bets",
                    }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}
