import { useTheme, type NavigatorScreenParams } from "@react-navigation/native";
import { DataHome } from "./DataHome.tsx";
import { CompetitionsView } from "../competitions-flow/CompetitionsView.tsx";
import { UserManager } from "./manage/UserManager.tsx";
import { ScoutAssignments } from "../scout-assignments-flow/ScoutAssignments.tsx";
import { ManageBets } from "../match-betting-flow/admin/ManageBets.tsx";
import { ScoutcoinLedger } from "../scoutcoin/ScoutcoinLedger.tsx";
import { ScoutcoinLeaderboard } from "../scoutcoin/ScoutcoinLeaderboard.tsx";
import { ScoutcoinShop } from "../scoutcoin/ScoutcoinShop.tsx";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { PicklistsMenu, type PicklistParamList } from "./analysis/picklist/PicklistMenu.tsx";
import { DataAggregation } from "./analysis/rank/DataAggregation.tsx";
import { WeightedRank } from "./analysis/rank/WeightedRank.tsx";
import { MatchPredictor } from "./analysis/predictor/MatchPredictor.tsx";
import { FormCreation } from "../form-creator/FormCreation.tsx";
import { ExportToCSV } from "./export/ExportToCSV.tsx";

const DataStack = createNativeStackNavigator<DataMenuParamList>();
export type DataMenuScreenProps<K extends keyof DataMenuParamList> = NativeStackScreenProps<DataMenuParamList, K>;
export type DataMenuParamList = {
    Home: undefined;

    Picklist: NavigatorScreenParams<PicklistParamList>;
    TeamRank: undefined;
    WeightedTeamRank: undefined;
    MatchPredictor: undefined;
    ExportCSV: undefined;

    ScoutcoinLeaderboard: undefined;
    ScoutcoinLedger: undefined;
    ScoutcoinShop: undefined;

    ManageCompetitions: undefined;
    ManageUsers: undefined;
    ManageForms: undefined;
    ManageScoutAssignments: undefined;
    ManageMatchBets: undefined;
};

export const DataMain = () => {
    const { colors } = useTheme();

    return (
        <DataStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <DataStack.Screen
                name="Home"
                component={DataHome}
                options={{
                    headerShown: false,
                }}
            />
            <DataStack.Screen
                name="Picklist"
                component={PicklistsMenu}
                options={{
                    headerShown: false,
                }}
            />
            <DataStack.Screen
                name="TeamRank"
                component={DataAggregation}
                options={{
                    title: "Team Rank",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="WeightedTeamRank"
                component={WeightedRank}
                options={{
                    title: "Weighted Team Rank",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="MatchPredictor"
                component={MatchPredictor}
                options={{
                    title: "Match Predictor",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ExportCSV"
                component={ExportToCSV}
                options={{
                    title: "Export to CSV",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ScoutcoinLeaderboard"
                component={ScoutcoinLeaderboard}
                options={{
                    title: "Scoutcoin Leaderboard",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ScoutcoinLedger"
                component={ScoutcoinLedger}
                options={{
                    title: "Scoutcoin Ledger",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ScoutcoinShop"
                component={ScoutcoinShop}
                options={{
                    title: "Scoutcoin Shop",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageCompetitions"
                component={CompetitionsView}
                options={{
                    title: "Manage Competitions",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageUsers"
                component={UserManager}
                options={{
                    title: "Manage Users",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageForms"
                component={FormCreation}
                options={{
                    title: "Manage Forms",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageScoutAssignments"
                component={ScoutAssignments}
                options={{
                    title: "Manage Scout Assignments",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageMatchBets"
                component={ManageBets}
                options={{
                    title: "Manage Match Bets",
                    headerBackTitle: "Back",
                }}
            />
        </DataStack.Navigator>
    );
};
