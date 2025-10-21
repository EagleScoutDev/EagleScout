// TODO: this really shouldn't exist
const keys = new WeakMap<any, string>();
export function key(x: any): string {
    if (keys.has(x)) return keys.get(x)!;
    else {
        let key = Math.random().toString(36);
        keys.set(x, key);
        return key;
    }
}
