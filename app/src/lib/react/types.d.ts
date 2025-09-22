import type React from "react"

export type State<Name, T> = {
    [k: Name]: T,
    [k: `set${Capitalize<Name>}`]: Setter<T>
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>
