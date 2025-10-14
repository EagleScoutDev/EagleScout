import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { TeamInformation } from "../components/TeamInformation.tsx";
import { CompetitionsDB } from "../../../database/Competitions";
import { PitReportsDB, type PitReportWithoutId } from "../../../database/ScoutPitReports";
import { FormHelper } from "../../../FormHelper";
import * as Bs from "../../../ui/icons";
import type { ScoutMenuScreenProps } from "../ScoutingFlow";
import { launchCamera } from "react-native-image-picker";
import { UIButton, UIButtonStyle, UIButtonSize } from "../../../ui/UIButton.tsx";
import { Color } from "../../../lib/color.ts";
import { ReportFlowTab } from "../components/ReportFlowTab.tsx";
import { ReportFlowFormSection } from "../components/ReportFlowFormSection.tsx";
import { Form } from "../../../lib/forms";
import splitSections = Form.splitSections;

const Tab = createMaterialTopTabNavigator();
export type PitFlowScreenProps<K extends keyof PitFlowParamList> = MaterialTopTabScreenProps<PitFlowParamList, K>;
export type PitFlowParamList = {
    Match: undefined;
    Images: undefined;
    [k: `Form/${string}`]: undefined;
};

export interface PitFlowProps extends ScoutMenuScreenProps<"Pit"> {}
export function PitFlow({ navigation }: PitFlowProps) {
    const theme = useTheme();
    const colors = theme.colors;
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [images, setImages] = useState<string[]>(["plus"]);
    const [team, setTeam] = useState("");
    const [formData, setFormData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSections, setFormSections] = useState<any[]>([]);
    const [currentCompetition, setCurrentCompetition] = useState<any>();

    const [isOffline, setIsOffline] = useState(false);
    const [noActiveCompetition, setNoActiveCompetition] = useState(false);

    const defaultValues = useMemo(() => {
        return {
            radio: "",
            checkboxes: [],
            textbox: "",
            number: 0,
            slider: 0,
        };
    }, []);

    const initializeValues = useCallback(
        (transformedStructure: any) => {
            const newFormData: {
                question: string;
                type: string;
                value: any;
            }[] = [];
            for (const section of transformedStructure) {
                for (const question of section.questions) {
                    if (question.type === "heading") {
                        continue;
                    }
                    // @ts-ignore
                    newFormData.push(defaultValues[question.type]);
                }
            }
            setFormData(newFormData);
        },
        [defaultValues]
    );

    const initializeStructureFromCompetition = useCallback(
        (competition: any) => {
            const transformedStructure = splitSections(competition.pitScoutFormStructure);
            setFormSections(transformedStructure);
            initializeValues(transformedStructure);
            setCurrentCompetition(competition);
        },
        [initializeValues]
    );
    useEffect(() => {
        CompetitionsDB.getCurrentCompetition()
            .then(async (competition) => {
                if (!competition) {
                    setNoActiveCompetition(true);
                    return;
                }
                setNoActiveCompetition(false);
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY, JSON.stringify(competition));
                initializeStructureFromCompetition(competition);
            })
            .catch(async (e) => {
                if (e.message && e.message.includes("Network request failed")) {
                    setIsOffline(true);
                }
                const storedComp = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
                if (storedComp != null) {
                    const competition = JSON.parse(storedComp);
                    initializeStructureFromCompetition(competition);
                } else {
                    setNoActiveCompetition(true);
                }
            });
    }, [initializeStructureFromCompetition]);
    const checkRequiredFields = () => {
        for (const section of formSections) {
            for (const question of section.questions) {
                if (
                    question.required &&
                    formData[question.indice] === defaultValues[question.type] &&
                    question.type !== "number"
                ) {
                    Alert.alert(
                        "Required Question: " + question.question + " not filled out",
                        "Please fill out all questions denoted with an asterisk"
                    );
                    return false;
                }
            }
        }
        return true;
    };
    const submitForm = async () => {
        setIsSubmitting(true);
        console.log("Submitting form", formData);
        if (team === "") {
            Alert.alert("Invalid Team Number", "Please enter a valid team number");
            setIsSubmitting(false);
            return;
        }
        if (!checkRequiredFields()) {
            setIsSubmitting(false);
            return;
        }
        const data: PitReportWithoutId = {
            data: formData,
            teamNumber: parseInt(team, 10),
            competitionId: currentCompetition!.id,
        };
        const googleResponse = await fetch("https://google.com").catch(() => {});
        if (!googleResponse) {
            FormHelper.savePitFormOffline(
                data,
                images.filter((item) => item !== "plus")
            ).then(() => {
                Toast.show({
                    type: "success",
                    text1: "Saved offline successfully!",
                    visibilityTime: 3000,
                });
                setTeam("");
                setFormData([]);
                setImages(["plus"]);
                setIsSubmitting(false);
            });
        } else {
            PitReportsDB.createOnlinePitScoutReport(
                data,
                images.filter((item) => item !== "plus")
            )
                .then(() => {
                    setIsSubmitting(false);
                    setTeam("");
                    initializeValues(formSections);
                    setImages(["plus"]);
                    Toast.show({
                        type: "success",
                        text1: "Submitted successfully!",
                        visibilityTime: 3000,
                    });
                })
                .catch((err) => {
                    setIsSubmitting(false);
                    console.log(err);
                    Toast.show({
                        type: "error",
                        text1: "Error submitting form",
                        visibilityTime: 3000,
                    });
                });
        }
    };
    if (noActiveCompetition) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.text}>There is no competition happening currently.</Text>

                {isOffline && <Text>To check for competitions, please connect to the internet.</Text>}
            </View>
        );
    }
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.background,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text,

                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "bold",
                    },
                }}
            >
                <Tab.Screen
                    name={"Match"}
                    options={{
                        title: "Match",
                    }}
                    children={() => (
                        <ReportFlowTab
                            title={currentCompetition ? `${currentCompetition.name} - Pit Scouting` : "Pit Scouting"}
                        >
                            <TeamInformation team={team} setTeam={setTeam} />
                            <UIButton
                                buttonStyle={{ width: "100%", marginTop: "auto" }}
                                color={Color.parse(colors.primary)}
                                style={UIButtonStyle.fill}
                                size={UIButtonSize.xl}
                                text={"Next"}
                                onPress={() => navigation.navigate("Pit", { screen: `Form/${formSections[0].title}` })}
                            />
                        </ReportFlowTab>
                    )}
                />
                {formSections?.map((section, i) => (
                    <Tab.Screen
                        key={section.title}
                        name={`Form/${section.title}`}
                        options={{
                            title: section.title,
                        }}
                        children={() => (
                            <ReportFlowFormSection
                                section={section}
                                data={formData.slice(section.start + 1, section.end)}
                                setData={(data) =>
                                    setFormData(
                                        formData.splice(section.start + 1, section.end - section.start + 1, data)
                                    )
                                }
                                nextButton={
                                    <UIButton
                                        buttonStyle={{ width: "100%" }}
                                        color={Color.parse(colors.primary)}
                                        style={UIButtonStyle.fill}
                                        size={UIButtonSize.xl}
                                        text={"Next"}
                                        onPress={() => {
                                            navigation.navigate("Pit", {
                                                screen:
                                                    i === formSections.length - 1
                                                        ? "Images"
                                                        : `Form/${formSections[i + 1].title}`,
                                            });
                                        }}
                                    />
                                }
                            />
                        )}
                    />
                ))}
                <Tab.Screen
                    name={"Images"}
                    options={{
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "bold",
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                    children={() => (
                        <ReportFlowTab title={"Images"}>
                            <FlatList
                                keyboardShouldPersistTaps="handled"
                                style={styles.imageList}
                                ItemSeparatorComponent={ListSeparator}
                                data={images}
                                horizontal={true}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => {
                                    if (item === "plus") {
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    launchCamera(
                                                        {
                                                            mediaType: "photo",
                                                            quality: 1,
                                                            saveToPhotos: false,
                                                        },
                                                        console.log
                                                    ).then((x) => {
                                                        console.log(x);
                                                    });
                                                }}
                                            >
                                                <View style={styles.plusButton}>
                                                    <Text style={styles.plusText}>+</Text>
                                                </View>
                                            </Pressable>
                                        );
                                    }
                                    return (
                                        <View>
                                            <Pressable
                                                style={styles.deleteContainer}
                                                onPress={() => {
                                                    setImages(images.filter((i) => i !== item));
                                                }}
                                            >
                                                <View style={styles.deleteButton}>
                                                    <Bs.Trash size="20" fill={colors.text} />
                                                </View>
                                            </Pressable>
                                            <Image source={{ uri: item }} style={styles.image} />
                                        </View>
                                    );
                                }}
                            />
                            <UIButton
                                buttonStyle={{ width: "100%", marginTop: "auto" }}
                                color={Color.parse(colors.primary)}
                                style={UIButtonStyle.fill}
                                size={UIButtonSize.xl}
                                loading={isSubmitting}
                                onPress={submitForm}
                            />
                        </ReportFlowTab>
                    )}
                />
            </Tab.Navigator>
        </>
    );
}

const makeStyles = ({ colors }: Theme) =>
    StyleSheet.create({
        heading: {
            color: colors.text,
            textAlign: "center",
            paddingBottom: 15,
            fontWeight: "bold",
            fontSize: 30,
            marginTop: 20,
        },
        imageList: {
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
        },
        image: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
        },
        plusButton: {
            width: 200,
            height: 250,
            margin: 10,
            borderRadius: 10,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
        },
        plusText: {
            fontSize: 50,
            color: colors.text,
        },
        deleteContainer: {
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
        },
        deleteButton: {
            backgroundColor: colors.card,
            padding: 10,
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            color: colors.text,
        },
        centeredContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        bottomMargin: { marginBottom: 300 },
    });

const ListSeparator = () => <View style={{ width: 10 }} />;
