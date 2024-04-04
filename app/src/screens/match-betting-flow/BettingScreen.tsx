import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {Slider} from '@miblanchard/react-native-slider';

interface Player {
  id: string;
  name: string;
  emoji: string;
  betAmount: number;
  betAlliance: string;
}

export const BettingScreen = ({route}) => {
  const {matchNumber} = route.params;
  console.log('matchNumber', matchNumber);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [players, setPlayers] = useState([
    {
      id: '1',
      name: 'Caleb',
      emoji: '😎',
      betAmount: 100,
      betAlliance: 'red',
    },
    {
      id: '2',
      name: 'Vir',
      emoji: '😍',
      betAmount: 200,
      betAlliance: 'blue',
    },
    {
      id: '3',
      name: 'Alan',
      emoji: '😐',
      betAmount: 200,
      betAlliance: 'blue',
    },
    {
      id: '4',
      name: 'Jonathan',
      emoji: '😘',
      betAmount: 200,
      betAlliance: 'blue',
    },
    {
      id: '5',
      name: 'Kyle',
      emoji: '🤩',
      betAmount: 200,
      betAlliance: 'blue',
    },
  ]);
  const [selectedAlliance, setSelectedAlliance] = useState();
  const [betAmount, setBetAmount] = useState(0);
  const [emoji, setEmoji] = useState('🙄');

  const [betActive, setBetActive] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);

  return (
    <SafeAreaView>
      <Pressable
        style={{
          position: 'absolute',
          top: insets.top,
          left: 20,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path d="M15 18l-6-6 6-6" />
        </Svg>
      </Pressable>
      <View
        style={{
          height: '95%',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginTop: '5%',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {players.map((player: Player) => (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 60,
                  fontWeight: 'bold',
                }}>
                {player.emoji}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                }}>
                {player.name}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {player.betAmount}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{color: colors.text, fontSize: 30, fontWeight: 'bold'}}>
          Match {matchNumber}
        </Text>
        <View style={{flexDirection: 'row', gap: 20, width: '80%'}}>
          <Pressable
            style={{
              backgroundColor: colors.card,
              opacity: selectedAlliance === 'blue' ? 1 : 0.5,
              padding: 20,
              borderRadius: 10,
              flex: 1,
            }}
            onPress={() => {
              setSelectedAlliance('blue');
            }}>
            <Image
              source={require('../../assets/dozerblue.png')}
              style={{
                width: '100%',
                height: null,
                aspectRatio: 1,
              }}
            />
          </Pressable>
          <Pressable
            style={{
              backgroundColor: colors.card,
              opacity: selectedAlliance === 'red' ? 1 : 0.5,
              padding: 20,
              borderRadius: 10,
              flex: 1,
            }}
            onPress={() => {
              setSelectedAlliance('red');
            }}>
            <Image
              source={require('../../assets/dozerred.png')}
              style={{
                width: '100%',
                height: null,
                aspectRatio: 1,
              }}
            />
          </Pressable>
        </View>
        <View style={{flex: 1}} />
        {betActive && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              gap: 20,
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                alignSelf: 'center',
              }}>
              {currentBet}
            </Text>
            <Slider
              containerStyle={{
                flex: 1,
                alignSelf: 'center',
                justifySelf: 'center',
              }}
              value={currentBet}
              onValueChange={setCurrentBet}
              minimumValue={1}
              maximumValue={1000}
              step={1}
            />
            <Pressable
              style={{
                backgroundColor: colors.card,
                borderRadius: 99,
                padding: 20,
              }}
              onPress={() => {
                setBetActive(false);
                setCurrentBet(0);
              }}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 16 16"
                fill="none"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round">
                <Path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
              </Svg>
            </Pressable>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
            gap: 20,
          }}>
          <ImageBackground
            source={require('../../assets/betGradient.png')}
            style={{
              flex: 1,
              borderRadius: 10,
              overflow: 'hidden',
              alignSelf: 'flex-start',
            }}
            resizeMode="cover">
            <Pressable
              style={{
                backgroundColor: colors.card,
                padding: 20,
                borderRadius: 10,
                alignSelf: 'flex-start',
                width: '100%',
                opacity: selectedAlliance ? 0.5 : 1,
              }}
              onPress={() => {
                setBetActive(true);
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Bet
              </Text>
            </Pressable>
          </ImageBackground>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 60,
                fontWeight: 'bold',
              }}>
              {emoji}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {betAmount}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
