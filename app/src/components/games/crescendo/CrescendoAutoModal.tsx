import { Modal, Pressable, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { CrescendoField } from "./CrescendoField.tsx";
import type { CrescendoAutoPath } from "./CrescendoAutoPath.ts";
import { CrescendoActionIcon, CrescendoActions, CrescendoActionType } from "./CrescendoActions.tsx";
import type { Setter } from "../../../lib/react/util/types";
import type { Alliance, Orientation } from "../../../games/common";

interface HistoryAction {
    action: string;
    noteId: number;
}

interface LinkItemMap {
    [key: string]: {
        value: number;
        index: number;
    };
}

const ActionButton = ({
    positiveAction,
    negativeAction,
    flex,
    setHistory,
    setAutoPath,
    setArrayData,
    linkItemMap,
}: {
    positiveAction: CrescendoActionType;
    negativeAction: CrescendoActionType;
    flex: number;
    setHistory: Setter<HistoryAction[]>;
    setAutoPath: Setter<CrescendoAutoPath>;
    setArrayData: Setter<any[]>;
    linkItemMap: LinkItemMap;
}) => {
    const { colors } = useTheme();
    const doAction = (action: CrescendoActionType, change: number) => {
        setHistory((history) => [
            ...history,
            {
                action: CrescendoActions[action].link_name,
                noteId: positiveAction,
            },
        ]);
        setArrayData((prevArrayData) => {
            const linkItem = linkItemMap[CrescendoActions[action].link_name];
            if (linkItem) {
                const { index } = linkItem;
                const newArrayData = [...prevArrayData];
                newArrayData[index] = prevArrayData[index] + change;
                return newArrayData;
            } else {
                return prevArrayData;
            }
        });
        setAutoPath((paths) => [
            ...paths,
            {
                type: action,
                order: paths.at(-1)?.order ?? 0,
            },
        ]);
        ReactNativeHapticFeedback.trigger("impactLight");
    };

    return (
        <>
            <Pressable
                style={{
                    backgroundColor: colors.notification,
                    paddingHorizontal: "5%",
                    marginVertical: "5%",
                    paddingVertical: "10%",
                    borderRadius: 10,
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: flex / 2,
                }}
                onPress={() => {
                    doAction(negativeAction, 1);
                }}
            >
                <CrescendoActionIcon action={negativeAction} />
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            paddingTop: "5%",
                            fontWeight: "bold",
                        }}
                    >
                        Missed: {linkItemMap[CrescendoActions[negativeAction].link_name]?.value ?? 0}
                    </Text>
                </View>
            </Pressable>
            <Pressable
                style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: "5%",
                    marginVertical: "5%",
                    paddingVertical: "10%",
                    borderRadius: 10,
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: flex / 2,
                }}
                onPress={() => {
                    doAction(positiveAction, 1);
                }}
            >
                <CrescendoActionIcon action={positiveAction} />
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            paddingTop: "5%",
                            fontWeight: "bold",
                        }}
                    >
                        In: {linkItemMap[CrescendoActions[positiveAction].link_name]?.value ?? 0}
                    </Text>
                </View>
            </Pressable>
        </>
    );
};

interface CrescendoAutoModalProps {
    isActive: boolean;
    setIsActive: Setter<boolean>;
    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
    autoPath: CrescendoAutoPath;
    setAutoPath: Setter<CrescendoAutoPath>;
    arrayData: any[];
    setArrayData: Setter<any[]>;

    form: any;
}
export function CrescendoAutoModal({
    isActive,
    setIsActive,
    orientation,
    setOrientation,
    alliance,
    setAlliance,
    autoPath,
    setAutoPath,
    arrayData,
    setArrayData,

    form,
}: CrescendoAutoModalProps) {
    const { colors } = useTheme();

    const [history, setHistory] = useState<HistoryAction[]>([]);

    // for each linked item, map the link name to the item within the arrayData and the index
    const linkItemMap = useMemo<LinkItemMap>(
        () =>
            form &&
            arrayData &&
            form.reduce((acc: any, item: any) => {
                if (item.link_to) {
                    acc[item.link_to] = {
                        value: arrayData[item.indice],
                        index: item.indice,
                    };
                }
                return acc;
            }, {}),
        [form, arrayData]
    );

    return (
        <Modal visible={isActive} transparent={false} animationType={"slide"} presentationStyle={"formSheet"}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.card,
                }}
            >
                <Pressable
                    style={{ alignSelf: "flex-end", marginRight: "5%", marginTop: "5%" }}
                    onPress={() => setIsActive(false)}
                >
                    <Text style={{ color: colors.text }}>Close</Text>
                </Pressable>
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 40,
                        fontWeight: "bold",
                    }}
                >
                    AUTO
                </Text>
                <View
                    style={{
                        height: "100%",
                        width: "100%",
                        alignItems: "center",
                        paddingHorizontal: "5%",
                        flex: 1,
                        marginBottom: "5%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Pressable
                        style={{
                            flexDirection: "row",
                            width: "40%",
                            backgroundColor: colors.border,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            paddingHorizontal: "2%",
                            paddingVertical: "5%",
                            marginBottom: "5%",
                            borderRadius: 10,
                        }}
                        onPress={() => {
                            const lastAction = history.pop();
                            if (lastAction) {
                                switch (lastAction.action) {
                                    case "intake":
                                        setAutoPath((paths) =>
                                            paths.filter((path) => path.noteId !== lastAction.noteId)
                                        );
                                        break;
                                    case "miss":
                                        setAutoPath((paths) =>
                                            paths.map((path) =>
                                                path.noteId === lastAction.noteId ? { ...path, state: "success" } : path
                                            )
                                        );
                                        break;
                                    case "reset":
                                        setAutoPath((paths) => [
                                            ...paths,
                                            {
                                                type: CrescendoActionType.PickupGround,
                                                noteId: lastAction.noteId,
                                                order: paths.length,
                                                state: "success",
                                            },
                                        ]);
                                        break;
                                    case CrescendoActions[CrescendoActionType.ScoreAmp].link_name:
                                    case CrescendoActions[CrescendoActionType.ScoreSpeaker].link_name:
                                    case CrescendoActions[CrescendoActionType.MissAmp].link_name:
                                    case CrescendoActions[CrescendoActionType.MissSpeaker].link_name:
                                        setArrayData((prevArrayData) => {
                                            const { index } = linkItemMap[lastAction.action];
                                            const newArrayData = [...prevArrayData];
                                            newArrayData[index] = prevArrayData[index] - 1;
                                            return newArrayData;
                                        });
                                        setAutoPath((paths) => paths.slice(0, -1));
                                        break;
                                }
                            }
                            setHistory(history);
                        }}
                    >
                        <Svg width="28" height="28" fill={colors.text} viewBox="0 0 16 16">
                            <Path
                                fill-rule="evenodd"
                                d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
                            />
                            <Path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                        </Svg>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}>Undo</Text>
                    </Pressable>
                    <CrescendoField
                        fieldOrientation={orientation}
                        selectedAlliance={alliance}
                        onNoteIntake={(note: number) => {
                            setAutoPath((paths) => [
                                ...paths,
                                {
                                    type: CrescendoActionType.PickupGround,
                                    noteId: note,
                                    order: paths.at(-1) ? paths.at(-1)!.order + 1 : 0,
                                    state: "success",
                                },
                            ]);
                            setHistory((history) => [...history, { action: "intake", noteId: note }]);
                        }}
                        onNoteMissed={(note: number) => {
                            setAutoPath((paths) =>
                                paths.map((path) => (path.noteId === note ? { ...path, state: "missed" } : path))
                            );
                            setHistory((history) => [...history, { action: "miss", noteId: note }]);
                        }}
                        onNoteReset={(note: number) => {
                            setAutoPath((paths) => paths.filter((path) => path.noteId !== note));
                            setHistory((history) => [...history, { action: "reset", noteId: note }]);
                        }}
                        autoPath={autoPath}
                    />
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                        }}
                    >
                        {/*<ActionButton*/}
                        {/*  positiveAction={CrescendoActionType.ScoreAmp}*/}
                        {/*  negativeAction={CrescendoActionType.MissAmp}*/}
                        {/*  color="#86DF89"*/}
                        {/*  flex={0.25}*/}
                        {/*  setHistory={setHistory}*/}
                        {/*  setAutoPath={setAutoPath}*/}
                        {/*  setArrayData={setArrayData}*/}
                        {/*  linkItemMap={linkItemMap}*/}
                        {/*/>*/}
                        <ActionButton
                            positiveAction={CrescendoActionType.ScoreSpeaker}
                            negativeAction={CrescendoActionType.MissSpeaker}
                            flex={1}
                            setHistory={setHistory}
                            setAutoPath={setAutoPath}
                            setArrayData={setArrayData}
                            linkItemMap={linkItemMap}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
