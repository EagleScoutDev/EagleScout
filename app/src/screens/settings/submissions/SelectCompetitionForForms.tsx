import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { type CompetitionReturnData, CompetitionsDB } from "../../../database/Competitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIList } from "../../../ui/UIList";
import type { SettingsMenuScreenProps } from "../SettingsMenu";

export function SelectCompetitionForForms({
    navigation,
}: SettingsMenuScreenProps<"Scout/SelectCompetitionForReports">) {
    const [competitions, setCompetitions] = useState<CompetitionReturnData[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchCompetitions() {
        setLoading(true);
        try {
            const comps = await CompetitionsDB.getCompetitions();
            setCompetitions(comps);
        } catch (error) {
            console.error("Failed to fetch competitions:", error);
            Alert.alert("Error", "Failed to load competitions");
        }
        setLoading(false);
    }

    useEffect(() => {
        void fetchCompetitions();
    }, []);

    const handleCompetitionSelect = (competition: CompetitionReturnData) => {
        navigation.navigate("Scout/ViewReports", { competitionId: competition.id, competitionName: competition.name });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <UIList loading={loading}>
                    {[
                        competitions.length > 0 &&
                            UIList.Section({
                                items: competitions.map((competition) =>
                                    UIList.Label({
                                        key: competition.id,
                                        label: competition.name,
                                        caret: true,
                                        onPress: () => handleCompetitionSelect(competition),
                                    })
                                ),
                            }),
                    ]}
                </UIList>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
