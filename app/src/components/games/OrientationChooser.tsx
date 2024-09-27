import React from 'react';
import {Pressable, View, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';

const Checkmark = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L8.5 15.5L2 9"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const OrientationChooser = ({
  selectedOrientation,
  setSelectedOrientation,
  selectedAlliance,
  setSelectedAlliance,
}: {
  selectedOrientation: string;
  setSelectedOrientation: (orientation: string) => void;
  selectedAlliance: string;
  setSelectedAlliance: (alliance: string) => void;
}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        padding: '5%',
        borderRadius: 10,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          textAlign: 'center',
          fontWeight: 'bold',
          paddingBottom: '3%',
        }}>
        Field Orientation
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: '1%',
        }}>
        <Pressable
          style={{
            backgroundColor:
              selectedOrientation === 'leftBlue' ? 'blue' : 'red',
            paddingVertical: '3%',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            if (selectedOrientation === 'leftBlue') {
              setSelectedAlliance('blue');
            } else {
              setSelectedAlliance('red');
            }
          }}>
          {selectedAlliance ===
          (selectedOrientation === 'leftBlue' ? 'blue' : 'red') ? (
            <Checkmark />
          ) : null}
        </Pressable>
        <View>
          <Pressable
            style={{
              backgroundColor: '#FFEBD9',
              justifyContent: 'center',
              flex: 1,
              paddingHorizontal: '10%',
              alignItems: 'center',
            }}
            onPress={() => {
              if (selectedOrientation === 'leftBlue') {
                setSelectedOrientation('leftRed');
              } else {
                setSelectedOrientation('leftBlue');
              }
            }}>
            <Svg width="24" height="22" viewBox="0 0 24 22" fill="none">
              <Path
                d="M2 6.24999H18.25L16.25 7.74999C16.1187 7.84848 16.008 7.97188 15.9244 8.11312C15.8408 8.25437 15.7858 8.41071 15.7626 8.57322C15.7393 8.73572 15.7484 8.9012 15.7891 9.06022C15.8298 9.21924 15.9015 9.36867 16 9.49999C16.1164 9.65524 16.2674 9.78124 16.441 9.86803C16.6146 9.95481 16.8059 9.99999 17 9.99999C17.2705 9.99999 17.5336 9.91227 17.75 9.74999L22.75 5.99999C22.9029 5.88334 23.0268 5.73298 23.1121 5.56062C23.1974 5.38826 23.2417 5.19855 23.2417 5.00624C23.2417 4.81394 23.1974 4.62422 23.1121 4.45186C23.0268 4.2795 22.9029 4.12915 22.75 4.01249L17.925 0.262492C17.6631 0.058607 17.3309 -0.0328877 17.0016 0.00813588C16.6722 0.0491595 16.3726 0.219341 16.1687 0.481242C15.9649 0.743144 15.8734 1.07531 15.9144 1.40467C15.9554 1.73403 16.1256 2.03361 16.3875 2.23749L18.35 3.74999H2C1.66848 3.74999 1.35054 3.88169 1.11612 4.11611C0.881696 4.35053 0.75 4.66847 0.75 4.99999C0.75 5.33151 0.881696 5.64945 1.11612 5.88387C1.35054 6.1183 1.66848 6.24999 2 6.24999ZM22 15H5.75L7.75 13.5C8.01522 13.3011 8.19055 13.005 8.23744 12.6768C8.28432 12.3486 8.19891 12.0152 8 11.75C7.80109 11.4848 7.50497 11.3094 7.17678 11.2626C6.84859 11.2157 6.51522 11.3011 6.25 11.5L1.25 15.25C1.09712 15.3666 0.97321 15.517 0.887921 15.6894C0.802632 15.8617 0.758262 16.0514 0.758262 16.2437C0.758262 16.4361 0.802632 16.6258 0.887921 16.7981C0.97321 16.9705 1.09712 17.1208 1.25 17.2375L6.075 20.9875C6.29319 21.1568 6.56131 21.2491 6.8375 21.25C7.0284 21.2495 7.21665 21.2054 7.38783 21.1209C7.55901 21.0363 7.70855 20.9138 7.825 20.7625C8.02799 20.5019 8.11958 20.1716 8.07977 19.8437C8.03995 19.5157 7.87196 19.2169 7.6125 19.0125L5.65 17.5H22C22.3315 17.5 22.6495 17.3683 22.8839 17.1339C23.1183 16.8995 23.25 16.5815 23.25 16.25C23.25 15.9185 23.1183 15.6005 22.8839 15.3661C22.6495 15.1317 22.3315 15 22 15Z"
                fill="black"
              />
            </Svg>
          </Pressable>
        </View>
        <Pressable
          style={{
            backgroundColor:
              selectedOrientation === 'leftBlue' ? 'red' : 'blue',
            paddingVertical: '3%',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            if (selectedOrientation === 'leftBlue') {
              setSelectedAlliance('red');
            } else {
              setSelectedAlliance('blue');
            }
          }}>
          {selectedAlliance ===
          (selectedOrientation === 'leftBlue' ? 'red' : 'blue') ? (
            <Checkmark />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
};
