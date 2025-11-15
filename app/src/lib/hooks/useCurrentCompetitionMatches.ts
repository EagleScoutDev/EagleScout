import { type TBAMatch, TBAMatches } from "../../database/TBAMatches";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormHelper } from "../../FormHelper";
import { CompetitionsDB } from "../../database/Competitions";
import { useCallback, useEffect, useState } from "react";

export const useCurrentCompetitionMatches = () => {
    const [competitionId, setCompetitionId] = useState<number>(-1);
    const [matches, setMatches] = useState<TBAMatch[]>([]);

    const loadMatches = async (competitionId: number) => {
        let dbRequestWorked;
        let dbMatches;
        try {
            dbMatches = await TBAMatches.getMatchesForCompetition(competitionId.toString());
            dbRequestWorked = true;
        } catch (e) {
            dbRequestWorked = false;
        }

        let matches;
        if (dbRequestWorked) {
            if (dbMatches != null) {
                matches = dbMatches;
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_MATCHES_KEY, JSON.stringify(dbMatches));
            }
        } else {
            const storedMatches = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_MATCHES_KEY);
            if (storedMatches != null) {
                matches = JSON.parse(storedMatches);
            }
        }
        if (matches != null) {
            setMatches(matches);
        }
    };

    const loadCompetition = async () => {
        let dbRequestWorked;
        let dbCompetition;
        try {
            dbCompetition = await CompetitionsDB.getCurrentCompetition();
            dbRequestWorked = true;
        } catch (e) {
            dbRequestWorked = false;
        }

        let comp;
        if (dbRequestWorked) {
            if (dbCompetition != null) {
                comp = dbCompetition;
                await AsyncStorage.setItem(FormHelper.ASYNCSTORAGE_COMPETITION_KEY, JSON.stringify(dbCompetition));
            }
        } else {
            const storedComp = await FormHelper.readAsyncStorage(FormHelper.ASYNCSTORAGE_COMPETITION_KEY);
            if (storedComp != null) {
                comp = JSON.parse(storedComp);
            }
        }
        if (comp != null) {
            setCompetitionId(comp.id);
            return comp.id;
        }
    };

    useEffect(() => {
        loadCompetition().then((competitionId) => {
            if (competitionId != null) {
                loadMatches(competitionId);
            }
        });
    }, []);

    const getTeamsForMatch = useCallback(
        (matchNumber: number) => {
            return matches
                .filter((match) => match.compLevel === "qm")
                .filter((match) => match.match === matchNumber)
                .sort((a, b) => (a.alliance === "red" ? -1 : 1))
                .map((match) => match.team.replace("frc", ""))
                .map((match) => match.replace(/[A-Za-z]/g, " "))
                .map((match) => Number(match));
        },
        [matches]
    );

    return { matches, competitionId, getTeamsForMatch };
};
