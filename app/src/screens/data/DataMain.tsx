import { useTheme, type NavigatorScreenParams } from "@react-navigation/native";
import { DataHome } from "./DataHome";
import { ManageCompetitions } from "../admin/ManageCompetitions";
import { ManageUsers } from "../admin/ManageUsers";
import { ScoutAssignments } from "../admin/assignments/ScoutAssignments";
import { ManageBets } from "../scoutcoin/betting/admin/ManageBets";
import { ScoutcoinLedger } from "../scoutcoin/ScoutcoinLedger";
import { ScoutcoinLeaderboard } from "../scoutcoin/ScoutcoinLeaderboard";
import { ScoutcoinShop } from "../scoutcoin/shop/ScoutcoinShop";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { PicklistsMenu, type PicklistParamList } from "./analysis/picklist/PicklistMenu";
import { DataAggregation } from "./analysis/rank/DataAggregation";
import { WeightedRank } from "./analysis/rank/WeightedRank";
import { MatchPredictor } from "./analysis/predictor/MatchPredictor";
import { FormCreation } from "../form-creator/FormCreation";
import { ExportToCSV } from "./export/ExportToCSV";
import { MatchBetting } from "../scoutcoin/betting/MatchBetting";
import { MatchBettingNavigator } from "../scoutcoin/betting/MatchBettingNavigator";

const DataStack = createNativeStackNavigator<DataMenuParamList>();
export type DataMenuScreenProps<K extends keyof DataMenuParamList> = NativeStackScreenProps<DataMenuParamList, K>;
export type DataMenuParamList = {
    Home: undefined;

    Picklist: NavigatorScreenParams<PicklistParamList>;
    TeamRank: undefined;
    WeightedTeamRank: undefined;
    MatchPredictor: undefined;
    ExportCSV: undefined;

    MatchBetting: undefined;
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
                name="MatchBetting"
                component={MatchBettingNavigator}
                options={{
                    title: "Match Betting",
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
                component={ManageCompetitions}
                options={{
                    title: "Manage Competitions",
                    headerBackTitle: "Back",
                }}
            />
            <DataStack.Screen
                name="ManageUsers"
                component={ManageUsers}
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
