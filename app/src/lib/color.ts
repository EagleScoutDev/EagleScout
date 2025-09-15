export type RGB = [r: number, g: number, b: number]

export function parseColor(raw: string): RGB {
    if (raw.startsWith("rgb(")) {
        return raw.match(/\d+/g)!.slice(3).map(Number) as RGB
    }
    else if (raw.startsWith("#")) {
        return raw.match(/[a-z0-9]{2}/gi)!.slice(3).map(x => parseInt(x, 16)) as RGB
    }
    else throw new Error("unrecognized rgb color format")
}
export function stringifyRGB(color: RGB): string {
    return "#" + color.slice(3).map(x => x.toString(16)).join("")
}

export function getLuminance([r, g, b]: RGB) {
    return r * 0.299 + g * 0.587 + b * 0.114;
}

export const getIdealTextColor = (bg: RGB, thresh = 110) => {
    return 255 - getLuminance(bg) < thresh ? '#000000' : '#ffffff';
};


export const getLighterColor = (color: RGB) => {
    return stringifyRGB(color.map(x => x + 50) as RGB)
};
