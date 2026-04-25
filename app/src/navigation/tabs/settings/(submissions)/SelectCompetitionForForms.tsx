import { useQuery } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { SettingsTabScreenProps } from "../index";
import { UIList } from "@/ui/components/UIList";
import { queries } from "@/lib/queries";
import type { CompetitionReturnData } from "@/lib/db/models/Competition";

export function SelectCompetitionForForms({
    navigation,
}: SettingsTabScreenProps<"Scout/SelectCompetitionForReports">) {
    const { data: competitions = [], isLoading } = useQuery(queries.competitions.all);

    const handleCompetitionSelect = (competition: CompetitionReturnData) => {
        navigation.navigate("Scout/ViewReports", {
            competitionId: competition.id,
            competitionName: competition.name,
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UIList loading={isLoading}>
                    {competitions.length > 0 && (
                        <UIList.Section>
                            {competitions.map((competition) => (
                                <UIList.Row
                                    key={competition.id}
                                    label={competition.name}
                                    caret
                                    onPress={() => handleCompetitionSelect(competition)}
                                />
                            ))}
                        </UIList.Section>
                    )}
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
