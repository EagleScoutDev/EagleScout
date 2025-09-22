import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { OrientationChooser } from '../games/OrientationChooser';
import type { Alliance, Orientation } from '../../games/common';
import type { Setter } from '../../lib/react/types';

export interface MatchInformation {
    match: number | null,
    setMatch: Setter<number | null>
    team: number | null
    setTeam: Setter<number | null>
    teamsForMatch: number[]
    orientation: Orientation
    setOrientation: Setter<Orientation>
    alliance: Alliance
    setAlliance: Setter<Alliance>
}
export function MatchInformation({
    match,
    setMatch,
    team,
    setTeam,
    teamsForMatch,
    orientation,
    setOrientation,
    alliance,
    setAlliance,
}: MatchInformation) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        textInput: {
            // height: 40,
            borderColor: 'gray',
            borderBottomWidth: 2,
            // borderRadius: 10,
            // marginBottom: 15,
            padding: 10,
            color: colors.text,
            fontFamily: 'monospace',
            minWidth: '20%',
            textAlign: 'center',
        },
        badInput: {
            // height: 40,
            borderColor: colors.notification,
            borderBottomWidth: 2,
            // borderRadius: 10,
            // marginBottom: 15,
            padding: 10,
            color: colors.notification,
            fontFamily: 'monospace',
            minWidth: '20%',
            textAlign: 'center',
        },
        subtitle: {
            textAlign: 'left',
            padding: '2%',
            color: colors.text, //getLighterColor(parseColor(colors.primary)),
            opacity: 0.6,
            fontWeight: 'bold',
        },
        label: {
            color: colors.text,
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: 16,
            // minWidth: '70%',
        },
        box: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginVertical: '3%',
        },
        container: {
            flexDirection: 'column',
            minWidth: '85%',
            backgroundColor: colors.card,
            margin: '2%',
            padding: '2%',
            borderRadius: 10,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>MATCH INFORMATION</Text>
            <View style={styles.box}>
                <Text style={styles.label}>Match Number</Text>
                <TextInput
                    style={
                        match !== null && (match > 400 || match === 0)
                            ? styles.badInput
                            : styles.textInput
                    }
                    placeholder={'000'}
                    maxLength={3}
                    placeholderTextColor={'gray'}
                    value={match === null ? "" : match.toString()} // TODO: Use an actual NumberInput element
                    onChangeText={text => setMatch(text === "" ? null : parseInt(text))}
                    keyboardType={'numeric'}
                />
            </View>
            {match !== null && match === 0 && (
                <Text style={{ color: colors.notification, textAlign: 'center' }}>
                    Match number cannot be 0
                </Text>
            )}
            {match !== null && match > 400 && (
                <Text style={{ color: colors.notification, textAlign: 'center' }}>
                    Match number cannot be greater than 400
                </Text>
            )}

            <View style={styles.box}>
                <Text style={styles.label}>Team Number</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={'000'}
                    placeholderTextColor={'gray'}
                    maxLength={7}
                    value={team === null ? "" : team.toString()} // TODO: Use an actual NumberInput element
                    onChangeText={text => setTeam(text === "" ? null : parseInt(text))}
                    keyboardType={'numeric'}
                />
            </View>
            {team !== null && !teamsForMatch.includes(team) && (
                <Text style={{ color: colors.notification, textAlign: 'center' }}>
                    Warning: Team {team} is not in this match
                </Text>
            )}
            <OrientationChooser
                orientation={orientation}
                setOrientation={setOrientation}
                alliance={alliance}
                setAlliance={setAlliance}
            />
        </View>
    );
}
