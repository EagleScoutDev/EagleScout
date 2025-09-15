export enum Alliance {
    red = "red",
    blue = "blue"
}
export namespace Alliance {
    export function toggle(x: Alliance): Alliance {
        return x === Alliance.red ? Alliance.blue : Alliance.red
    }
    export function fromOrientation(x: Orientation): Alliance {
        return x as unknown as Alliance
    }
}

export enum Orientation {
    leftRed = Alliance.red,
    leftBlue = Alliance.blue
}
export namespace Orientation {
    export function toggle(x: Orientation): Orientation {
        return x === Orientation.leftRed ? Orientation.leftBlue : Orientation.leftRed
    }
    export function fromAlliance(x: Alliance): Orientation {
        return x as unknown as Orientation
    }
}
