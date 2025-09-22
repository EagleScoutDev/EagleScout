import { ActivityIndicator, ScrollView, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { CompetitionReturnData } from "../../../database/Competitions";

export interface CompetitionListProps {
    competitionList: CompetitionReturnData[];
    competitionsLoading: boolean;
    processing: boolean;
    onCompetitionPress: (comp: CompetitionReturnData) => void;
}

export const CompetitionList = ({
    competitionList,
    competitionsLoading,
    processing,
    onCompetitionPress,
}: CompetitionListProps) => {
    const { colors } = useTheme();
    return (
        <ScrollView>
            {competitionsLoading && <ActivityIndicator size="large" color={colors.text} />}
            {competitionList.length === 0 && !competitionsLoading && (
                <Text style={{ color: colors.text, textAlign: "center" }}>No competitions found</Text>
            )}
            {competitionList.map((comp, index) => (
                <TouchableOpacity
                    key={comp.id}
                    disabled={processing}
                    onPress={() => {
                        onCompetitionPress(comp);
                    }}
                    style={{
                        padding: 20,
                        borderRadius: 10,
                        backgroundColor: index % 2 === 0 ? colors.border : colors.background,
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 16,
                        }}
                    >
                        {comp.name} ({new Date(comp.startTime).getFullYear()})
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};
