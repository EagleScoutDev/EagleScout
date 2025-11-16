export namespace Arrays {
    export function group<T, K>(items: Iterable<T>, key: (x: T) => K): Map<K, T[]> {
        const out = new Map<K, T[]>();
        for (const item of items) {
            const k = key(item);
            const arr = out.get(k);
            if (arr === undefined) out.set(k, [item]);
            else arr.push(item);
        }
        return out;
    }

    export function push<T>(a: readonly T[], x: T) {
        return [...a, x];
    }

    export function set<T>(a: readonly T[], i: number, v: T) {
        const b = a.slice(0) satisfies readonly T[] as T[];
        b[i] = v;
        return b;
    }
}
