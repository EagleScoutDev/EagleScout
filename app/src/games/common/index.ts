import { Color } from "../../lib/color.ts";

export enum Alliance {
    red = "red",
    blue = "blue",
}
export namespace Alliance {
    export function toggle(x: Alliance): Alliance {
        return x === Alliance.red ? Alliance.blue : Alliance.red;
    }

    // TODO: put this with the rest of the theme stuff
    export function getColor(x: Alliance): Color {
        return x === Alliance.red ? Color.rgb(255, 0, 0) : Color.rgb(0, 0, 255);
    }
}

export enum Orientation {
    red = Alliance.red,
    blue = Alliance.blue,
}
export namespace Orientation {
    export function toggle(x: Orientation): Orientation {
        return x === Orientation.red ? Orientation.blue : Orientation.red;
    }
    export function getLeft(x: Orientation): Alliance {
        return x === Orientation.red ? Alliance.red : Alliance.blue;
    }
    export function fromAlliance(x: Alliance): Orientation {
        return x as unknown as Orientation;
    }
}
