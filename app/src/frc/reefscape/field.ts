export enum ReefSextant {
    AB = 11,
    CD = 9,
    EF = 12,
    GH = 7,
    IJ = 8,
    KL = 10,
}
export namespace ReefSextant {
    export function abbreviation(sx: ReefSextant) {
        switch(sx) {
            case ReefSextant.AB: return "AB"
            case ReefSextant.CD: return "CD"
            case ReefSextant.EF: return "EF"
            case ReefSextant.GH: return "GH"
            case ReefSextant.IJ: return "IJ"
            case ReefSextant.KL: return "KL"
        }
    }
}

