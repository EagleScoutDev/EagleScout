import { FlatList, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { type PitReportReturnData, PitReportsDB } from "@/lib/database/ScoutPitReports";
import * as Bs from "@/ui/icons";
import { useTheme } from "@/ui/context/ThemeContext";
import { UIText } from "@/ui/components/UIText";
import { UIRadio } from "@/ui/components/UIRadio";
import { UICheckboxes } from "@/ui/components/UICheckboxes";

interface PitScoutViewerProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    data: PitReportReturnData;
}
export function PitScoutViewer({ visible, setVisible, data }: PitScoutViewerProps) {
    const { colors } = useTheme();
    const [sections, setSections] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const transformStructure = (structure: any[]) => {
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
                    item.data = data.data[currentIndice];
                    item.isEven = currentIndice % 2 === 0;
                    currentSection.questions.push(item);
                    currentIndice++;
                }
            }
        }
        newStructure.push(currentSection);
        return newStructure;
    };
    useEffect(() => {
        if (!data) {
            return;
        }
        console.log(JSON.stringify(data), JSON.stringify(transformStructure(data.formStructure)));
        setSections(transformStructure(data.formStructure));
        PitReportsDB.getImagesForReport(data.teamNumber, data.reportId).then((images) => {
            setImages(images);
        });
    }, [data]);
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
    if (!data) {
        return <></>;
    }
    // @ts-ignore
    return (
        <Modal animationType="slide" visible={visible} transparent={true} presentationStyle={"overFullScreen"}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "5%",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={{
                                flex: 1,
                                alignItems: "flex-end",
                            }}
                        >
                            <Bs.X
                                style={{
                                    padding: "2%",
                                    width: 40,
                                    height: 40,
                                    fill: colors.danger.hex,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View
                            style={{
                                borderRadius: 10,
                                padding: "5%",
                                alignItems: "center",
                            }}
                        >
                            <UIText size={30} bold style={{ marginTop: 10, marginBottom: 5 }}>
                                Team #{data.teamNumber}
                            </UIText>
                            <UIText>By: {data.submittedName}</UIText>
                            <UIText>{data.createdAt.toLocaleString()}</UIText>
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
                                                    value={data.data[field.indice]}
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
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
