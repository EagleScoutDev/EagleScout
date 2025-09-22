import React, { useMemo } from "react";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Utility to factor useMemo() out of the render() function
 * @param factory
 */
export function exMemo<A extends any[], R extends any>(factory: (...args: A) => R): (...args: A) => R {
    return (...args) => {
        return useMemo(() => factory(...args), args)
    }
}
