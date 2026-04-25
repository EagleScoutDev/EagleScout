import { type CompetitionReturnData, CompetitionsDB } from "@/lib/db/models/Competition";
import { useEffect, useState } from "react";
import { useRootNavigation } from "@/navigation/hooks";

export function useCurrentCompetition(): {
    competition: CompetitionReturnData | null;
} {
    const [competition, setCompetition] = useState<CompetitionReturnData | null>(null);

    const navigation = useRootNavigation();

    async function load() {
        try {
            setCompetition(await CompetitionsDB.getCurrentCompetition());
        } catch (e) {
            // ignore
        }
    }
    useEffect(() => {
        void load();

        return navigation.addListener("focus", () => load());
    }, []);

    return { competition };
}
