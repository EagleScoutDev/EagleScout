import { useEffect, useState } from "react";
import { ActivityIndicator, LayoutAnimation, View } from "react-native";

import { type CompetitionReturnData, CompetitionsDB } from "../../database/Competitions";
import { Dropdown } from "react-native-element-dropdown";
import type { Setter } from "../../lib/util/react/types";
import { useTheme } from "../../lib/contexts/ThemeContext.ts";

export interface CompetitionChangerProps {
    currentCompId: number;
    setCurrentCompId: Setter<number>;
    loading: boolean;
}
export function CompetitionChanger({ currentCompId, setCurrentCompId, loading }: CompetitionChangerProps) {
    const { colors } = useTheme();
    const [isActive, setIsActive] = useState(false);

    const [competitionName, setCompetitionName] = useState("Loading...");

    const [competitionsList, setCompetitionsList] = useState<CompetitionReturnData[]>([]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isActive]);

    useEffect(() => {
        if (currentCompId === -1) {
            CompetitionsDB.getCurrentCompetition().then((competition) => {
                if (competition != null) {
                    setCurrentCompId(competition.id);
                } else {
                    // TODO: handle when there is no current competition
                    setCurrentCompId(-1);
                }
            });
        }
        CompetitionsDB.getCompetitions().then((competitions) => {
            // sort competitions by date, in descending order
            let temp_comp = competitions;
            temp_comp.sort((a, b) => {
                return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
            });
            setCompetitionsList(temp_comp);

            // set the current competition name
            competitions.forEach((competition) => {
                if (competition.id === currentCompId) {
                    setCompetitionName(competition.name);
                }
            });
        });
    }, [currentCompId, setCurrentCompId]);

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Dropdown
                data={competitionsList.map((competition) => {
                    return {
                        label: competition.name,
                        value: competition.id,
                    };
                })}
                labelField={"label"}
                valueField={"value"}
                disable={competitionsList.length === 0}
                placeholderStyle={{
                    color: colors.fg.hex,
                }}
                placeholder={
                    loading
                        ? "Loading..."
                        : competitionsList.length > 0
                        ? "FormSelect Competition"
                        : "No competitions found"
                }
                onChange={(item) => {
                    setCurrentCompId(item.value);
                    setCompetitionName(item.label);
                    setIsActive(false);
                }}
                activeColor={colors.bg1.hex}
                style={{
                    borderRadius: 10,
                    padding: "2%",
                    marginVertical: "2%",
                    backgroundColor: colors.bg0.hex,
                    paddingLeft: "6%",
                }}
                selectedTextStyle={{
                    color: colors.fg.hex,
                    fontWeight: "bold",
                    backgroundColor: colors.bg0.hex,
                }}
                containerStyle={{
                    borderRadius: 10,
                    backgroundColor: colors.bg0.hex,
                }}
                itemContainerStyle={{
                    borderRadius: 10,
                    borderBottomWidth: 1,
                    borderColor: colors.border.hex,
                    backgroundColor: colors.bg0.hex,
                }}
                itemTextStyle={{
                    color: colors.fg.hex,
                }}
                value={{
                    label: competitionName,
                    value: currentCompId,
                }}
                renderLeftIcon={() => {
                    if (loading) {
                        return <ActivityIndicator style={{ marginRight: "4%" }} size={"small"} color={colors.fg.hex} />;
                    }
                }}
            />
        </View>
    );
}
