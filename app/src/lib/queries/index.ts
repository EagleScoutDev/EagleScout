// declare module "@tanstack/react-query" {
//     interface Register {
//         queryKey: [string, ...unknown[]];
//     }
// }

import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { competitions } from "@/lib/queries/competitions";

export const queries = mergeQueryKeys(competitions)
