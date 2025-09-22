import { Keyboard, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { FormSection } from "../../../components/form/FormSection";
import { useState } from "react";
import { FormComponent } from "../../../components/form/FormComponent";
import { StandardButton } from "../../../components/StandardButton";
import { MatchInformation } from "../../../components/form/MatchInformation";
import { createMaterialTopTabNavigator, type MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { ReefscapeAutoModal } from "../../../components/games/reefscape/ReefscapeAutoModal";
import type { Setter } from "../../../lib/react/types";
import type { ScoutMenuParamList } from "../ScoutingFlow";
import type { Alliance, Orientation } from "../../../games/common";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@react-navigation/native";
import type { CompetitionReturnData } from "../../../database/Competitions";

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
    competition: CompetitionReturnData;

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

    styles,
    data,
    submitForm,
    isSubmitting,
}: GamificationProps) {
    const [activePage, setActivePage] = useState("Match");
    const [modalIsOpen, setModalIsOpen] = useState(true);

    const { colors } = useTheme();

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
                        headerTintColor: colors.text,
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "bold",
                        },

                        tabBarStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                    children={({ navigation }: GamificationScreenProps<"Match">) => {
                        return (
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        {competition != null && (
                                            <Text
                                                style={{
                                                    color: colors.text,
                                                    fontWeight: "bold",
                                                    fontSize: 20,
                                                    textAlign: "center",
                                                    margin: "5%",
                                                }}
                                            >
                                                {competition.name}
                                            </Text>
                                        )}
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
                                    </View>
                                    <View style={{ width: "100%", marginBottom: "5%" }}>
                                        <StandardButton
                                            text={"Next"}
                                            onPress={() => {
                                                navigation.navigate(`Form/${Object.keys(data)[0]}`);
                                                setActivePage(Object.keys(data)[0]);
                                                setModalIsOpen(true);
                                            }}
                                            color={colors.primary}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    }}
                />
                {data &&
                    Object.entries(data).map(([key, value], index) => {
                        return (
                            <Tab.Screen
                                key={key}
                                name={`Form/${key}`}
                                options={{
                                    // change font color in header
                                    headerTintColor: colors.text,
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
                                    // <KeyboardAvoidingView behavior={'height'}>
                                    <ScrollView keyboardShouldPersistTaps="handled">
                                        <View
                                            style={{
                                                marginHorizontal: "5%",
                                            }}
                                        >
                                            <FormSection title={""} key={key.length}>
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
                                                <StandardButton
                                                    text={"Next"}
                                                    width={"85%"}
                                                    onPress={() => {}}
                                                    color={colors.primary}
                                                />
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
                                    // </KeyboardAvoidingView>
                                )}
                            />
                        );
                    })}
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
