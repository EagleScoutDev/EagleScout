export namespace Sets {
    export function add<T>(set: ReadonlySet<T>, x: T): Set<T> {
        const s = new Set(set);
        s.add(x);
        return s;
    }
    export function del<T>(set: ReadonlySet<T>, x: T): Set<T> {
        const s = new Set(set);
        s.delete(x);
        return s;
    }
}
