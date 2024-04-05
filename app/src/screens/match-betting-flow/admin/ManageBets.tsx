import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {MatchBet, MatchBets} from '../../../database/MatchBets';

const BetCard = ({matchNumber, matchId}: {matchNumber; matchId}) => {
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
          }}>
          <Text>Blue win</Text>
        </Pressable>
        <Pressable
          style={{
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}>
          <Text>Tie</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: colors.notification,
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}>
          <Text>Red win</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const ManageBets = () => {
  const [bets, setBets] = useState<MatchBet[]>([]);
  const [matches, setMatches] = useState<
    {
      matchNumber: number;
      matchId: number;
    }[]
  >([]);
  useEffect(() => {
    MatchBets.getMatchBets().then(bets => {
      setBets(bets);
      const matchesReduced = bets.reduce((acc, bet: MatchBet) => {
        if (!acc.find(m => m.matchId === bet.match_id)) {
          acc.push({matchNumber: bet.match_number!, matchId: bet.match_id});
        }
        return acc;
      }, [] as {matchNumber: number; matchId: number}[]);
      console.log(matchesReduced);
      setMatches(matchesReduced);
    });
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
          <BetCard matchNumber={matchNumber} matchId={matchId} />
        ))}
      </View>
    </View>
  );
};
