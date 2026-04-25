import { MatchReportList } from "@/components/MatchReportList";
import { NoteList } from "@/components/NoteList";
import { PitReportList } from "@/components/PitReportList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type { RootStackScreenProps } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

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
export interface TeamReportsProps extends RootStackScreenProps<"TeamReports"> {}
export function TeamReports({
    route: {
        params: { team_number, competitionId },
    },
}: TeamReportsProps) {
    const { data: scoutReports = [] } = useQuery(
        queries.matchReports.forTeamAtComp({ teamNumber: team_number, compId: competitionId }),
    );
    const { data: pitResponses = [] } = useQuery(
        queries.pitReports.forTeamAtComp({ teamNumber: team_number, compId: competitionId }),
    );
    const { data: notes = [] } = useQuery(
        queries.notes.forTeamAtComp({ teamNumber: team_number, compId: competitionId }),
    );

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Match"
                options={{
                    title: "Matches",
                }}
                children={() => (
                    <MatchReportList reports={scoutReports} reportsAreOffline={false} />
                )}
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
    );
}
