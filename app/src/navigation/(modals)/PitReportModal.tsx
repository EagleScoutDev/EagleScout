import { FlatList, Pressable, View } from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { type PitReportReturnData, PitReportsDB } from "@/lib/database/ScoutPitReports";
import { UIText } from "@/ui/components/UIText";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FormDataView } from "@/navigation/(modals)/components/FormDataView";
import { useRootNavigation } from "@/navigation";

export interface PitReportModalParams {
    report: PitReportReturnData;
}
export interface PitReportModal extends UISheetModal<PitReportModalParams> {}
export const PitReportModal = UISheetModal.HOC<PitReportModalParams>(
    function PitReportModalContent({ ref, data: { report } }) {
        "use memo";

        const [images, setImages] = useState<string[]>([]);
        useEffect(() => {
            PitReportsDB.getImagesForReport(report.teamNumber, report.reportId).then((images) => {
                setImages(images);
            });
        }, [report]);

        return (
            <>
                <UISheetModal.Header
                    title={"Pit Report"}
                    right={[
                        {
                            role: "done",
                            onPress: () => ref.current?.dismiss(),
                        },
                    ]}
                />
                <FormDataView
                    FlatList={BottomSheetFlatList}
                    form={report.formStructure}
                    data={report.data}
                    ListHeaderComponent={<ReportMetadataView data={report} userName={report.submittedName} />}
                    ListFooterComponent={<ReportImagesView images={images} />}
                />
            </>
        );
    },
);

function ReportMetadataView({
    data,
    userName,
}: {
    data: PitReportReturnData;
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
            {userName !== null && <UIText>Submitted by {userName}</UIText>}
            <UIText>{new Date(data.createdAt).toLocaleString()}</UIText>
        </View>
    );
}

function ReportImagesView({ images }: { images: string[] }) {
    return (
        <>
            <UIText
                size={18}
                bold
                underline
                style={{
                    textAlign: "center",
                    margin: "6%",
                }}
            >
                Images
            </UIText>
            <FlatList
                style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                }}
                data={images}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{
                            width: 200,
                            height: 250,
                        }}
                    />
                )}
                // keyExtractor={item => item}
                horizontal={true}
            />
        </>
    );
}
