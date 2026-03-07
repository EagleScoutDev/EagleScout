export enum Obstacles {
    B1 = 1,
    B2 = 2,
    T1 = 3,
    T2 = 4,
}
export namespace Obstacles {
    export function abbreviation(sx: Obstacles) {
        switch (sx) {
            case Obstacles.B1:
                return "B1";
            case Obstacles.B2:
                return "B2";
            case Obstacles.T1:
                return "T1";
            case Obstacles.T2:
                return "T2";
        }
    }
}
