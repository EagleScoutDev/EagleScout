import React from "react";

export function elementInstanceof<T extends React.FunctionComponent>(
    x: React.JSX.Element,
    type: T
): x is React.ReactElement<T extends React.FunctionComponent<infer P> ? P : never, T> {
    return x.type === type;
}
