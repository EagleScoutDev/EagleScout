import { Color } from "@/ui/lib/color";

export enum Alliance {
    red = "red",
    blue = "blue",
}
export namespace Alliance {
    export function toggle(x: Alliance): Alliance {
        return x === Alliance.red ? Alliance.blue : Alliance.red;
    }

    // TODO: make this configurable per-theme and consumed everywhere
    export function getColor(x: Alliance): Color {
        return x === Alliance.red ? Color.rgb(255, 0, 0) : Color.rgb(0, 0, 255);
    }
}

export enum Orientation {
    leftRed = Alliance.red,
    leftBlue = Alliance.blue,
}
export namespace Orientation {
    export function toggle(x: Orientation): Orientation {
        return x === Orientation.leftRed ? Orientation.leftBlue : Orientation.leftRed;
    }
    export function getLeft(x: Orientation): Alliance {
        return x === Orientation.leftRed ? Alliance.red : Alliance.blue;
    }
    export function fromAlliance(x: Alliance): Orientation {
        return x as unknown as Orientation;
    }
}
