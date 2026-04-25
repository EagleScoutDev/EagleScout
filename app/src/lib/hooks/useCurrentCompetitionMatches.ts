import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

export function useCurrentCompetitionMatches() {
    const { data: currentComp = null } = useQuery(queries.competitions.current);
    const { data: matches = null } = useQuery({
        ...queries.tbaMatches.forComp({ id: currentComp?.id! }),
        enabled: currentComp !== null,
    });

    const competitionId = currentComp?.id ?? null;

    const getTeamsForMatch = useCallback(
        (matchNumber: number) => {
            if (matches === null) return [];

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
            if (matches === null) return [];

            return matches
                .filter((match) => match.compLevel === "qm")
                .filter((match) => match.match === matchNumber);
        },
        [matches],
    );

    return {
        matches,
        competitionId,
        getTeamsForMatch,
        getTeamsForMatchDetailed,
    };
}
