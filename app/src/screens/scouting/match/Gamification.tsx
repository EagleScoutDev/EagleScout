import { ScrollView, View } from "react-native";
import { FormSection } from "../../../ui/form/FormSection";
import { useState } from "react";
import { FormComponent } from "../../../ui/form/FormComponent";
import { StandardButton } from "../../../ui/StandardButton";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { ReefscapeAutoModal } from "../../../components/games/reefscape/ReefscapeAutoModal";
import type { Setter } from "../../../lib/react";
import type { ScoutMenuParamList } from "../ScoutingFlow";
import type { Alliance, Orientation } from "../../../games/common";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import type { CompetitionReturnData } from "../../../database/Competitions";
import { SetupTab } from "./SetupTab.tsx";

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

    arrayData: any[];
    setArrayData: Setter<any[]>;

    autoPath: unknown;
    setAutoPath: Setter<unknown>;
    navigation: NativeStackNavigationProp<ScoutMenuParamList, "Match">;

    data: unknown;
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
    arrayData,
    setArrayData,
    autoPath,
    setAutoPath,

    data,
    submitForm,
    isSubmitting,
}: GamificationProps) {
    const [activePage, setActivePage] = useState("Match");
    const [modalIsOpen, setModalIsOpen] = useState(true);

    const { colors } = useTheme();
    console.log(data)

    return (
        <>
            <Tab.Navigator
                // change the position to be on the bottom
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.background,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text,
                    // make the distance between each tab smaller
                    tabBarGap: 0,
                    tabBarLabelStyle: {
                        fontSize: 10,
                    },
                }}
            >
                <Tab.Screen
                    name={"Match"}
                    options={{
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "bold",
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                    children={({ navigation }) => (
                        <SetupTab
                            match={match}
                            setMatch={setMatch}
                            team={team}
                            setTeam={setTeam}
                            teamsForMatch={teamsForMatch}
                            competition={competition}
                            orientation={orientation}
                            setOrientation={setOrientation}
                            alliance={alliance}
                            setAlliance={setAlliance}
                            next={() => {
                                navigation.navigate(`Form/${Object.keys(data)[0]}`);
                                setActivePage(Object.keys(data)[0]);
                                setModalIsOpen(true);
                            }}
                        />
                    )}
                />
                {data &&
                    Object.entries(data).map(([key, value], index) => (
                        <Tab.Screen
                            key={key}
                            name={`Form/${key}`}
                            options={{
                                title: key,
                                tabBarLabelStyle: {
                                    fontSize: 12,
                                    fontWeight: "bold",
                                },
                                tabBarStyle: {
                                    backgroundColor: colors.background,
                                },
                            }}
                            listeners={{
                                tabPress: (e) => {
                                    setActivePage(key);
                                    setModalIsOpen(true);
                                },
                            }}
                            children={() => (
                                <FormTab
                                    key={key}
                                    value={value}
                                    arrayData={arrayData}
                                    setArrayData={setArrayData()}
                                    index={index}
                                    data={data}
                                    isSubmitting={isSubmitting}
                                    submitForm={submitForm}
                                />
                            )}
                        />
                    ))}
            </Tab.Navigator>
            <ReefscapeAutoModal
                isActive={activePage === "Auto" && modalIsOpen}
                setIsActive={setModalIsOpen}
                fieldOrientation={orientation}
                setFieldOrientation={setOrientation}
                selectedAlliance={alliance}
                setSelectedAlliance={setAlliance}
                autoPath={autoPath}
                setAutoPath={setAutoPath}
                arrayData={arrayData}
                setArrayData={setArrayData}
                form={data && data.Auto}
            />
        </>
    );
}
const FormTab = ({ key, value, arrayData, setArrayData, index, data, isSubmitting, submitForm }) => {
    const { colors } = useTheme();
    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View
                style={{
                    marginHorizontal: "5%",
                }}
            >
                <FormSection title={""} key={key}>
                    {value.map((item) => {
                        return (
                            <View
                                key={item.question}
                                style={{
                                    marginVertical: "5%",
                                }}
                            >
                                <FormComponent
                                    key={item.question}
                                    item={item}
                                    arrayData={arrayData}
                                    setArrayData={setArrayData}
                                />
                            </View>
                        );
                    })}
                </FormSection>
            </View>

            {/*if the index is not the last one, add a button that navigates users to the next tab*/}
            {index !== Object.keys(data).length - 1 && (
                <View style={{ width: "100%", marginBottom: "5%" }}>
                    <StandardButton text={"Next"} width={"85%"} onPress={() => {}} color={colors.primary} />
                </View>
            )}
            {/*  if the index is the last one, show a touchable opacity*/}
            {index === Object.keys(data).length - 1 && (
                <View style={{ width: "100%", marginBottom: "50%" }}>
                    <StandardButton
                        text={"Submit"}
                        width={"85%"}
                        color={colors.primary}
                        isLoading={isSubmitting}
                        onPress={submitForm}
                    />
                </View>
            )}
        </ScrollView>
    );
    // </KeyboardAvoidingView>
};
