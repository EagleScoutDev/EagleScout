import { type TBAMatch, TBAMatches } from "@/lib/db/models/Match";
import { CompetitionsDB } from "@/lib/db/models/Competition";
import { useCallback, useEffect, useState } from "react";

export function useCurrentCompetitionMatches() {
    const [competitionId, setCompetitionId] = useState<number>(-1);
    const [matches, setMatches] = useState<TBAMatch[]>([]);

    const loadMatches = async (competitionId: number) => {
        try {
            const dbMatches = await TBAMatches.getMatchesForCompetition(competitionId.toString());
            if (dbMatches != null) {
                setMatches(dbMatches);
            }
        } catch (e) {
            // ignore
        }
    };

    const loadCompetition = async () => {
        try {
            const dbCompetition = await CompetitionsDB.getCurrentCompetition();
            if (dbCompetition != null) {
                setCompetitionId(dbCompetition.id);
                return dbCompetition.id;
            }
        } catch (e) {
            // ignore
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
                .sort((a, _) => (a.alliance === "red" ? -1 : 1))
                .map((match) => match.team.replace("frc", ""))
                .map((match) => match.replace(/[A-Za-z]/g, " "))
                .map((match) => Number(match));
        },
        [matches],
    );

    const getTeamsForMatchDetailed = useCallback(
        (matchNumber: number) => {
            return matches
                .filter(match => match.compLevel === 'qm')
                .filter(match => match.match === matchNumber);
            // .filter(match => match.alliance === alliance);
        },
        [matches],
    );

    return { matches, competitionId, getTeamsForMatch, getTeamsForMatchDetailed };
}
