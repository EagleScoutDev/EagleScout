import { supabase } from "@/lib/supabase";

export interface ScoutcoinLedgerItem {
    id: number;
    description: string;
    sourceUserId: string | null;
    sourceUserName: string | null;
    destinationUserId: string | null;
    destinationUserName: string | null;
    amountChange: number;
    createdAt: Date;
}

export interface ScoutcoinBalance {
    userId: string;
    balance: number;
}

export namespace Scoutcoin {
    const ledgerQuery = () =>
        supabase.from("scoutcoin_ledger").select(`
            id,
            description,
            sourceUserId:       src_user,
            destinationUserId:  dest_user,
            amountChange:       amount_change,
            createdAt:          created_at,
            ...profiles!scoutcoin_ledger_src_user_fkey(
                sourceUserId:   id,
                sourceUserName: name
            ),
            ...profiles!scoutcoin_ledger_dest_user_fkey(
                destinationUserId:      id,
                destinationUserName:    name
            )`);

    export async function getBalance(id: string): Promise<number> {
        const { data, error } = await supabase
            .from("profiles")
            .select("scoutcoins")
            .eq("id", id)
            .single();
        if (error) throw error;

        return data.scoutcoins;
    }

    export async function getAllBalances(): Promise<ScoutcoinBalance[]> {
        const { data, error } = await supabase
            .from("profiles")
            .select("userId:id, balance:scoutcoins");
        if (error) throw error;

        return data;
    }

    export async function getLedger(): Promise<ScoutcoinLedgerItem[]> {
        const { data, error } = await ledgerQuery().order("createdAt", {
            ascending: false,
        });
        if (error) throw error;

        return data.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
        }));
    }

    // FIXME: impure queries are below
    export async function send(recipientId: string, amount: number, reason: string) {
        const { data, error } = await supabase.functions.invoke("send-scoutcoin", {
            body: JSON.stringify({
                recipientId,
                amount,
                reason,
            }),
        });

        if (error) throw error;
        return data;
    }

    export async function purchaseItem(itemName: string) {
        const { data, error } = await supabase.functions.invoke("purchase-item", {
            body: JSON.stringify({
                itemName,
            }),
        });

        if (error) throw error;
        if (data !== "Success") throw new Error(data);
        return data;
    }
}
