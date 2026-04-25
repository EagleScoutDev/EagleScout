type KeyTuple = readonly [...unknown[]];
type Keyed = { queryKey: KeyTuple };

type PrefixKey<V extends Keyed, B extends KeyTuple, K extends string> = {
    [P in keyof V as P extends "queryKey" ? never : P]: V[P];
} & { readonly queryKey: readonly [...B, K, ...V["queryKey"]] };

type Queries<B extends KeyTuple, S> = {
    [K in keyof S]: S[K] extends ((arg: infer A) => infer R extends Keyed)
        ? (arg: A) => PrefixKey<R, B, K & string>
        : S[K] extends Keyed
          ? PrefixKey<S[K], B, K & string>
          : never;
};

type Schema = Record<string, Keyed | ((arg: any) => Keyed)>;

export function createQueryKeys<const B extends KeyTuple, const S extends Schema>(
    baseKey: B,
    schema: S,
): Queries<B, S> {
    const ret: any = {};
    for (const k in schema) {
        const v = schema[k];

        ret[k] =
            typeof v === "function"
                ? (arg: unknown) => {
                      let x = v(arg);
                      return {
                          ...x,
                          queryKey: [...baseKey, ...x.queryKey],
                      };
                  }
                : {
                      ...v,
                      queryKey: [...baseKey, ...v.queryKey],
                  };
    }

    return ret;
}

export function mergeQueryKeys<const S extends Record<string, Queries<any, any>>>(schema: S): S {
    return schema;
}
