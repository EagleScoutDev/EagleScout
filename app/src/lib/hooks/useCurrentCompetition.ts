import { type CompetitionReturnData, CompetitionsDB } from "../../database/Competitions";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormHelper } from "../../FormHelper";

export function useCurrentCompetition(): { competition: CompetitionReturnData | null; online: boolean } {
    const [online, setOnline] = useState<boolean>(false);
    const [competition, setCompetition] = useState<CompetitionReturnData | null>(null);

    async function load() {
        try {
            setCompetition(await CompetitionsDB.getCurrentCompetition());

            setOnline(true);
            if (competition !== null) {
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY, JSON.stringify(competition));
            }
        } catch (e) {
            setOnline(false);

            const storedComp = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
            if (storedComp !== null) {
                setCompetition(JSON.parse(storedComp));
            }
        }
    }
    useEffect(() => void load(), []);

    return { competition, online };
}
