import { useTheme } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { getIdealTextColor, parseColor } from '../../../lib/color';

export const SegmentedTeamSelector = ({
    color,
    teams,
    selectedTeam,
    setSelectedTeam,
    completed,
}: {
    color: string;
    teams: number[];
    selectedTeam: number;
    setSelectedTeam: (team: number) => void;
    completed: boolean[];
}) => {
    const { colors } = useTheme();
    const buttonActiveBackgroundColor = color === 'blue' ? 'blue' : 'red';
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: '1%',
                marginRight: '5%',
                marginLeft: '5%',
            }}>
            <TouchableOpacity
                style={{
                    backgroundColor:
                        selectedTeam === teams[0]
                            ? buttonActiveBackgroundColor
                            : colors.card,
                    padding: '2%',
                    paddingVertical: '3%',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderRightColor: colors.background,
                    flexDirection: 'row',
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[0])}>
                <Text
                    style={{
                        color:
                            selectedTeam === teams[0]
                                ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                : colors.text,
                        opacity: selectedTeam === teams[0] ? 1 : 0.6,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    {teams[0]}
                </Text>
                {completed[0] && (
                    <Text
                        style={{
                            color:
                                selectedTeam === teams[0]
                                    ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                    : colors.text,
                            opacity: selectedTeam === teams[0] ? 1 : 0.6,
                            fontWeight: 'bold',
                        }}>
                        ✓
                    </Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor:
                        selectedTeam === teams[1]
                            ? buttonActiveBackgroundColor
                            : colors.card,
                    padding: '2%',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderRightColor: colors.background,
                    flexDirection: 'row',
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[1])}>
                <Text
                    style={{
                        color:
                            selectedTeam === teams[1]
                                ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                : colors.text,
                        opacity: selectedTeam === teams[1] ? 1 : 0.6,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    {teams[1]}
                </Text>
                {completed[1] && (
                    <Text
                        style={{
                            color:
                                selectedTeam === teams[1]
                                    ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                    : colors.text,
                            opacity: selectedTeam === teams[1] ? 1 : 0.6,
                            fontWeight: 'bold',
                        }}>
                        ✓
                    </Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor:
                        selectedTeam === teams[2]
                            ? buttonActiveBackgroundColor
                            : colors.card,
                    padding: '2%',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[2])}>
                <Text
                    style={{
                        color:
                            selectedTeam === teams[2]
                                ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                : colors.text,
                        opacity: selectedTeam === teams[2] ? 1 : 0.6,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                    {teams[2]}
                </Text>
                {completed[2] && (
                    <Text
                        style={{
                            color:
                                selectedTeam === teams[2]
                                    ? getIdealTextColor(parseColor(buttonActiveBackgroundColor))
                                    : colors.text,
                            opacity: selectedTeam === teams[2] ? 1 : 0.6,
                            fontWeight: 'bold',
                        }}>
                        ✓
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};
