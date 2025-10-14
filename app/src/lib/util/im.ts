export namespace arr {
    export function push<T>(a: T[], x: T) {
        return [...a, x]
    }
    export function set<T>(a: T[], i: number, v: T) {
        a = a.slice(0)
        a[i] = v
        return a
    }
}
