import { MatchReportList } from "@/components/MatchReportList";
import { useEffect, useState } from "react";
import { CompetitionsDB } from "@/lib/database/Competitions";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/database/ScoutMatchReports";
import { NotesDB, type NoteWithMatch } from "@/lib/database/ScoutNotes";
import { NoteList } from "@/components/NoteList";
import { type PitReportReturnData, PitReportsDB } from "@/lib/database/ScoutPitReports";
import { PitReportList } from "@/components/PitReportList";
import type { BrowseTabScreenProps } from "../index";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator<ReportsForTeamParamList>();
type ReportsForTeamParamList = {
    Match: undefined;
    Note: undefined;
    Pit: undefined;
};

export interface TeamReportsParams {
    team_number: number;
    competitionId: number;
}
export interface TeamReportsProps extends BrowseTabScreenProps<"TeamReports"> {}
export function TeamReports({
    route: {
        params: { team_number, competitionId },
    },
}: TeamReportsProps) {
    const [scoutReports, setScoutReports] = useState<MatchReportReturnData[] | null>(null);
    const [notes, setNotes] = useState<NoteWithMatch[]>([]);
    const [pitResponses, setPitResponses] = useState<PitReportReturnData[] | null>(null);

    useEffect(() => {
        CompetitionsDB.getCompetitionById(competitionId).then((competition) => {
            if (!competition) return;

            MatchReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then(setScoutReports);
            PitReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then(setPitResponses);
            NotesDB.getNotesForTeamAtCompetition(team_number, competition.id).then(setNotes);
        });
    }, [competitionId, team_number]);

    return (
        <SafeAreaProvider>
            <Tab.Navigator>
                <Tab.Screen
                    name="Match"
                    options={{
                        title: "Matches",
                    }}
                    children={() => <MatchReportList reports={scoutReports ?? []} reportsAreOffline={false} />}
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
                    children={() => <PitReportList reports={pitResponses} isOffline={false} />}
                />
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}
