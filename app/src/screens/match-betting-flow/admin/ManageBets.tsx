import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {MatchBet, MatchBets} from '../../../database/MatchBets';
import {supabase} from '../../../lib/supabase';

const BetCard = ({
  matchNumber,
  matchId,
  onConfirm,
}: {
  matchNumber: number;
  matchId: number;
  onConfirm: (result: 'red' | 'blue' | 'tie') => void;
}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.card,
        padding: 10,
        margin: 10,
        borderRadius: 10,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>
        Match {matchNumber}
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}
          onPress={() => onConfirm('blue')}>
          <Text
            style={{
              color: colors.text,
            }}>
            Blue win
          </Text>
        </Pressable>
        <Pressable
          style={{
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}
          onPress={() => onConfirm('tie')}>
          <Text
            style={{
              color: colors.card,
            }}>
            Tie
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: colors.notification,
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}
          onPress={() => onConfirm('red')}>
          <Text
            style={{
              color: colors.text,
            }}>
            Red win
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export const ManageBets = () => {
  const [matches, setMatches] = useState<
    {
      matchNumber: number;
      matchId: number;
    }[]
  >([]);
  const refresh = () => {
    MatchBets.getMatchBets().then(bets => {
      const matchesReduced = bets.reduce((acc, bet: MatchBet) => {
        if (!acc.find(m => m.matchId === bet.match_id)) {
          acc.push({matchNumber: bet.match_number!, matchId: bet.match_id});
        }
        return acc;
      }, [] as {matchNumber: number; matchId: number}[]);
      console.log(matchesReduced);
      setMatches(matchesReduced);
    });
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
        }}>
        Active Bets
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {matches.map(({matchNumber, matchId}) => (
          <BetCard
            matchNumber={matchNumber}
            matchId={matchId}
            onConfirm={async result => {
              await supabase.functions.invoke('confirm-bet', {
                body: JSON.stringify({matchId, result}),
              });
              refresh();
            }}
          />
        ))}
      </View>
    </View>
  );
};
