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
import { ManageForms } from "../forms/ManageForms.tsx";
import { ExportToCSV } from "./export/ExportToCSV";
import { MatchBetting } from "../scoutcoin/betting/MatchBetting";
import { MatchBettingNavigator } from "../scoutcoin/betting/MatchBettingNavigator";

const Stack = createNativeStackNavigator<DataMenuParamList>();
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
        <Stack.Navigator
            screenOptions={{
                headerBackTitle: "Back",
                headerStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={DataHome}
                options={{
                    headerShown: false,
                }}
            />

            {/* Analysis */}
            <Stack.Screen
                name="Picklist"
                component={PicklistsMenu}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="TeamRank"
                component={DataAggregation}
                options={{
                    title: "Team Rank",
                }}
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
                component={ExportToCSV}
                options={{
                    title: "Export to CSV",
                }}
            />
            <Stack.Screen
                name="MatchBetting"
                component={MatchBettingNavigator}
                options={{
                    title: "Match Betting",
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
                <Stack.Screen
                    name="ManageForms"
                    component={ManageForms}
                    options={{
                        title: "Forms",
                    }}
                />
                <Stack.Screen
                    name="ManageScoutAssignments"
                    component={ScoutAssignments}
                    options={{
                        title: "Scout Assignments",
                    }}
                />
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
};
