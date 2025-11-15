import type { Setter } from "../../../lib/util/react/types";
import { UICardForm } from "../../../ui/UICardForm.tsx";

export interface TeamInformationProps {
    team: number | null;
    setTeam: Setter<number | null>;
}
export function TeamInformation({ team, setTeam }: TeamInformationProps) {
    return (
        <UICardForm title={"Team Information"}>
            <UICardForm.NumberInput label={"Team Number"} placeholder="000" max={999} value={team} onInput={setTeam} />
        </UICardForm>
    );
}
