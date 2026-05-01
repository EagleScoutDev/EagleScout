import { Profiles } from "@/lib/db/models/Profile";
import { createQueryKeys } from "@/lib/util/defs";
import { Account } from "@/lib/db/account";

export const profiles = createQueryKeys(["profiles"], {
    all: {
        queryKey: [],
        queryFn: Profiles.getAll,
    },
    forId: ({ id }: { id: string }) => ({
        queryKey: [{ id }],
        queryFn: Profiles.get.bind(null, id),
    }),
    current: {
        queryKey: ["current"],
        queryFn: async () => {
            const { id } = await Account.ensure();
            return Profiles.get(id);
        },
    },
});
