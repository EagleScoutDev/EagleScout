import { Forms } from "@/lib/db/models/Form";
import { createQueryKeys } from "@/lib/util/defs";

export const forms = createQueryKeys(["forms"], {
    all: {
        queryKey: [],
        queryFn: Forms.getAll,
    },
    forId: ({ id }: { id: number }) => ({
        queryKey: [{ id }],
        queryFn: Forms.get.bind(null, id),
    }),
} as const);
