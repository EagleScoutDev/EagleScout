import { Picklists } from "@/lib/db/models/Picklist";
import { createQueryKeys } from "@/lib/util/defs";

export const tags = createQueryKeys(["tags"], {
    forPicklist: ({ picklistId }: { picklistId: number }) => ({
        queryKey: [{ picklistId }],
        queryFn: Picklists.getAllTags.bind(null, picklistId),
    }),
});
