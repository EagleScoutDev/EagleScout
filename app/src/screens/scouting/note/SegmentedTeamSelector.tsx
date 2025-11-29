import { UIText } from "../../../ui/UIText";
import { TouchableOpacity, View } from "react-native";
import { Color } from "../../../lib/color";
import { useTheme } from "../../../lib/contexts/ThemeContext.ts";

interface SegmentedTeamSelectorProps {
    color: string;
    teams: number[];
    selectedTeam: number;
    setSelectedTeam: (team: number) => void;
    completed: boolean[];
}

export function SegmentedTeamSelector({
    color,
    teams,
    selectedTeam,
    setSelectedTeam,
    completed,
}: SegmentedTeamSelectorProps) {
    const { colors } = useTheme();
    const buttonActiveBackgroundColor = color === "blue" ? Color.rgb(0, 0, 255) : Color.rgb(255, 0, 0);
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: "1%",
                marginRight: "5%",
                marginLeft: "5%",
            }}
        >
            <TouchableOpacity
                style={{
                    backgroundColor: selectedTeam === teams[0] ? buttonActiveBackgroundColor : colors.bg1.hex,
                    padding: "2%",
                    paddingVertical: "3%",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderRightColor: colors.bg0.hex,
                    flexDirection: "row",
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[0])}
            >
                <UIText
                    bold
                    style={{
                        color: selectedTeam === teams[0] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                        opacity: selectedTeam === teams[0] ? 1 : 0.6,
                        textAlign: "center",
                    }}
                >
                    {teams[0]}
                </UIText>
                {completed[0] && (
                    <UIText
                        bold
                        style={{
                            color: selectedTeam === teams[0] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                            opacity: selectedTeam === teams[0] ? 1 : 0.6,
                        }}
                    >
                        ✓
                    </UIText>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: selectedTeam === teams[1] ? buttonActiveBackgroundColor : colors.bg1.hex,
                    padding: "2%",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderRightColor: colors.bg0.hex,
                    flexDirection: "row",
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[1])}
            >
                <UIText
                    bold
                    style={{
                        color: selectedTeam === teams[1] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                        opacity: selectedTeam === teams[1] ? 1 : 0.6,
                        textAlign: "center",
                    }}
                >
                    {teams[1]}
                </UIText>
                {completed[1] && (
                    <UIText
                        bold
                        style={{
                            color: selectedTeam === teams[1] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                            opacity: selectedTeam === teams[1] ? 1 : 0.6,
                        }}
                    >
                        ✓
                    </UIText>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: selectedTeam === teams[2] ? buttonActiveBackgroundColor : colors.bg1.hex,
                    padding: "2%",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 5,
                }}
                onPress={() => setSelectedTeam(teams[2])}
            >
                <UIText
                    bold
                    style={{
                        color: selectedTeam === teams[2] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                        opacity: selectedTeam === teams[2] ? 1 : 0.6,
                        textAlign: "center",
                    }}
                >
                    {teams[2]}
                </UIText>
                {completed[2] && (
                    <UIText
                        bold
                        style={{
                            color: selectedTeam === teams[2] ? buttonActiveBackgroundColor.fg.hex : colors.fg.hex,
                            opacity: selectedTeam === teams[2] ? 1 : 0.6,
                        }}
                    >
                        ✓
                    </UIText>
                )}
            </TouchableOpacity>
        </View>
    );
}
