import { type Setter } from "../../../lib/util/react/types";
import { UICardForm } from "../../../ui/UICardForm";
import { Alliance, type Orientation } from "../../../frc/common/common";

export interface MatchInformationProps {
    match: number | null;
    setMatch: Setter<number | null>;
    team: number | null;
    setTeam: Setter<number | null>;
    teamsForMatch: number[];

    orientation: Orientation;
    setOrientation: Setter<Orientation>;
    alliance: Alliance;
    setAlliance: Setter<Alliance>;
}
export function MatchInformation({
    match,
    setMatch,
    team,
    setTeam,
    teamsForMatch,
    orientation,
    setOrientation,
    alliance,
    setAlliance,
}: MatchInformationProps) {
    return (
        <UICardForm title={"Match Information"}>
            <UICardForm.NumberInput
                label={"Match Number"}
                placeholder="000"
                max={999}
                value={match}
                onInput={setMatch}
                error={
                    match === null
                        ? null
                        : match === 0
                        ? "Match number cannot be 0"
                        : match > 400
                        ? "Match number cannot be greater than 400"
                        : null
                }
            />
            <UICardForm.NumberInput
                label={"Team Number"}
                placeholder="000"
                max={999}
                value={team}
                onInput={setTeam}
                error={
                    team !== null && !teamsForMatch.includes(team) ? `Warning: Team ${team} is not in this match` : null
                }
            />
            <UICardForm.OrientationChooser
                label={"Field Orientation"}
                orientation={orientation}
                setOrientation={setOrientation}
                alliance={alliance}
                setAlliance={setAlliance}
            />
        </UICardForm>
    );
}
