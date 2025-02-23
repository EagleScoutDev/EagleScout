import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {AutoPath} from './AutoPath';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  interpolate,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
} from 'react-native-reanimated';

// import {AnimatedView} from 'react-native-reanimated/lib/typescript/component/View';

export const ReefscapeField = ({
  fieldOrientation,
  selectedAlliance,
  setLevelChooserActive,
  setChosenReefPosition,
  onPieceIntake,
  onPieceMissed,
  onPieceReset,
  autoPath,
}: {
  fieldOrientation: string;
  selectedAlliance: string;
  setLevelChooserActive: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenReefPosition: React.Dispatch<React.SetStateAction<number>>;
  onPieceIntake: (piece: number) => void;
  onPieceMissed: (piece: number) => void;
  onPieceReset: (piece: number) => void;
  autoPath: AutoPath;
}) => {
  const Piece = ({pieceID, type}: {pieceID: number; type: string}) => {
    const autoPiece = useMemo(
      () => autoPath.find(piece => piece.nodeId === pieceID),
      [autoPath],
    );
    return (
      <Pressable
        style={{
          backgroundColor: type === 'algae' ? '#72d125' : 'white',
          borderColor:
            type === 'algae'
              ? !autoPiece
                ? '#72d125'
                : autoPiece.state === 'success'
                ? '#89ff2a'
                : 'black'
              : !autoPiece
              ? '#ffffff'
              : autoPiece.state === 'success'
              ? '#b1a7a0'
              : 'black',
          borderWidth: 8,
          width: type === 'algae' ? 50 : 40,
          height: type === 'algae' ? 50 : 40,
          marginVertical: 14,
          borderRadius: 25,
          justifyContent: 'center',
          flexShrink: 1,
        }}
        onPress={() => {
          if (autoPiece && autoPiece.state === 'success') {
            onPieceMissed(pieceID);
          } else if (autoPiece && autoPiece.state === 'missed') {
            onPieceReset(pieceID);
          } else {
            onPieceIntake(pieceID);
          }
          ReactNativeHapticFeedback.trigger('impactLight');
        }}>
        {autoPiece && (
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
            }}>
            {autoPiece.order + 1}
          </Text>
        )}
      </Pressable>
    );
  };
  const Reef = () => {
    return (
      <View
        style={{
          flex: 12,
          flexShrink: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Svg
          style={{flexShrink: 1}}
          width="220"
          height="200"
          viewBox="0 0 310 283"
          fill={selectedAlliance === 'blue' ? '#0b6fdf' : '#e43737'}>
          <Path
            d="M164.392 113C159.773 121 148.226 121 143.608 113L89.0481 18.5C84.4293 10.5 90.2028 0.500014 99.4404 0.500015L208.56 0.500027C217.797 0.500028 223.571 10.5 218.952 18.5L164.392 113Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setChosenReefPosition(7);
              setLevelChooserActive(true);
            }}
          />
          <Path
            d="M188.285 134.344C179.047 134.344 173.274 124.344 177.892 116.344L232.452 21.8442C237.071 13.8442 248.618 13.8442 253.237 21.8442L307.796 116.344C312.415 124.344 306.641 134.344 297.404 134.344L188.285 134.344Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setChosenReefPosition(fieldOrientation === 'leftBlue' ? 8 : 12);
              setLevelChooserActive(true);
            }}
          />
          <Path
            d="M177.892 163.344C173.273 155.344 179.047 145.344 188.285 145.344L297.404 145.344C306.641 145.344 312.415 155.344 307.796 163.344L253.237 257.844C248.618 265.844 237.071 265.844 232.452 257.844L177.892 163.344Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setChosenReefPosition(fieldOrientation === 'leftBlue' ? 11 : 9);
              setLevelChooserActive(true);
            }}
          />
          <Path
            d="M143.524 169.91C148.143 161.91 159.69 161.91 164.309 169.91L218.868 264.41C223.487 272.41 217.714 282.41 208.476 282.41H99.3568C90.1192 282.41 84.3457 272.41 88.9645 264.41L143.524 169.91Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');

              // setChosenReefPosition(10);
              setChosenReefPosition(fieldOrientation === 'leftBlue' ? 9 : 11);
              setLevelChooserActive(true);
            }}
          />
          <Path
            d="M122.143 145.565C131.381 145.565 137.154 155.565 132.536 163.565L77.9759 258.065C73.3571 266.065 61.8101 266.065 57.1913 258.065L2.63173 163.565C-1.98707 155.565 3.78643 145.565 13.024 145.565L122.143 145.565Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setChosenReefPosition(10);
              setLevelChooserActive(true);
            }}
          />
          <Path
            d="M131.796 116.344C136.415 124.344 130.641 134.344 121.404 134.344L12.2847 134.344C3.04705 134.344 -2.72644 124.344 1.89235 116.344L56.452 21.8442C61.0708 13.8442 72.6178 13.8442 77.2366 21.8442L131.796 116.344Z"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight');
              setChosenReefPosition(fieldOrientation === 'leftBlue' ? 12 : 8);
              setLevelChooserActive(true);
            }}
          />
        </Svg>
      </View>
    );
  };
  const offset =
    fieldOrientation === 'leftBlue'
      ? selectedAlliance === 'blue'
        ? 90
        : -90
      : selectedAlliance === 'blue'
      ? -90
      : 90;

  const sensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 114, // Update every 114ms
  });
  const animatedStyle = useAnimatedStyle(() => {
    const {qw, qx, qy, qz} = sensor.sensor.value;

    // Convert quaternion to Euler angles (roll, pitch, yaw)
    const yaw = Math.atan2(
      2 * (qw * qz + qx * qy),
      1 - 2 * (qy * qy + qz * qz),
    );

    let yawDeg = (yaw * 180) / Math.PI + offset;
    // Find the nearest multiple of 90 degrees
    const snappedYaw = Math.round(yawDeg / 90) * 90;
    // Only snap if within 10 degrees of the target
    if (Math.abs(yawDeg - snappedYaw) <= 11) {
      // yawDeg = withTiming(snappedYaw, {duration: 300});
      yawDeg = snappedYaw;
    }
    return {
      transform: [
        {rotate: `${yawDeg}deg`},
        {
          scale: interpolate(
            Math.abs(yawDeg),
            [0, 90, 180, 270, 360],
            [1, 0.8, 1, 0.8, 1],
          ),
        }, // Scale dynamically
      ],
    };
  });
  return (
    <View
      style={{
        backgroundColor: '#cfcfcf',
        width: '100%',
        height: '60%',
        padding: '0.01%',
        borderRadius: 10,
        marginHorizontal: '10%',
        overflow: 'hidden',
      }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          animatedStyle,
          {
            aspectRatio: 1,
            flexDirection: 'column',
            alignSelf: 'center',
            justifyContent: 'space-between',
          },
        ]}>
        <Reef />
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flexGrow: 1, // Allow it to grow naturally
            flexShrink: 2,
            flexDirection:
              fieldOrientation === 'leftBlue' ? 'row-reverse' : 'row',
          }}>
          <Piece pieceID={1} type={'algae'} />
          <Piece pieceID={2} type={'algae'} />
          <Piece pieceID={3} type={'algae'} />
        </View>
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flexGrow: 1, // Allow it to grow naturally
            flexShrink: 2,
            flexDirection:
              fieldOrientation === 'leftBlue' ? 'row-reverse' : 'row',
          }}>
          <Piece pieceID={4} type={'Coral'} />
          <Piece pieceID={5} type={'Coral'} />
          <Piece pieceID={6} type={'Coral'} />
        </View>
      </Animated.View>
    </View>
  );
};
