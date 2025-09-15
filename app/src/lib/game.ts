export enum Alliance {
    red = "red",
    blue = "blue"
}
export function toggleAlliance(x: Alliance): Alliance {
    return x === Alliance.red ? Alliance.blue : Alliance.red
}

export enum Orientation {
    leftRed = "red",
    leftBlue = "blue"
}
