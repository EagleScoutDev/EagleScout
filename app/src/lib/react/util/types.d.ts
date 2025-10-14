import React from "react";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IInput<T> {
    value: T;
    onChange: (value: T) => void;
}
