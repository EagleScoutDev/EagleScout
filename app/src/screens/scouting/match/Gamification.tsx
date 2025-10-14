import { useState } from "react";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { ReefscapeAutoModal } from "../../../components/games/reefscape/ReefscapeAutoModal";
import type { Setter } from "../../../lib/react/util/types";
import type { ScoutMenuParamList } from "../ScoutingFlow";
import type { Alliance, Orientation } from "../../../games/common";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import type { CompetitionReturnData } from "../../../database/Competitions";
import { MatchInformation } from "../components/MatchInformation.tsx";
import { UIButton, UIButtonFrame, UIButtonSize } from "../../../ui/UIButton.tsx";
import { Color } from "../../../lib/color.ts";
import { ReportFlowTab } from "../components/ReportFlowTab.tsx";
import { Form } from "../../../lib/forms";
import { ReportFlowFormSection } from "../components/ReportFlowFormSection.tsx";

// TODO: add three lines to open drawer
const Tab = createMaterialTopTabNavigator<GamificationParamList>();
export type GamificationScreenProps<K extends keyof GamificationParamList> = MaterialTopTabScreenProps<
    GamificationParamList,
    K
>;
export type GamificationParamList = {
    Match: undefined;
    [k: `Form/${string}`]: undefined;
};

export interface GamificationProps {
    match: number | null;
    setMatch: Setter<number | null>;
    team: number | null;
    setTeam: Setter<number | null>;
    teamsForMatch: number[];
    competition: CompetitionReturnData | null;

    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;

    startRelativeTime: number;
    setStartRelativeTime: Setter<number>;
    timeline: unknown;
    setTimeline: Setter<unknown>;

    formSections: Form.Section[];
    formData: any[];
    setFormData: Setter<Form.Data>;

    autoPath: unknown;
    setAutoPath: Setter<unknown>;
    navigation: NativeStackNavigationProp<ScoutMenuParamList, "Match">;
}
export function Gamification({
    match,
    setMatch,
    team,
    setTeam,
    teamsForMatch,
    competition,
    orientation,
    setOrientation,
    alliance,
    setAlliance,
    startRelativeTime,
    setStartRelativeTime,
    timeline,
    setTimeline,
    formSections,
    formData,
    setFormData,
    autoPath,
    setAutoPath,

    submitForm,
    isSubmitting,
}: GamificationProps) {
    const [modalIsOpen, setModalIsOpen] = useState(true);

    const { colors } = useTheme();

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
                    children={({ navigation }) => (
                        <ReportFlowTab title={competition ? `${competition.name} - Match Report` : "Match Report"}>
                            <MatchInformation
                                match={match}
                                setMatch={setMatch}
                                team={team}
                                setTeam={setTeam}
                                teamsForMatch={teamsForMatch}
                                orientation={orientation}
                                setOrientation={setOrientation}
                                alliance={alliance}
                                setAlliance={setAlliance}
                            />
                            <UIButton
                                style={{ marginTop: "auto", maxWidth: "100%" }}
                                color={Color.parse(colors.primary)}
                                frame={UIButtonFrame.fill}
                                size={UIButtonSize.xl}
                                text={"Next"}
                                onPress={() => {
                                    navigation.navigate(`Form/${formSections[0].title}`);
                                    setModalIsOpen(true);
                                }}
                            />
                        </ReportFlowTab>
                    )}
                />
                {formSections?.map((section, i) => {
                    const isLast = i === formSections.length - 1;
                    return (
                        <Tab.Screen
                            key={section.title}
                            name={`Form/${section.title}`}
                            options={{
                                title: section.title,
                            }}
                            listeners={{
                                tabPress: () => {
                                    setActivePage(section.title);
                                    setModalIsOpen(true);
                                },
                            }}
                            children={({ navigation }) => (
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
                                            style={{ marginTop: "auto", maxWidth: "100%" }}
                                            color={Color.parse(colors.primary)}
                                            frame={UIButtonFrame.fill}
                                            size={UIButtonSize.xl}
                                            text={"Next"}
                                            isLoading={isLast ? isSubmitting : false}
                                            onPress={
                                                isLast
                                                    ? submitForm
                                                    : () => {
                                                          navigation.navigate("Pit", {
                                                              screen: `Form/${formSections[i + 1].title}`,
                                                          });
                                                      }
                                            }
                                        />
                                    }
                                />
                            )}
                        />
                    );
                })}
            </Tab.Navigator>

            <ReefscapeAutoModal
                isActive={modalIsOpen}
                setIsActive={setModalIsOpen}
                fieldOrientation={orientation}
                setFieldOrientation={setOrientation}
                selectedAlliance={alliance}
                setSelectedAlliance={setAlliance}
                autoPath={autoPath}
                setAutoPath={setAutoPath}
                arrayData={formData}
                setArrayData={setFormData}
                form={(formSections && formSections.find(s => s.title === "Auto")) ?? []}
            />
        </>
    );
}
