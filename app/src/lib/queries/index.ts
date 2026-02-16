// declare module "@tanstack/react-query" {
//     interface Register {
//         queryKey: [string, ...unknown[]];
//     }
// }

import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { competitions } from "@/lib/queries/competitions";
import { tba } from "@/lib/queries/tba";
import { matchReports } from "@/lib/queries/scouting";

export const queries = mergeQueryKeys(competitions, tba, matchReports)
