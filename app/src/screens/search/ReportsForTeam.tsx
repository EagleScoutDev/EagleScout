import { View } from "react-native";
import { UIText } from "../../ui/UIText";
import { ReportList } from "../../components/ReportList";
import { useEffect, useState } from "react";
import { CompetitionsDB } from "../../database/Competitions";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import { NotesDB, type NoteWithMatch } from "../../database/ScoutNotes";
import { UITabs } from "../../ui/UITabs";
import { NoteList } from "../../components/NoteList";
import { type PitReportReturnData, PitReportsDB } from "../../database/ScoutPitReports";
import { PitScoutReportList } from "../../components/PitScoutReportList";
import type { SearchMenuScreenProps } from "./SearchMenu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
    const [tab, setTab] = useState<string>("Scout Reports");
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
                console.log("scout reports for team " + team_number + " : " + reports);
                console.log("no reports? " + (reports.length === 0));
            });
            PitReportsDB.getReportsForTeamAtCompetition(team_number, competition.id).then((reports) => {
                console.log("pit reports for team " + team_number + " : " + reports);
                setPitResponses(reports);
            });
            NotesDB.getNotesForTeamAtCompetition(team_number, competition.id).then((n) => {
                console.log("notes for team " + team_number + " : " + JSON.stringify(n));
                setNotes(n);
            });
        });
    }, [team_number]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UITabs tabs={["Scout Reports", "Notes", "Pit Reports"]} selectedTab={tab} setSelectedTab={setTab} />
                {tab === "Scout Reports" && (
                    <View style={{ flex: 1 }}>
                        <UIText size={25} bold style={{ paddingLeft: "5%", marginVertical: "5%" }}>
                            Reports for Team #{team_number}
                        </UIText>
                        <ReportList
                            reports={scoutReports ?? []}
                            reportsAreOffline={false}
                            expandable={false}
                            displayHeaders={false}
                        />
                    </View>
                )}
                {tab === "Notes" && (
                    <View style={{ flex: 1 }}>
                        <UIText size={25} bold style={{ paddingLeft: "5%", marginTop: "5%" }}>
                            Notes for Team #{team_number}
                        </UIText>
                        <NoteList notes={notes} />
                    </View>
                )}
                {tab === "Pit Reports" && (
                    <View style={{ flex: 1 }}>
                        <UIText size={25} bold style={{ paddingLeft: "5%", marginTop: "5%" }}>
                            Pit Scouting Reports for Team #{team_number}
                        </UIText>
                        <PitScoutReportList reports={pitResponses} isOffline={false} />
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
