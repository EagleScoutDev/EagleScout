import { EnableScoutAssignmentsModal } from "../../../components/modals/EnableScoutAssignmentsModal";
import { useEffect, useRef, useState } from "react";
import { type CompetitionReturnData, CompetitionsDB, ScoutAssignmentsConfig } from "../../../database/Competitions";
import { NoInternet } from "../../../ui/NoInternet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UIList } from "../../../ui/UIList.tsx";
import { TabHeader } from "../../../ui/navigation/TabHeader.tsx";
import type { DataMenuScreenProps } from "../../data/DataMain.tsx";
import { UISheetModal } from "../../../ui/UISheetModal.tsx";

export interface ScoutAssignmentsMainProps extends DataMenuScreenProps<"ScoutAssignments"> {}
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
            <SafeAreaView style={{ flex: 1 }}>
                <TabHeader title={"Scout Assignments"} />
                <UIList loading={loading} onRefresh={loadCompetitions}>
                    {[
                        UIList.Section({
                            items: competitionList.map((comp, index) =>
                                UIList.Line({
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
                                })
                            ),
                        }),
                    ]}
                </UIList>
                <UISheetModal ref={sheetRef} handleComponent={null} children={EnableScoutAssignmentsModal} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
