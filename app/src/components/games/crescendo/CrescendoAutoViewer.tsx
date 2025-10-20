import {View, Text} from 'react-native';
import {Svg, Line, Path, Circle} from 'react-native-svg';
import type { CrescendoAutoPath } from './CrescendoAutoPath.ts';
import {CrescendoActionType} from './CrescendoActions.tsx';

const notePositions = [
  {x: 229.5, y: 63.5},
  {x: 229.5, y: 113.5},
  {x: 229.5, y: 164.5},
  {x: 30, y: 49},
  {x: 30, y: 107},
  {x: 30, y: 166},
  {x: 30, y: 225},
  {x: 30, y: 284},
];

const NoteToSpeakerLine = ({noteId}: {noteId: number}) => {
  return (
    <>
      <Line
        x1={notePositions[noteId].x}
        y1={notePositions[noteId].y}
        x2="270"
        y2="113.5"
        stroke="#637AF4"
        strokeWidth="4"
      />
      <Circle cx="270" cy="113.5" r="12" fill="#637AF4" />
    </>
  );
};

const NoteToNoteLine = ({
  noteId1,
  noteId2,
}: {
  noteId1: number;
  noteId2: number;
}) => {
  return (
    <Line
      x1={notePositions[noteId1].x}
      y1={notePositions[noteId1].y}
      x2={notePositions[noteId2].x}
      y2={notePositions[noteId2].y}
      stroke="#637AF4"
      strokeWidth="4"
    />
  );
};

const DefaultNote = ({noteId}: {noteId: number}) => (
  <Circle
    cx={notePositions[noteId].x}
    cy={notePositions[noteId].y}
    r="10.5"
    fill="white"
    stroke="#FF7A00"
    strokeWidth="3"
  />
);

const FilledNote = ({
  noteId,
  status,
}: {
  noteId: number;
  status: 'success' | 'missed';
}) => (
  <>
    <Circle
      cx={notePositions[noteId].x}
      cy={notePositions[noteId].y}
      r="12"
      fill="#637AF4"
    />
    {status === 'success' && (
      <>
        <Line
          x1={notePositions[noteId].x - 5}
          y1={notePositions[noteId].y}
          x2={notePositions[noteId].x - 2}
          y2={notePositions[noteId].y + 5}
          stroke="white"
          strokeWidth="3"
        />
        <Line
          x1={notePositions[noteId].x - 2}
          y1={notePositions[noteId].y + 5}
          x2={notePositions[noteId].x + 5}
          y2={notePositions[noteId].y - 5}
          stroke="white"
          strokeWidth="3"
        />
      </>
    )}
    {status === 'missed' && (
      <>
        <Line
          x1={notePositions[noteId].x - 5}
          y1={notePositions[noteId].y - 5}
          x2={notePositions[noteId].x + 5}
          y2={notePositions[noteId].y + 5}
          stroke="white"
          strokeWidth="3"
        />
        <Line
          x1={notePositions[noteId].x - 5}
          y1={notePositions[noteId].y + 5}
          x2={notePositions[noteId].x + 5}
          y2={notePositions[noteId].y - 5}
          stroke="white"
          strokeWidth="3"
        />
      </>
    )}
  </>
);

export const CrescendoAutoViewer = ({autoPath}: {autoPath: CrescendoAutoPath}) => {
  if (!autoPath || autoPath.length === 0) {
    return (
      <View
        style={{
          backgroundColor: '#5F5F5F',
          alignItems: 'center',
          padding: 10,
          borderRadius: 10,
        }}>
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
          No Auto Paths found.
        </Text>
      </View>
    );
  }
  const autoPathSvgs = [];
  autoPathSvgs.push(
    autoPath.map(note => {
      if (note.type !== CrescendoActionType.PickupGround) {
        return;
      }
      const prevPickup = autoPath.findIndex(
        n =>
          n?.type === CrescendoActionType.PickupGround &&
          n.order === note.order - 1,
      );
      return (
        <>
          {prevPickup !== -1 && (
            <NoteToNoteLine
              noteId1={autoPath[prevPickup].noteId! - 1}
              noteId2={note.noteId! - 1}
            />
          )}
        </>
      );
    }),
  );
  autoPathSvgs.push(
    <>
      {autoPath.find(n => n.type === CrescendoActionType.PickupGround) !==
        undefined && (
        <NoteToSpeakerLine
          noteId={
            autoPath.find(n => n.type === CrescendoActionType.PickupGround)!
              .noteId! - 1
          }
        />
      )}
    </>,
  );
  autoPathSvgs.push(
    autoPath.map(note => {
      // if (note.type === CrescendoActionType.ScoreSpeaker) {
      //   const noteId = autoPath.findIndex(
      //     n =>
      //       n?.type === CrescendoActionType.PickupGround &&
      //       n.order === note.order,
      //   );
      //   if (noteId === -1) {
      //     return null;
      //   }
      //   return <NoteToSpeakerLine noteId={noteId} />;
      // }
      if (note.type === CrescendoActionType.PickupGround) {
        return (
          <>
            <FilledNote noteId={note.noteId! - 1} status={note.state!} />
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
      <Svg width="319" height="311" viewBox="0 0 319 311" fill="none">
        <Line
          x1="119.543"
          y1="111.77"
          x2="148.543"
          y2="162.77"
          stroke="#353535"
          strokeWidth="7"
        />
        <Line
          x1="205.5"
          y1="163"
          x2="148.5"
          y2="163"
          stroke="#353535"
          strokeWidth="7"
        />
        <Line
          x1="119.457"
          y1="213.77"
          x2="148.457"
          y2="162.77"
          stroke="#353535"
          strokeWidth="7"
        />
        <Path d="M29.5 19V309" stroke="#737373" strokeWidth="3" />
        <Path d="M253.5 309V289.5L317.5 252" stroke="#677EF5" strokeWidth="3" />
        <Path
          d="M317.5 77.5L286.5 95.5V131L317.5 149.5"
          stroke="#F94545"
          strokeWidth="3"
        />
        <Path
          d="M0 19H317.5V271L254.5 309H0"
          stroke="#353535"
          strokeWidth="3"
        />
        <Path
          d="M114 210.5V116L124 110L207 158V169.5L124 217L114 210.5Z"
          stroke="#F94545"
          strokeWidth="3"
        />
        <Path d="M114 19V309" stroke="#FB4949" strokeWidth="3" />
        {new Array(8).fill(0).map((_, i) => (
          <DefaultNote noteId={i} />
        ))}
        {autoPathSvgs}
      </Svg>
    </View>
  );
};
