import {Circle, G, Line, Path, Rect, Svg} from "react-native-svg";
import {View} from "react-native";
import {AutoAction, AutoActionType, type AutoPath} from "../auto";
import {useTheme} from "@/ui/context/ThemeContext";
import {UIText} from "@/ui/components/UIText";

export function AutoPathView({ path }: { path: AutoPath }) {
    const { colors } = useTheme();

    if (!path || path.length === 0) {
        return (
            <View
                style={{
                    backgroundColor: colors.bg1.hex,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 8,
                }}
            >
                <UIText size={20} bold>
                    No Auto Paths found.
                </UIText>
            </View>
        );
    }

    const autoPathLines = [];
    const autoPathNodes = [];

    let prev: AutoAction.Intake | AutoAction.Obstacle | AutoAction.Climb | undefined = undefined;
    let order = 0;
    for (const node of path) {
        if (!isDisplayedAction(node)) continue;

        if (prev === undefined) {
            autoPathLines.push(<NodeToStartingLine key={`start-line-${order}`} nodeId={node.target - 1} />);
            autoPathNodes.push(<StartMarker key={`start-marker-${order}`} />);
            autoPathNodes.push(
                <ActiveNode
                    key={`node-${order}`}
                    nodeId={node.target - 1}
                    status={node.type === AutoActionType.Obstacle ? "success" : node.success ? "success" : "missed"}
                />,
            );
            prev = node;
        } else {
            autoPathLines.push(
                <NodeToNodeLine
                    key={`line-${order}`}
                    nodeId1={prev.target - 1}
                    nodeId2={node.target - 1}
                    order={order}
                />,
            );
            autoPathNodes.push(
                <ActiveNode
                    key={`node-${order}`}
                    nodeId={node.target - 1}
                    status={node.type === AutoActionType.Obstacle ? "success" : node.success ? "success" : "missed"}
                />,
            );
            prev = node;
            order++;
        }
    }

    return (
        <View
            style={{
                backgroundColor: "#5F5F5F",
                alignItems: "center",
                padding: 10,
                borderRadius: 10,
            }}
        >
            <Svg width="512" height="428" viewBox="0 0 512 428" fill="none">
                <G clip-path="url(#clip0_2004_2)">
                    <Rect width="512" height="428" fill="white"/>
                    <Rect x="442" y="297" width="65" height="65" stroke="#FB4949" stroke-width="2"/>
                    <Path d="M497 20H506V57.5V60.5V95H497V20Z" fill="#D9D9D9"/>
                    <Path d="M430 148H506V183V185.8V218H430V148Z" fill="#D9D9D9"/>
                    <Line x1="0.996825" y1="3.59796" x2="511.996" y2="3" stroke="black" stroke-width="6"/>
                    <Line x1="1" y1="425" x2="508" y2="425" stroke="black" stroke-width="6"/>
                    <Line x1="509" y1="87" x2="509" y2="335" stroke="white" stroke-width="6"/>
                    <Line x1="509" y1="428" x2="509" y2="6" stroke="black" stroke-width="6"/>
                    <Line x1="438.5" y1="154" x2="438.5" y2="211" stroke="#FB4949" stroke-width="3"/>
                    <Rect x="155.142" y="179.142" width="69.9459" height="69.9459" fill="#D9D9D9" stroke="black"/>
                    <Path
                        d="M213.474 214.315L201.666 234.768L178.047 234.769L166.239 214.315L178.048 193.862L201.665 193.861L213.474 214.315Z"
                        stroke="black" stroke-width="6"/>
                    <Path
                        d="M220.36 214.086L205.224 240.303L174.949 240.304L159.813 214.085L174.949 187.868L205.223 187.868L220.36 214.086Z"
                        stroke="#FB4949" stroke-width="6"/>
                    <Rect x="161.5" y="249.5" width="59" height="89" fill="#FB4949" stroke="black"/>
                    <Rect x="161.5" y="249.5" width="31" height="89" fill="#FF3434" fill-opacity="0.9" stroke="black"/>
                    <Rect x="161.5" y="89.5" width="59" height="89" fill="#FB4949" stroke="black"/>
                    <Rect x="161.5" y="89.5" width="31" height="89" fill="#FF3434" fill-opacity="0.9" stroke="black"/>
                    <Rect x="161.5" y="339.5" width="59" height="82" stroke="black"/>
                    <Line x1="192.5" y1="340" x2="192.5" y2="421" stroke="#FB4949" stroke-width="5"/>
                    <Rect x="161.5" y="6.5" width="59" height="82" stroke="black"/>
                    <Line x1="192.5" y1="7" x2="192.5" y2="88" stroke="#FB4949" stroke-width="5"/>
                </G>
                <Rect x="0.5" y="0.5" width="511" height="427" stroke="black"/>
                {autoPathLines}
                {new Array(8).fill(0).map((_, i) => (
                    <DefaultNode key={i} nodeId={i}/>
                ))}
                {autoPathNodes}
            </Svg>

        </View>
    );
}

function isDisplayedAction(action: AutoAction): action is AutoAction.Intake | AutoAction.Obstacle | AutoAction.Climb {
    return (
        action.type === AutoActionType.Intake ||
        action.type === AutoActionType.Obstacle
        // ||
        // action.type === AutoActionType.Climb
    );
}

const nodePositions = [
    // Game pieces

    {x: 439, y: 20}, //hp
    {x: 439, y: 325}, //box
    {x: 100, y: 217}, //mid
    {x: 280, y: 217}, //alliance
    {x: 192, y: 130}, //b1
    {x: 192, y: 300}, //b2
    {x: 192, y: 45}, //t1
    {x: 192, y: 380}, //t2

];

function NodeToStartingLine({nodeId}: { nodeId: number }) {
    const [x,y] = [350,217]
    return (
        <>
            <Line
                x1={nodePositions[nodeId].x}
                y1={nodePositions[nodeId].y}
                x2={x}
                y2={y}
                stroke="hsl(230,85%,30%)"
                strokeWidth="7"
            />
        </>
    );
}

function StartMarker() {
    const [x, y] = [350, 217];
    return <Circle cx={x} cy={y} r="12" fill="#637AF4" />;
}

function NodeToNodeLine({nodeId1, nodeId2, order}: { nodeId1: number; nodeId2: number; order: number }) {
    return (
        <Line
            x1={nodePositions[nodeId1].x}
            y1={nodePositions[nodeId1].y}
            x2={nodePositions[nodeId2].x}
            y2={nodePositions[nodeId2].y}
            stroke={`hsl(230,85%,${Math.min(90, 30 + order * 10)}%)`}
            strokeWidth={6 - order * 0.3}
        />
    );
}

function DefaultNode({nodeId}: { nodeId: number }) {
    return (
        <Circle
            cx={nodePositions[nodeId].x}
            cy={nodePositions[nodeId].y}
            r="10.5"
            fill="white"
            stroke="#FF7A00"
            strokeWidth="2"
        />
    );
}

interface ActiveNodeProps {
    nodeId: number;
    status: "success" | "missed";
}

function ActiveNode({nodeId, status}: ActiveNodeProps) {
    return (
        <>
            <Circle cx={nodePositions[nodeId].x} cy={nodePositions[nodeId].y} r="12" fill="#637AF4" />
            <G x={nodePositions[nodeId].x} y={nodePositions[nodeId].y}>
                {status === "success" && (
                    <>
                        <Line x1={-5} y1={0} x2={-2} y2={+5} stroke="white" strokeWidth="3" />
                        <Line x1={-2} y1={+5} x2={+5} y2={-5} stroke="white" strokeWidth="3" />
                    </>
                )}
                {status === "missed" && (
                    <>
                        <Line x1={-5} y1={-5} x2={+5} y2={+5} stroke="white" strokeWidth="3" />
                        <Line x1={-5} y1={+5} x2={+5} y2={-5} stroke="white" strokeWidth="3" />
                    </>
                )}
            </G>
        </>
    );
}
