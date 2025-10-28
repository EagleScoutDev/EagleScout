import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { CrescendoAutoPath } from "./CrescendoAutoPath.ts";

export const CrescendoField = ({
    fieldOrientation,
    selectedAlliance,
    onNoteIntake,
    onNoteMissed,
    onNoteReset,
    autoPath,
}: {
    fieldOrientation: string;
    selectedAlliance: string;
    onNoteIntake: (note: number) => void;
    onNoteMissed: (note: number) => void;
    onNoteReset: (note: number) => void;
    autoPath: CrescendoAutoPath;
}) => {
    const Note = ({ noteId }) => {
        const autoNote = useMemo(() => autoPath.find((note) => note.noteId === noteId), [autoPath]);
        return (
            <Pressable
                style={{
                    backgroundColor: "white",
                    borderColor: !autoNote ? "#FFCEA1" : autoNote.state === "success" ? "#FF7A00" : "black",
                    borderWidth: 8,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: "center",
                }}
                onPress={() => {
                    if (autoNote && autoNote.state === "success") {
                        onNoteMissed(noteId);
                    } else if (autoNote && autoNote.state === "missed") {
                        onNoteReset(noteId);
                    } else {
                        onNoteIntake(noteId);
                    }
                }}
            >
                {autoNote && (
                    <Text
                        style={{
                            color: "black",
                            textAlign: "center",
                        }}
                    >
                        {autoNote.order + 1}
                    </Text>
                )}
            </Pressable>
        );
    };
    return (
        <View
            style={{
                backgroundColor: "#D9D9D9",
                width: "100%",
                paddingHorizontal: "5%",
                borderRadius: 10,
                marginHorizontal: "10%",
                display: "flex",
                height: "60%",
                flexDirection:
                    fieldOrientation === "leftBlue"
                        ? selectedAlliance === "blue"
                            ? "row-reverse"
                            : "row"
                        : selectedAlliance === "blue"
                        ? "row"
                        : "row-reverse",
                justifyContent: "space-between",
            }}
        >
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    paddingVertical: "5%",
                }}
            >
                <Note noteId={4} />
                <Note noteId={5} />
                <Note noteId={6} />
                <Note noteId={7} />
                <Note noteId={8} />
            </View>
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Svg
                    height="100"
                    viewBox="0 0 16 16"
                    width="100"
                    strokeWidth="1"
                    stroke={selectedAlliance === "blue" ? "#0b6fdf" : "#e43737"}
                    fill="#404040"
                    style={
                        fieldOrientation === "leftBlue"
                            ? selectedAlliance === "blue"
                                ? { transform: [{ rotate: "30deg" }] }
                                : { transform: [{ rotate: "210deg" }] }
                            : selectedAlliance === "blue"
                            ? { transform: [{ rotate: "210deg" }] }
                            : { transform: [{ rotate: "30deg" }] }
                    }
                >
                    <Path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z" />
                </Svg>
            </View>
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                <Note noteId={1} />
                <Note noteId={2} />
                <Note noteId={3} />
            </View>
        </View>
    );
};
