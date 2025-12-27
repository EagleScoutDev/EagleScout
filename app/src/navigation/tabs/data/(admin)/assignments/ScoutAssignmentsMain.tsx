import { EnableScoutAssignmentsModal } from "@/components/modals/EnableScoutAssignmentsModal";
import { useEffect, useRef, useState } from "react";
import { type CompetitionReturnData, CompetitionsDB, ScoutAssignmentsConfig } from "@/lib/database/Competitions";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { DataTabScreenProps } from "@/navigation/tabs/data";
import { NoInternet } from "@/ui/NoInternet";
import { TabHeader } from "@/ui/components/TabHeader";
import { UIList } from "@/ui/components/UIList";
import { UISheetModal } from "@/ui/components/UISheetModal";

export interface ScoutAssignmentsMainProps extends DataTabScreenProps<"ScoutAssignments"> {}
export function ScoutAssignmentsMain({ navigation }: ScoutAssignmentsMainProps) {
    const [internetError, setInternetError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [competitionList, setCompetitionList] = useState<CompetitionReturnData[]>([]);

    const sheetRef = useRef<EnableScoutAssignmentsModal>(null);

    async function loadCompetitions() {
        setLoading(true);
        try {
            const data = await CompetitionsDB.getCompetitions();
            // sort the data by start time
            data.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
            setCompetitionList(data);
            console.log(data);
            setInternetError(false);
        } catch (error) {
            console.error(error);
            setInternetError(true);
        }
        setLoading(false);
    }
    useEffect(() => void loadCompetitions(), []);

    if (internetError) {
        return <NoInternet onRefresh={loadCompetitions} />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "left", "right"]}>
                <TabHeader title={"Scout Assignments"} />
            </SafeAreaView>

            <UIList loading={loading} onRefresh={loadCompetitions}>
                {UIList.Section({
                    items: competitionList.map((comp) =>
                        UIList.Label({
                            key: comp.id.toString(),
                            label: `${comp.name} (${new Date(comp.startTime).getFullYear()})`,
                            onPress: () => {
                                if (comp.scoutAssignmentsConfig === ScoutAssignmentsConfig.DISABLED) {
                                    navigation.navigate("ScoutAssignments/Table", {
                                        competition: comp.id,
                                    });
                                } else {
                                    sheetRef.current?.present(comp);
                                }
                            },
                        }),
                    ),
                })}
            </UIList>

            <UISheetModal ref={sheetRef} handleComponent={null} children={EnableScoutAssignmentsModal} />
        </SafeAreaProvider>
    );
}
