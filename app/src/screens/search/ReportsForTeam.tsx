import { ReportList } from "../../components/ReportList";
import { useEffect, useState } from "react";
import { CompetitionsDB } from "../../database/Competitions";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import { NotesDB, type NoteWithMatch } from "../../database/ScoutNotes";
import { NoteList } from "../../components/NoteList";
import { type PitReportReturnData, PitReportsDB } from "../../database/ScoutPitReports";
import { PitScoutReportList } from "../../components/PitScoutReportList";
import type { SearchMenuScreenProps } from "./SearchMenu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator<ReportsForTeamParamList>();
type ReportsForTeamParamList = {
    Match: undefined;
    Note: undefined;
    Pit: undefined;
};

export interface ReportsForTeamParams {
    team_number: number;
    competitionId: number;
}
export interface ReportsForTeamProps extends SearchMenuScreenProps<"TeamReports"> {}
export function ReportsForTeam({
    route: {
        params: { team_number, competitionId },
    },
}: ReportsForTeamProps) {
    const [scoutReports, setScoutReports] = useState<MatchReportReturnData[] | null>(null);
    const [notes, setNotes] = useState<NoteWithMatch[]>([]);
    const [pitResponses, setPitResponses] = useState<PitReportReturnData[] | null>(null);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then((competition) => {
            if (!competition) {
                return;
            }
            MatchReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then((reports) => {
                setScoutReports(reports);
            });
            PitReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then((reports) => {
                setPitResponses(reports);
            });
            NotesDB.getNotesForTeamAtCompetition(team_number, competition.id).then((n) => {
                setNotes(n);
            });
        });
    }, [team_number]);

    return (
        <SafeAreaProvider>
            <Tab.Navigator>
                <Tab.Screen
                    name="Match"
                    options={{
                        title: "Matches",
                    }}
                    children={() => <ReportList reports={scoutReports ?? []} reportsAreOffline={false} />}
                />

                <Tab.Screen
                    name="Note"
                    options={{
                        title: "Notes",
                    }}
                    children={() => <NoteList notes={notes} />}
                />

                <Tab.Screen
                    name="Pit"
                    options={{
                        title: "Pit Reports",
                    }}
                    children={() => <PitScoutReportList reports={pitResponses} isOffline={false} />}
                />
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}
