import { useSyncExternalStore } from "react";

export class Signal<T> {
    private x: T;
    private subs: ((x: T) => any)[] = [];

    public constructor(initialValue: T) {
        this.x = initialValue;
    }

    public get(): T {
        return this.x;
    }
    public set(x: T) {
        this.x = x;
        for (let sub of this.subs) {
            sub(x);
        }
    }
    public sub(cb: (x: T) => any): () => void {
        this.subs.push(cb);
        return () => (this.subs = this.subs.filter((x) => x !== cb));
    }
}

export function useSignal<T>(signal: Signal<T>): T {
    return useSyncExternalStore(signal.sub.bind(signal), signal.get.bind(signal));
}
