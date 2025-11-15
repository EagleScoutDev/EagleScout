import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import * as Bs from "../../../../ui/icons";
import { Color } from "../../../../lib/color.ts";
import type { AutoPieceState, AutoState } from "../../auto.ts";
import { Alliance, Orientation } from "../../../common/common.ts";
import { ReefSextant } from "../../field.ts";

export interface AutoFieldProps {
    orientation: Orientation;
    alliance: Alliance;
    onReef: (sextant: ReefSextant) => void;
    onPiece: (piece: number) => void;
    state: AutoState["field"];
}
export function AutoField({ orientation, alliance, onReef, onPiece, state }: AutoFieldProps) {
    "use memo";

    const leftSide = (alliance = Orientation.getLeft(orientation));

    return (
        <View
            style={{
                width: "100%",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                gap: 16,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: leftSide ? "column-reverse" : "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "100%",
                    maxHeight: 300,
                    gap: 16,
                }}
            >
                {([1, 2, 3] as const).map((id) => (
                    <Piece key={id} type={"algae"} state={state.pieces[id]} onPress={() => onPiece(id)} />
                ))}
            </View>
            <View
                style={{
                    flexDirection: leftSide ? "column-reverse" : "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "100%",
                    maxHeight: 300,
                    gap: 16,
                }}
            >
                {([4, 5, 6] as const).map((id) => (
                    <Piece key={id} type={"Coral"} state={state.pieces[id]} onPress={() => onPiece(id)} />
                ))}
            </View>
            <Svg
                style={{ flexShrink: 1 }}
                width="220"
                height="200"
                viewBox="0 0 310 283"
                fill={alliance === Alliance.blue ? "#0b6fdf" : "#e43737"}
            >
                <Path
                    d="M164 113c-4 8-16 8-20 0L89 19c-5-8 1-18 10-18h110c9 0 15 10 10 18l-55 94Z"
                    onPress={() => onReef(ReefSextant.GH)}
                />
                <Path
                    d="M188 134c-9 0-15-10-10-18l54-94c5-8 17-8 21 0l55 94c4 8-1 18-11 18H188Z"
                    onPress={() => onReef(ReefSextant.EF)}
                />
                <Path
                    d="M178 163c-5-8 1-18 10-18h109c10 0 15 10 11 18l-55 95c-4 8-16 8-21 0l-54-95Z"
                    onPress={() => onReef(ReefSextant.CD)}
                />
                <Path
                    d="M144 170c4-8 16-8 20 0l55 94c4 8-1 18-11 18H99c-9 0-15-10-10-18l55-94Z"
                    onPress={() => onReef(ReefSextant.AB)}
                />
                <Path
                    d="M122 146c9 0 15 10 11 18l-55 94c-5 8-16 8-21 0L3 164c-5-8 1-18 10-18h109Z"
                    onPress={() => onReef(ReefSextant.KL)}
                />
                <Path
                    d="M132 116c4 8-1 18-11 18H12c-9 0-15-10-10-18l54-94c5-8 17-8 21 0l55 94Z"
                    onPress={() => onReef(ReefSextant.IJ)}
                />
            </Svg>
        </View>
    );
}

interface PieceProps {
    type: "Coral" | "algae";
    state: AutoPieceState;
    onPress: () => void;
}
function Piece({ type, state, onPress }: PieceProps) {
    "use memo";
    const { colors } = useTheme();

    const bg = type === "algae" ? Color.rgb(114, 209, 35) : Color.white;

    return (
        <Pressable
            style={{
                backgroundColor: bg.hex,
                borderColor: colors.border,
                borderWidth: 1,
                width: 50,
                height: 50,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 1,
                position: "relative",
            }}
            onPress={onPress}
        >
            {state !== null && (
                <>
                    <Text style={{ color: bg.fg.rgba, fontSize: 20, fontWeight: "bold" }}>{state.order + 1}</Text>
                    <View style={{ position: "absolute", bottom: -12, right: -12 }}>
                        {state.success ? <Bs.CheckTwo size={36} /> : <Bs.X size={36} />}
                    </View>
                </>
            )}
        </Pressable>
    );
}
