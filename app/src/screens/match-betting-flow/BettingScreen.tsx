import {RouteProp, useNavigation, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {Slider} from '@miblanchard/react-native-slider';
import {supabase} from '../../lib/supabase';
import UserAttributesDB from '../../database/UserAttributes';
import {RealtimeChannel} from '@supabase/supabase-js';
import ProfilesDB, {ProfilesReturnData} from '../../database/Profiles';
import {MatchBets} from '../../database/MatchBets';

interface Player {
  id: string;
  name: string;
  emoji: string;
  betAmount: number;
  betAlliance: string;
}

export const BettingScreen = ({
  route,
}: {
  route: RouteProp<
    {
      BettingScreen: {matchNumber: number};
    },
    'BettingScreen'
  >;
}) => {
  const {matchNumber} = route.params;
  console.log('matchNumber', matchNumber);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedAlliance, setSelectedAlliance] = useState<string>();
  const [betAmount, setBetAmount] = useState(0);
  const [userProfile, setUserProfile] = useState<ProfilesReturnData | null>(
    null,
  );

  const [betActive, setBetActive] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);

  const [subscribed, setSubscribed] = useState(false);
  const [supabaseChannel, setSupabaseChannel] =
    useState<RealtimeChannel | null>(null);

  useEffect(() => {
    (async () => {
      const user = await UserAttributesDB.getCurrentUserAttribute();
      if (!user) {
        return;
      }
      const profile = await ProfilesDB.getProfile(user.id);
      setUserProfile(profile);
      const channel = supabase.channel(`match-betting-${matchNumber}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });
      setSupabaseChannel(channel);
      channel
        .on('presence', {event: 'sync'}, () => {
          const newState = channel.presenceState();
          console.log('sync', newState);
          setPlayers(
            Object.entries(newState).map(([key, [value]]: [string, any]) => ({
              id: key,
              name: value.user_name,
              emoji: value.user_emoji,
              betAmount: value.bet_amount,
              betAlliance: value.bet_alliance,
            })),
          );
        })
        .on('presence', {event: 'join'}, ({key, newPresences}) => {
          console.log('join', key, newPresences);
          if (key === user.id) {
            return;
          }
          const newPlayer = Object.values(newPresences).find(
            (presence: any) => presence.user_id === key,
          );
          if (!newPlayer) {
            return;
          }
          setPlayers(prev => [
            ...prev,
            {
              id: key,
              name: newPlayer.user_name,
              emoji: newPlayer.user_emoji,
              betAmount: newPlayer.bet_amount,
              betAlliance: newPlayer.bet_alliance,
            },
          ]);
        })
        .on('presence', {event: 'leave'}, ({key, leftPresences}) => {
          console.log('leave', key, leftPresences);
        })
        .on('broadcast', {event: 'bet'}, ({payload}) => {
          console.log('broadcast', payload);
          setPlayers(prev =>
            prev.map(player => {
              if (player.id === payload.user_id) {
                return {
                  ...player,
                  betAmount: payload.bet_amount,
                  betAlliance: payload.bet_alliance,
                };
              }
              return player;
            }),
          );
        })
        .subscribe(async status => {
          if (status !== 'SUBSCRIBED') {
            return;
          }
          const presenceTrackStatus = await channel.track({
            user_id: user.id,
            user_name: profile?.name,
            user_emoji: profile?.emoji,
            bet_amount: 0,
            bet_alliance: '',
          });
          console.log('presenceTrackStatus', presenceTrackStatus);
          setSubscribed(true);
        });
    })();
  }, [matchNumber]);

  useEffect(() => {
    console.log('effect', subscribed, supabaseChannel, selectedAlliance);
    if (!selectedAlliance || !supabaseChannel) {
      return;
    }
    console.log('sending bet', betAmount, selectedAlliance);
    supabaseChannel.send({
      type: 'broadcast',
      event: 'bet',
      payload: {
        user_id: userProfile?.id,
        user_name: userProfile?.name,
        user_emoji: userProfile?.emoji,
        bet_amount: betAmount,
        bet_alliance: selectedAlliance,
      },
    });
  }, [subscribed, supabaseChannel, selectedAlliance, betAmount]);

  if (!userProfile) {
    return null;
  }

  console.log('players', players);

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
          {players
            .filter((p: Player) => p.id !== userProfile.id)
            .map((player: Player) => (
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
                    color: player.betAlliance
                      ? player.betAlliance
                      : colors.text,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {player.betAmount}
                </Text>
              </View>
            ))}
          {!players ||
            (players.length < 2 && (
              <Text style={{color: colors.text, fontSize: 18}}>
                Waiting for players...
              </Text>
            ))}
        </View>

        <Text style={{color: colors.text, fontSize: 30, fontWeight: 'bold'}}>
          Match {matchNumber}
        </Text>
        <Text style={{color: colors.text, fontSize: 18}}>Select Alliance</Text>
        <View style={{flexDirection: 'row', gap: 20, width: '80%'}}>
          {!selectedAlliance ? (
            <>
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
            </>
          ) : (
            <Text style={{color: colors.text, fontSize: 18}}>
              Your selected alliance: {selectedAlliance}
            </Text>
          )}
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
              }}
              value={currentBet}
              onValueChange={(value: Array<number>) => setCurrentBet(value[0])}
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
              onPress={async () => {
                setBetActive(false);
                setCurrentBet(0);
                setBetAmount((prev: number) => prev + Number(currentBet));
                console.log('BET AMOUNT', betAmount, currentBet);
                if (betAmount === 0) {
                  await MatchBets.createMatchBet(
                    userProfile.id,
                    matchNumber,
                    selectedAlliance!,
                    Number(currentBet),
                  );
                } else {
                  await MatchBets.updateMatchBet(
                    userProfile.id,
                    matchNumber,
                    Number(currentBet) + betAmount,
                  );
                }
              }}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 16 16"
                fill="none"
                stroke={colors.text}
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
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <ImageBackground
              source={require('../../assets/betGradient.png')}
              style={{
                width: '100%',
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
                  opacity:
                    selectedAlliance &&
                    userProfile.scoutcoins > 0 &&
                    players.length >= 2
                      ? 0.5
                      : 1,
                }}
                onPress={() => {
                  if (
                    userProfile.scoutcoins < 0 ||
                    !selectedAlliance ||
                    players.length < 2
                  ) {
                    return;
                  }
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
            <Text>Your balance: {userProfile.scoutcoins}</Text>
          </View>
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
              {userProfile.emoji}
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
