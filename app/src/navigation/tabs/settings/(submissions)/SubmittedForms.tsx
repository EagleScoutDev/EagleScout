import { MatchReportList } from "@/components/MatchReportList";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export function SubmittedForms({ route }: SettingsTabScreenProps<"Scout/ViewReports">) {
    const { competitionId } = route.params;

    const { data: reports = [] } = useQuery(
        queries.matchReports.forSelf({ compId: competitionId }),
    );

    return (
        <SafeAreaProvider>
            <MatchReportList reports={reports} reportsAreOffline={false} />
        </SafeAreaProvider>
    );
}
