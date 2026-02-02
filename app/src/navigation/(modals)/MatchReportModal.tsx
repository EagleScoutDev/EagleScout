import { type MatchReportReturnData } from "@/lib/database/ScoutMatchReports";
import { useTheme } from "@/ui/context/ThemeContext";
import { Pressable, StyleSheet, View } from "react-native";
import { UIText } from "@/ui/components/UIText";
import React from "react";
import { supabase } from "@/lib/supabase";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Form } from "@/lib/forms";
import { FormQuestion } from "@/components/FormQuestion";
import { UIRadio } from "@/ui/components/UIRadio";
import { UICheckboxes } from "@/ui/components/UICheckboxes";
import { useQuery } from "@tanstack/react-query";
import { UITextInput } from "@/ui/components/UITextInput";
import { useRootNavigation } from "@/navigation";

export interface MatchReportModalParams {
    report: MatchReportReturnData;

    isOfflineForm: boolean;
}
export interface MatchReportModal extends UISheetModal<MatchReportModalParams> {}
export const MatchReportModal = UISheetModal.HOC<MatchReportModalParams>(
    function MatchReportModalContent({ ref, data: { report, isOfflineForm } }) {
        "use memo";

        const { colors } = useTheme();
        const s = StyleSheet.create({
            sectionTitle: {
                color: colors.fg.hex,
                fontSize: 18,
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 32,
                marginBottom: 8,
            },
            na: {
                color: colors.danger.hex,
                fontWeight: "bold",
                flexWrap: "wrap",
                fontSize: 15,
                flex: 1,
            },
        });

        // TODO: editing and history
        // const account = useUserStore((state) => state.account);
        // const { data: history } = useQuery({
        //     queryKey: ["matchReportHistory", report.reportId],
        //     queryFn: () => MatchReportsDB.getReportHistory(report.reportId),
        //     throwOnError: true,
        //     enabled: !isOfflineForm,
        // });
        const { data: authorName } = useQuery({
            queryKey: ["profiles", "username", report.userId],
            async queryFn() {
                const { error, data } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", report.userId)
                    .single();
                if (error) throw error;

                return data.name;
            },
            enabled: isOfflineForm,
        });

        // TODO: editing and history
        // const [editing, setEditing] = useState(false);
        // const canEdit = account && (
        //     isOfflineForm
        //     || account.id === report.userId
        //     || account.role === AccountRole.Admin
        // );

        return (
            <>
                <UISheetModal.Header
                    title={"Match Report"}
                    // TODO: editing and history
                    // left={[
                    //     {
                    //         text: "Edit",
                    //         icon: "square.and.pencil",
                    //         onPress: () => setEditing(true),
                    //     },
                    //     {
                    //         text: "History",
                    //         icon: "clock",
                    //         onPress: () => setEditing(true),
                    //     },
                    // ]}
                    right={[
                        {
                            role: "done",
                            onPress: () => ref.current?.dismiss(),
                        },
                    ]}
                />
                <BottomSheetFlatList
                    contentContainerStyle={{ padding: 16 }}
                    contentInsetAdjustmentBehavior={"automatic"}
                    ListHeaderComponent={<ReportMetadataView data={report} userName={authorName} />}
                    data={report.form}
                    keyExtractor={(_, index) => String(index)}
                    renderItem={({ item, index }) => {
                        const value = report.data[index];

                        switch (item.type) {
                            case Form.ItemType.heading:
                                return (
                                    <View>
                                        <UIText style={s.sectionTitle}>{item.title}</UIText>
                                    </View>
                                );

                            case Form.ItemType.radio:
                                return (
                                    <View style={{ padding: 8 }}>
                                        <FormQuestion
                                            title={item.question}
                                            required={item.required}
                                        >
                                            <UIRadio
                                                disabled
                                                options={item.options}
                                                value={item.options[value]}
                                            />
                                        </FormQuestion>
                                    </View>
                                );
                            case Form.ItemType.checkbox:
                                return (
                                    <View style={{ padding: 8 }}>
                                        <FormQuestion
                                            title={item.question}
                                            required={item.required}
                                        >
                                            <UICheckboxes
                                                disabled
                                                options={item.options}
                                                value={value ?? []}
                                            />
                                        </FormQuestion>
                                    </View>
                                );
                            case Form.ItemType.textbox:
                                return (
                                    <View style={{ padding: 8 }}>
                                        <FormQuestion
                                            title={item.question}
                                            required={item.required}
                                        >
                                            <UITextInput
                                                multiline
                                                disabled
                                                placeholder={"Type here"}
                                                value={report.data[index]}
                                            />
                                        </FormQuestion>
                                    </View>
                                );
                            case Form.ItemType.number:
                                return (
                                    <View
                                        style={{
                                            backgroundColor:
                                                index % 2 === 0 ? colors.bg1.hex : "transparent",
                                            padding: 8,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <FormQuestion
                                            inline
                                            title={item.question}
                                            required={item.required}
                                        >
                                            {value === null ? (
                                                <UIText style={s.na}>N/A</UIText>
                                            ) : (
                                                <UIText
                                                    style={{
                                                        color: colors.fg.hex,
                                                        fontWeight: "bold",
                                                        fontSize: 20,
                                                        marginLeft: "auto",
                                                        textAlign: "center",
                                                        paddingHorizontal: 32,
                                                    }}
                                                >
                                                    {value ?? ""}
                                                </UIText>
                                            )}
                                        </FormQuestion>
                                    </View>
                                );
                        }
                    }}
                />
            </>
        );
    },
);

function ReportMetadataView({
    data,
    userName,
}: {
    data: MatchReportReturnData;
    userName: string | null;
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
