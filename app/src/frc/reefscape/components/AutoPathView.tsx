import { Circle, G, Line, Path, Rect, Svg } from "react-native-svg";
import { View } from "react-native";

import { AutoAction, AutoActionType, type AutoPath } from "../auto";
import { UIText } from "../../../ui/UIText";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

export function AutoPathView({ path }: { path: AutoPath }) {
    "use memo";
    if (!path || path.length === 0) {
        const { colors } = useTheme();
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

    const autoPathSvgs = [];

    let prev: AutoAction.Intake | AutoAction.Reef | undefined = undefined;
    let order = 0;
    for (const node of path) {
        if (!isDisplayedAction(node)) return;

        if (prev === undefined) {
            autoPathSvgs.push(<NodeToStartingLine nodeId={path.find(isDisplayedAction)!.target - 1} />);
        } else {
            autoPathSvgs.push(
                <NodeToNodeLine nodeId1={prev.target - 1} nodeId2={node.target - 1} order={order} />,
                <ActiveNode nodeId={node.target - 1} status={node.success ? "success" : "missed"} />
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
            <Svg width="357" height="315" viewBox="0 0 513 448" fill="none">
                <Rect width="513" height="448" fill="#0F1216" />
                <Rect x="14" y="17" width="58" height="186" stroke="#677EF5" stroke-width="6" />
                <Rect x="14" y="240" width="58" height="186" stroke="#FB4949" stroke-width="6" />
                <Path
                    d="M219.905 195.232L268 167.464L316.095 195.232V250.768L268 278.536L219.905 250.768V195.232Z"
                    stroke="#3A3A3A"
                    stroke-width="6"
                />
                <Path d="M6 432H414.5L501.5 367.5V77L414.5 13.5H6" stroke="#3A3A3A" stroke-width="6" />
                <Path
                    d="M206.847 187.482L267.5 152.464L328.153 187.482V257.518L267.5 292.536L206.847 257.518V187.482Z"
                    stroke="#FB4949"
                    stroke-width="6"
                />
                <Line x1="106" y1="14" x2="106" y2="432" stroke="#3A3A3A" stroke-width="6" />
                <Rect x="38" y="271" width="11" height="11" fill="#FB4949" />
                <Rect x="38" y="327" width="11" height="11" fill="#FB4949" />
                <Rect x="38" y="383" width="11" height="11" fill="#FB4949" />
                <Rect x="38" y="48" width="11" height="11" fill="#677EF5" />
                <Rect x="38" y="104" width="11" height="11" fill="#677EF5" />
                <Rect x="38" y="160" width="11" height="11" fill="#677EF5" />
                <Rect x="28" y="206" width="30" height="31" fill="#3A3A3A" />
                {new Array(12).fill(0).map((_, i) => (
                    <DefaultNode nodeId={i} />
                ))}
                {autoPathSvgs}
            </Svg>
        </View>
    );
}

function isDisplayedAction(action: AutoAction): action is AutoAction.Intake | AutoAction.Reef {
    return action.type === AutoActionType.Intake || action.type === AutoActionType.Reef;
}

const nodePositions = [
    // Game pieces
    { x: 439, y: 318 },
    { x: 439, y: 223 },
    { x: 439, y: 125 },
    { x: 439, y: 318 },
    { x: 439, y: 223 },
    { x: 439, y: 125 },

    // Scoring on field
    { x: 200, y: 225 },
    { x: 232, y: 163 },
    { x: 340, y: 225 },
    { x: 308, y: 287 },
    { x: 308, y: 163 },
    { x: 232, y: 287 },
];

function NodeToStartingLine({ nodeId }: { nodeId: number }) {
    "use memo";
    return (
        <>
            <Line
                x1={nodePositions[nodeId].x}
                y1={nodePositions[nodeId].y}
                x2="105"
                y2="224"
                stroke="hsl(230,85%,30%)"
                strokeWidth="7"
            />
            <Circle cx="105" cy="224" r="12" fill="#637AF4" />
        </>
    );
}

function NodeToNodeLine({ nodeId1, nodeId2, order }: { nodeId1: number; nodeId2: number; order: number }) {
    "use memo";
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

function DefaultNode({ nodeId }: { nodeId: number }) {
    "use memo";
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
function ActiveNode({ nodeId, status }: ActiveNodeProps) {
    "use memo";
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
