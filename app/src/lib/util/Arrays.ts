export namespace Arrays {
    export function group<T, K>(items: Iterable<T>, key: (x: T) => K): Map<K, T[]> {
        const out = new Map<K, T[]>()
        for (const item of items) {
            const k = key(item)
            const arr = out.get(k)
            if(arr === undefined) out.set(k, [item])
            else arr.push(item)
        }
        return out
    }
}
