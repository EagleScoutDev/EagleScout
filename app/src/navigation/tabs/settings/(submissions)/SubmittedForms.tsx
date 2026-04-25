import { useEffect, useState } from "react";
import { MatchReportList } from "@/components/MatchReportList";
import { type MatchReportReturnData, MatchReportsDB } from "@/lib/db/models/ScoutMatchReport";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";

export function SubmittedForms({ route }: SettingsTabScreenProps<"Scout/ViewReports">) {
    const { competitionId } = route.params;

    const [reports, setReports] = useState<MatchReportReturnData[]>([]);

    async function refresh() {
        setReports(await MatchReportsDB.getReportsForSelf(competitionId));
    }
    useEffect(() => void refresh(), [competitionId]);

    return (
        <SafeAreaProvider>
            <MatchReportList reports={reports} reportsAreOffline={false} />
        </SafeAreaProvider>
    );
}
