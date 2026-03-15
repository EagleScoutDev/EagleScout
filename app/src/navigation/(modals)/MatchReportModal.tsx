import { type MatchReportReturnData } from "@/lib/database/ScoutMatchReports";
import { FlatList, Pressable, View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import React from "react";
import { FormDataView } from "@/navigation/(modals)/components/FormDataView";
import { useRootNavigation } from "@/navigation/hooks";
import { type RootStackScreenProps } from "@/navigation";
import { useStackToolbar } from "@/ui/lib/toolbar";

export interface MatchReportModalParams {
    report: MatchReportReturnData;

    isOfflineForm: boolean;
}
export interface MatchReportModalProps extends RootStackScreenProps<"MatchReportModal"> {}
export function MatchReportModal({ navigation, route }: MatchReportModalProps) {
    const { report, isOfflineForm } = route.params;

    useStackToolbar(navigation, "infoSheet", {});

    // TODO: editing and history
    // const account = useUserStore((state) => state.account);
    // const { data: history } = useQuery({
    //     queryKey: ["matchReportHistory", report.reportId],
    //     queryFn: () => MatchReportsDB.getReportHistory(report.reportId),
    //     throwOnError: true,
    //     enabled: !isOfflineForm,
    // });

    // TODO: editing and history
    // const [editing, setEditing] = useState(false);
    // const canEdit = account && (
    //     isOfflineForm
    //     || account.id === report.userId
    //     || account.role === AccountRole.Admin
    // );

    return (
        <FormDataView
            FlatList={FlatList}
            form={report.form}
            data={report.data}
            ListHeaderComponent={<ReportMetadataView data={report} userName={report.userName} />}
        />
    );
}

function ReportMetadataView({
    data,
    userName,
}: {
    data: MatchReportReturnData;
    userName: string | undefined;
}) {
    const navigation = useRootNavigation();

    return (
        <View style={{ alignItems: "center" }}>
            <Pressable
                style={{ flexDirection: "row", justifyContent: "center" }}
                onPress={() => {
                    navigation.navigate("TeamSummary", {
                        teamId: data.teamNumber,
                        competitionId: data.competitionId,
                    });
                }}
            >
                <UIText size={30} bold>
                    Team #{data.teamNumber}
                </UIText>
            </Pressable>
            <UIText>
                Round {data.matchNumber} of {data.competitionName}
            </UIText>
            {userName !== null && <UIText>Submitted by {userName}</UIText>}
            <UIText>{new Date(data.createdAt).toLocaleString()}</UIText>
        </View>
    );
}
