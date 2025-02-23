import React from 'react';
import {Text, View} from 'react-native';
import {Circle, Line, Path, Rect, Svg} from 'react-native-svg';
import {AutoPath} from './AutoPath';
import {ReefscapeActionType} from './ReefscapeActions';

const nodePositions = [
  //gamepices
  {x: 439, y: 318},
  {x: 439, y: 223},
  {x: 439, y: 125},
  {x: 439, y: 318},
  {x: 439, y: 223},
  {x: 439, y: 125},

  //scoring on field
  {x: 200, y: 225},
  {x: 232, y: 163},
  {x: 340, y: 225},
  {x: 308, y: 287},
  {x: 308, y: 163},
  {x: 232, y: 287},
];

const NodeToStartingLine = ({nodeId}: {nodeId: number}) => {
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
};

const NodeToNodeLine = ({
  nodeId1,
  nodeId2,
  index,
}: {
  nodeId1: number;
  nodeId2: number;
  index: number;
}) => {
  const light = Math.min(90, 30 + index * 10);
  return (
    <Line
      x1={nodePositions[nodeId1].x}
      y1={nodePositions[nodeId1].y}
      x2={nodePositions[nodeId2].x}
      y2={nodePositions[nodeId2].y}
      // stroke="#1f42ef"
      // stroke="hsl(230,85%,80%)"
      stroke={`hsl(230,85%,${light}%)`}
      strokeWidth={6 - index * 0.3}
      // strokeWidth="3"
    />
  );
};

const DefaultNode = ({nodeId}: {nodeId: number}) => (
  <Circle
    cx={nodePositions[nodeId].x}
    cy={nodePositions[nodeId].y}
    r="10.5"
    fill="white"
    stroke="#FF7A00"
    strokeWidth="2"
  />
);

const FilledNode = ({
  nodeId,
  status,
}: {
  nodeId: number;
  status: 'success' | 'missed';
}) => (
  <>
    <Circle
      cx={nodePositions[nodeId].x}
      cy={nodePositions[nodeId].y}
      r="12"
      fill="#637AF4"
    />
    {status === 'success' && (
      <>
        <Line
          x1={nodePositions[nodeId].x - 5}
          y1={nodePositions[nodeId].y}
          x2={nodePositions[nodeId].x - 2}
          y2={nodePositions[nodeId].y + 5}
          stroke="white"
          strokeWidth="3"
        />
        <Line
          x1={nodePositions[nodeId].x - 2}
          y1={nodePositions[nodeId].y + 5}
          x2={nodePositions[nodeId].x + 5}
          y2={nodePositions[nodeId].y - 5}
          stroke="white"
          strokeWidth="3"
        />
      </>
    )}
    {status === 'missed' && (
      <>
        <Line
          x1={nodePositions[nodeId].x - 5}
          y1={nodePositions[nodeId].y - 5}
          x2={nodePositions[nodeId].x + 5}
          y2={nodePositions[nodeId].y + 5}
          stroke="white"
          strokeWidth="3"
        />
        <Line
          x1={nodePositions[nodeId].x - 5}
          y1={nodePositions[nodeId].y + 5}
          x2={nodePositions[nodeId].x + 5}
          y2={nodePositions[nodeId].y - 5}
          stroke="white"
          strokeWidth="3"
        />
      </>
    )}
  </>
);

export const ReefscapeViewer = ({autoPath}: {autoPath: AutoPath}) => {
  if (!autoPath || autoPath.length === 0) {
    return (
      <View
        style={{
          backgroundColor: '#5F5F5F',
          alignItems: 'center',
          padding: 10,
          borderRadius: 8,
        }}>
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
          No Auto Paths found.
        </Text>
      </View>
    );
  }
  const autoPathSvgs = [];
  autoPathSvgs.push(
    autoPath.map(node => {
      if (
        node.type !== ReefscapeActionType.PickupGround &&
        node.type !== ReefscapeActionType.ScoreCoralL1 &&
        node.type !== ReefscapeActionType.ScoreCoralL2 &&
        node.type !== ReefscapeActionType.ScoreCoralL3 &&
        node.type !== ReefscapeActionType.ScoreCoralL4 &&
        node.type !== ReefscapeActionType.MissCoral
      ) {
        return;
      }
      const prevPickup = autoPath.findIndex(
        n =>
          (n.type === ReefscapeActionType.PickupGround ||
            n.type === ReefscapeActionType.ScoreCoralL1 ||
            n.type === ReefscapeActionType.ScoreCoralL2 ||
            n.type === ReefscapeActionType.ScoreCoralL3 ||
            n.type === ReefscapeActionType.ScoreCoralL4 ||
            n.type === ReefscapeActionType.MissCoral) &&
          n.order === node.order - 1,
      );
      return (
        <>
          {prevPickup !== -1 && (
            <NodeToNodeLine
              nodeId1={autoPath[prevPickup].nodeId! - 1}
              nodeId2={node.nodeId! - 1}
              index={prevPickup}
            />
          )}
        </>
      );
    }),
  );
  autoPathSvgs.push(
    <>
      {autoPath.find(
        n =>
          n.type === ReefscapeActionType.PickupGround ||
          n.type === ReefscapeActionType.ScoreCoralL1 ||
          n.type === ReefscapeActionType.ScoreCoralL2 ||
          n.type === ReefscapeActionType.ScoreCoralL3 ||
          n.type === ReefscapeActionType.ScoreCoralL4 ||
          n.type === ReefscapeActionType.MissCoral,
      ) !== undefined && (
        <NodeToStartingLine
          nodeId={
            autoPath.find(
              n =>
                n.type === ReefscapeActionType.PickupGround ||
                n.type === ReefscapeActionType.ScoreCoralL1 ||
                n.type === ReefscapeActionType.ScoreCoralL2 ||
                n.type === ReefscapeActionType.ScoreCoralL3 ||
                n.type === ReefscapeActionType.ScoreCoralL4 ||
                n.type === ReefscapeActionType.MissCoral,
            )!.nodeId! - 1
          }
        />
      )}
    </>,
  );
  autoPathSvgs.push(
    autoPath.map(node => {
      if (
        node.type === ReefscapeActionType.PickupGround ||
        node.type === ReefscapeActionType.ScoreCoralL1 ||
        node.type === ReefscapeActionType.ScoreCoralL2 ||
        node.type === ReefscapeActionType.ScoreCoralL3 ||
        node.type === ReefscapeActionType.ScoreCoralL4 ||
        node.type === ReefscapeActionType.MissCoral
      ) {
        return (
          <>
            <FilledNode nodeId={node.nodeId! - 1} status={node.state!} />
          </>
        );
      }
    }),
  );
  return (
    <View
      style={{
        backgroundColor: '#5F5F5F',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
      }}>
      <Svg width="357" height="315" viewBox="0 0 513 448" fill="none">
        <Rect width="513" height="448" fill="#0F1216" />
        <Rect
          x="14"
          y="17"
          width="58"
          height="186"
          stroke="#677EF5"
          stroke-width="6"
        />
        <Rect
          x="14"
          y="240"
          width="58"
          height="186"
          stroke="#FB4949"
          stroke-width="6"
        />
        <Path
          d="M219.905 195.232L268 167.464L316.095 195.232V250.768L268 278.536L219.905 250.768V195.232Z"
          stroke="#3A3A3A"
          stroke-width="6"
        />
        <Path
          d="M6 432H414.5L501.5 367.5V77L414.5 13.5H6"
          stroke="#3A3A3A"
          stroke-width="6"
        />
        <Path
          d="M206.847 187.482L267.5 152.464L328.153 187.482V257.518L267.5 292.536L206.847 257.518V187.482Z"
          stroke="#FB4949"
          stroke-width="6"
        />
        <Line
          x1="106"
          y1="14"
          x2="106"
          y2="432"
          stroke="#3A3A3A"
          stroke-width="6"
        />
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
};
