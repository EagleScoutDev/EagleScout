import {Pressable, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import type {AutoPieceState, AutoState} from "../../auto";
import {Alliance, Orientation} from "@/frc/common/common";
import {Obstacles} from "../../field";
import {useTheme} from "@/ui/context/ThemeContext";
import {Color} from "@/ui/lib/color";
import {UIText} from "@/ui/components/UIText";
import * as Bs from "@/ui/icons";

export interface AutoFieldProps {
    orientation: Orientation;
    alliance: Alliance;
    onObstacle: (obstacle: Obstacles) => void;
    onIntake: (piece: number) => void;
    state: AutoState["field"];
}
export function AutoField({ orientation, alliance, onObstacle, onIntake, state }: AutoFieldProps) {
    const leftSide = alliance === Orientation.getLeft(orientation);
    const colour1 = (alliance === Alliance.blue ? "#0b6fdf" : "#e43737")
    const colour2 = (alliance === Alliance.blue ? "#0664cc" : "#cf1d1d")


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
                <Svg width="133" height="428" viewBox="0 0 133 428" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path fill="#fff" d="M0 0h133v428H0z"/>
                    <Path fill="#d9d9d9" stroke="#000" d="M32.449 178.122h71.992v71.992H32.449z"/>
                    <Path d="m92.579 214.324-12.2 21.13-24.399.001-12.199-21.131 12.2-21.129 24.399-.001z" stroke="#000"
                          strokeWidth="6"/>
                    <Path d="m99.662 214.088-15.623 27.06H52.792l-15.623-27.06 15.624-27.06 31.246-.001z"
                          stroke="#fb4949" strokeWidth="6"/>
                    <Path fill={colour1} stroke="#000" d="M38.99 250.51h60.731v91.596H38.99z" onPress={()=>onObstacle(Obstacles.B1)}/>
                    <Path fill={colour2} fillOpacity=".9" stroke="#000" d="M38.99 250.51h31.923v91.596H38.99z" onPress={()=>onObstacle(Obstacles.B1)}/>
                    <Path fill={colour1} stroke="#000" d="M38.99 85.894h60.731v91.596H38.99z" onPress={()=>onObstacle(Obstacles.B2)}/>
                    <Path fill={colour2} fillOpacity=".9" stroke="#000" d="M38.99 85.894h31.923v91.596H38.99z" onPress={()=>onObstacle(Obstacles.B2)}/>
                    <Path stroke="#000" d="M38.99 343.106h60.731V427.5H38.99z"/>
                    <Path stroke={colour1} strokeWidth="5" d="M70.827 343.635v83.336"/>
                    <Path stroke="#000" d="M38.99.5h60.731v84.394H38.99z"/>
                    <Path stroke={colour1} strokeWidth="5" d="M70.827 1.029v83.336"/>
                </Svg>
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
                {([1, 2] as const).map((id) => (
                    <Piece key={id} type={"Coral"} state={state.pieces[id]} onPress={() => onIntake(id)}/>
                ))}
            </View>
        </View>
    );
}

interface PieceProps {
    type: "Coral" | "algae";
    state: AutoPieceState;
    onPress: () => void;
}
function Piece({ type, state, onPress }: PieceProps) {
    const { colors } = useTheme();

    const bg = type === "algae" ? Color.rgb(114, 209, 35) : Color.white;

    return (
        <Pressable
            style={{
                backgroundColor: bg.hex,
                borderColor: colors.border.hex,
                borderWidth: 1,
                width: 50,
                height: 50,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 1,
                position: "relative",
            }}
            onPress={onPress}
        >
            {state !== null && (
                <>
                    <UIText size={20} bold>
                        {state.order + 1}
                    </UIText>
                    <View style={{ position: "absolute", bottom: -12, right: -12 }}>
                        {state.success ? <Bs.CheckTwo size={36} /> : <Bs.X size={36} />}
                    </View>
                </>
            )}
        </Pressable>
    );
}
