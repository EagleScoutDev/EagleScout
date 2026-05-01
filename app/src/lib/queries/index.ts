import { competitions } from "@/lib/queries/competitions";
import { tba } from "@/lib/queries/tba";
import { matchReports } from "@/lib/queries/scouting";
import { users } from "@/lib/queries/users";
import { forms } from "@/lib/queries/forms";
import { profiles } from "@/lib/queries/profiles";
import { matchBets } from "@/lib/queries/matchBets";
import { picklists } from "@/lib/queries/picklists";
import { pitReports } from "@/lib/queries/pitReports";
import { notes } from "@/lib/queries/notes";
import { scoutcoinLedger } from "@/lib/queries/scoutcoinLedger";
import { tbaMatches } from "@/lib/queries/tbaMatches";
import { tbaTeams } from "@/lib/queries/tbaTeams";
import { userAttributes } from "@/lib/queries/userAttributes";
import { tags } from "@/lib/queries/tags";
import { mergeQueryKeys } from "@/lib/util/defs";

export const queries = mergeQueryKeys({
    competitions,
    tba,
    matchReports,
    users,
    forms,
    profiles,
    matchBets,
    picklists,
    pitReports,
    notes,
    scoutcoinLedger,
    tbaMatches,
    tbaTeams,
    userAttributes,
    tags,
});
