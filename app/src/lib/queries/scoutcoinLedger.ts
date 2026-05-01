import { Scoutcoin, type ScoutcoinLedgerItem } from "@/lib/db/models/Scoutcoin";
import { createQueryKeys } from "@/lib/util/defs";

export const scoutcoinLedger = createQueryKeys(["scoutcoinLedger"], {
    logs: {
        queryKey: [],
        queryFn: (): Promise<ScoutcoinLedgerItem[]> => Scoutcoin.getLedger(),
    },
    balanceForId: ({ id }: { id: string }) => ({
        queryKey: ["balances", { id }],
        queryFn: Scoutcoin.getBalance.bind(null, id),
    }),
    balanceForAll: {
        queryKey: ["balances"],
        queryFn: Scoutcoin.getAllBalances,
    },
});
