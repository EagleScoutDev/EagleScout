import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { type MatchReportReturnData, MatchReportsDB } from "../../database/ScoutMatchReports";
import { ReportList } from "../../components/ReportList";
import type { CompetitionReturnData } from "../../database/Competitions";

export interface ScoutingReportsListProps {
    competition: CompetitionReturnData;
}
export function ScoutingReportsList({ competition }: ScoutingReportsListProps) {
    /**
     * reports is an array of objects, each object is a report
     * {
     *     id: number, // scout_report id
     *     team: number,
     *     match_number: number
     * }
     */
    const [reports, setReports] = useState<MatchReportReturnData[]>([]);
    const [reportsLoading, setReportsLoading] = useState(true);

    useEffect(() => {
        MatchReportsDB.getReportsForCompetition(competition.id).then((reports) => {
            console.log("number of reports: " + reports.length);
            setReports(reports);
            setReportsLoading(false);
        });
    }, [competition]);
    if (reportsLoading) {
        return <ActivityIndicator />;
    }
    return <ReportList reports={reports} isOffline={false} expandable={false} displayHeaders={false} />;
}
