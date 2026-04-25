import { Users } from "@/lib/db/models/User";
import { createQueryKeys } from "@/lib/util/defs";

export const userAttributes = createQueryKeys(["userAttributes"], {
    forId: ({ id }: { id: string }) => ({
        queryKey: [{ id }],
        queryFn: Users.get.bind(null, id),
    }),
});
