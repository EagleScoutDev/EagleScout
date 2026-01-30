import type { Setter } from "@/lib/util/react/types";
import { UICard } from "@/ui/components/UICard";

export interface TeamInformationProps {
    team: number | null;
    setTeam: Setter<number | null>;
}
export function TeamInformation({ team, setTeam }: TeamInformationProps) {
    return (
        <UICard title={"Team Information"}>
            <UICard.NumberInput label={"Team Number"} placeholder="000" max={999} value={team} onInput={setTeam} />
        </UICard>
    );
}
