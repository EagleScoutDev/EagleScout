import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { type PitReportReturnData, PitReportsDB } from "@/lib/database/ScoutPitReports";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UIRadio } from "@/ui/components/UIRadio";
import { UICheckboxes } from "@/ui/components/UICheckboxes";
import { UISheetModal } from "@/ui/components/UISheetModal";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export interface PitReportModalParams {
    report: PitReportReturnData;
}
export interface PitReportModal extends UISheetModal<PitReportModalParams> {}
export const PitReportModal = UISheetModal.HOC<PitReportModalParams>(function PitReportModalContent({
    ref,
    data: { report },
}) {
    "use memo";
    const { colors } = useTheme();
    const [sections, setSections] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    function transformStructure(structure: any[]) {
        const newStructure: any[] = [];
        let currentSection: {
            title: string;
            questions: any[];
        } | null = null;
        let currentIndice = 0;
        for (const item of structure) {
            if (item.type === "heading") {
                if (currentSection) {
                    newStructure.push(currentSection);
                }
                currentSection = {
                    title: item.text,
                    questions: [],
                };
            } else {
                if (currentSection) {
                    item.indice = currentIndice;
                    item.data = report.data[currentIndice];
                    item.isEven = currentIndice % 2 === 0;
                    currentSection.questions.push(item);
                    currentIndice++;
                }
            }
        }
        newStructure.push(currentSection);
        return newStructure;
    }
    useEffect(() => {
        setSections(transformStructure(report.formStructure));
        PitReportsDB.getImagesForReport(report.teamNumber, report.reportId).then((images) => {
            setImages(images);
        });
    }, [report]);
    const styles = StyleSheet.create({
        container: {
            alignSelf: "center",
            backgroundColor: colors.bg0.hex,
            padding: "5%",
            // marginTop: '8%',
            height: "100%",
            width: "100%",
        },
        section_title: {
            textAlign: "center",
            margin: "6%",
        },
        no_info: {
            flexWrap: "wrap",
            flex: 1,
        },
        question: {
            flex: 1,
            paddingBottom: 5,
        },
        image_list: {
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },
        image: {
            width: 200,
            height: 250,
        },
    });

    return (
        <>
            <UISheetModal.Header
                title={"Pit Report"}
                right={[
                    {
                        text: "Close",
                        icon: { ios: "xmark" },
                        onPress: () => ref.current?.dismiss(),
                    },
                ]}
            />
            <BottomSheetScrollView>
                <View
                    style={{
                        borderRadius: 10,
                        padding: "5%",
                        alignItems: "center",
                    }}
                >
                    <UIText size={30} bold style={{ marginTop: 10, marginBottom: 5 }}>
                        Team #{report.teamNumber}
                    </UIText>
                    <UIText>By: {report.submittedName}</UIText>
                    <UIText>{report.createdAt.toLocaleString()}</UIText>
                </View>
                {sections.map((sec, index) => (
                    <View key={index}>
                        <UIText size={18} bold underline style={styles.section_title}>
                            {sec.title}
                        </UIText>
                        {sec.questions.map((field) => (
                            <View
                                style={{
                                    flexDirection:
                                        field.type === "radio" ||
                                        field.type === "textbox" ||
                                        field.type === "checkboxes"
                                            ? "column"
                                            : "row",
                                    justifyContent: "space-between",
                                    backgroundColor: field.isEven ? colors.border.hex : "transparent",
                                    padding: 10,
                                    margin: 5,
                                    borderRadius: 10,
                                }}
                            >
                                <UIText size={15} bold style={styles.question}>
                                    {field.question}
                                </UIText>
                                {field.type === "radio" && (
                                    <View>
                                        <UIRadio
                                            title={""}
                                            colors={colors}
                                            options={field.options}
                                            value={field.options[field.data]}
                                            disabled={true}
                                        />
                                    </View>
                                )}
                                {field.type === "checkboxes" && (
                                    <>
                                        <UICheckboxes
                                            title={""}
                                            disabled={true}
                                            colors={colors}
                                            options={field.options}
                                            value={report.data[field.indice]}
                                        />
                                    </>
                                )}
                                {field.type !== "radio" && field.type !== "checkboxes" && (
                                    <UIText
                                        size={15}
                                        bold
                                        color={colors.primary}
                                        style={{
                                            flex: 1,
                                            textAlign: field.type === "textbox" ? "left" : "center",
                                            alignSelf: field.type === "textbox" ? "flex-start" : "center",
                                        }}
                                    >
                                        {field.data.toString()}
                                    </UIText>
                                )}
                                {(field.data == null || field.data === "") && (
                                    <UIText size={15} bold color={colors.danger} style={styles.no_info}>
                                        N/A
                                    </UIText>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
                <UIText size={18} bold underline style={styles.section_title}>
                    Images
                </UIText>
                <FlatList
                    style={styles.image_list}
                    data={images}
                    renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
                    // keyExtractor={item => item}
                    horizontal={true}
                />
            </BottomSheetScrollView>
        </>
    );
});
